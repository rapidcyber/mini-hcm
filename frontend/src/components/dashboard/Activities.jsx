import React, {useState} from "react";
import { getAllAttendance, getUsers, updateAttendance, deleteAttendance } from "../../https";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { formatDateAndTime, formatMinutesToHHMM } from "../../utils";
import { Interval, DateTime } from "luxon";
import Modal from "../shared/Modal";

const Activities = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPunch, setSelectedPunch] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
    const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
    const [dailySummary, setDailySummary] = useState([]);
    const [weeklyReport, setWeeklyReport] = useState([]);
    const queryClient = useQueryClient();

    const { data: resData } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await getUsers();
            return response;
        },
        placeholderData: keepPreviousData
    });

    const { data: attendance, isError } = useQuery({
        queryKey: ["attendance"],
        queryFn: async () => {
            const response = await getAllAttendance();
            return response;
        },
        placeholderData: keepPreviousData
    })

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
        console.log(e.target.value);
        queryClient.invalidateQueries(["attendance"]);
    }   

    if(isError) {
        enqueueSnackbar("Cannot get your activity", { variant: "error" });
    }

    const handleEditPunch = (punch) => {
        setSelectedPunch(punch);
        setIsModalOpen(true);
    }

    const updatePunch = (e) => {
        e.preventDefault();
        updateMutation.mutate(selectedPunch);
        
    }

    const updateMutation = useMutation({
        mutationFn: (reqData) => updateAttendance(reqData),
        onSuccess: (data) => {
            console.log(data);
            enqueueSnackbar(data.data.message, { variant: "success" });
            queryClient.invalidateQueries(["attendance"]);
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.log(error);
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
    });

    const handleDeletePunch = async (id) => {
        //confirm delete
        if (window.confirm("Are you sure you want to delete this punch?")) {
            console.log(id);
            await deleteAttendance(id);
            queryClient.invalidateQueries(["attendance"]);
            enqueueSnackbar("User deleted successfully!", { variant: "success" });
        }
    }

    

    const getDailySummaryPerUser = (user) => {
        const userAttendance = attendance?.data.data.filter((attendance) => attendance.userId === user.id);

        // Step 1: Sort by timestamp
        const sorted = userAttendance ? userAttendance?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
        
        // Step 2: Pair in/out sessions
        const pairedSessions = [];
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].type === "in" && sorted[i + 1].type === "out") {
                pairedSessions.push({           
                in: DateTime.fromISO(sorted[i].timestamp),
                out: DateTime.fromISO(sorted[i + 1].timestamp)
                });
                i++; // skip next since it's already paired
            }
        }

        let summary = [];
        
        if(user) {
            const grouped = [];            
            const sessions = pairedSessions.map((session) => {
                const date = session.in.toFormat("yyyy-MM-dd");
                const shiftStart = DateTime.fromFormat(`${date} ${user.schedule.start}`, "yyyy-MM-dd HH:mm", { zone: "Asia/Manila" });
                return {
                    date: shiftStart.toJSDate(),
                    in: session.in,
                    out: session.out,
                }
            });
    
            sessions.forEach(entry => {
                const dateKey = DateTime.fromISO(entry.in).toFormat("yyyy-MM-dd");
                if (!grouped[dateKey]) grouped[dateKey] = [];
                grouped[dateKey].push(entry);
            });
    
            summary = Object.entries(grouped).map(([date, entries]) => {
                const totalDuration = entries.reduce((total, entry) => {
                    const duration = entry.out.diff(entry.in, ["hours", "minutes", "seconds"]).toObject();
                    // return duration;
                    return total + duration.hours * 60 + duration.minutes;
                }, 0);
                
                const shiftStart = DateTime.fromFormat(`${date} ${user.schedule.start}`, "yyyy-MM-dd HH:mm", { zone: "Asia/Manila" });
                let shiftEnd = DateTime.fromFormat(`${date} ${user.schedule.end}`, "yyyy-MM-dd HH:mm", { zone: "Asia/Manila" });
                if (shiftEnd < shiftStart) {
                    shiftEnd = shiftEnd.plus({ days: 1 });
                }
                const firstIn = entries[0].in;
                const lastOut = entries[entries.length - 1].out;
                const Hourslate = firstIn.diff(shiftStart, ["hours", "minutes", "seconds"]).toObject();
                const Undertime = shiftEnd.diff(lastOut, ["hours", "minutes", "seconds"]).toObject();
                const OverTime = lastOut.diff(shiftEnd, ["hours", "minutes", "seconds"]).toObject();
                const nightStart = shiftStart.set({ hour: 22, minute: 0 });
                const nightEnd = shiftStart.plus({ days: 1 }).set({ hour: 6, minute: 0 });

                //compute night differencial
                const nightDuration = entries.reduce((total, entry) => {
                    const overlap = Interval.fromDateTimes(entry.in, entry.out).intersection(
                        Interval.fromDateTimes(nightStart, nightEnd)
                    );
                    if (overlap) {
                        return total + overlap.length("minutes");
                    }
                    return total;
                }, 0);
                
                return {
                    date,
                    workedHours: Math.max(0, totalDuration),
                    undertime: Math.max(0, Undertime.hours * 60 + Undertime.minutes),
                    late: Math.max(0, Hourslate.hours * 60 + Hourslate.minutes),
                    overtime: Math.max(0, OverTime. hours * 60 + OverTime.minutes),
                    nightDifferential: Math.max(0, nightDuration),    
                };
            });
        }

        return summary;
    }

    const getWeeklySummaryPerUser = (user) => {
        const dailySummary = getDailySummaryPerUser(user);
        

        const groupedByWeek = dailySummary.reduce((acc, entry) => {
            const weekStart = DateTime.fromISO(entry.date).startOf("week").toFormat("yyyy-MM-dd");
            if (!acc[weekStart]) acc[weekStart] = [];
            acc[weekStart].push(entry);
            return acc;
        }, {});

        console.log(groupedByWeek);

        return Object.entries(groupedByWeek).map(([weekStart, days]) => {
            const totals = days.reduce(
            (sum, day) => {
                const worked = day.workedHours;
                const late = day.late;
                const undertime = day.undertime;
                const overtime = day.overtime;
                const night = day.nightDifferential;

                return {
                    worked: sum.worked + worked,
                    late: sum.late + late,
                    undertime: sum.undertime + undertime,
                    overtime: sum.overtime + overtime,
                    nightDiff: sum.nightDiff + night
                };
            },
            { worked: 0, late: 0, undertime: 0, overtime: 0, nightDiff: 0 }
            );

            // console.log(totals);

            return {
                weekStart,
                workedHours: totals.worked,
                late: totals.late,
                undertime: totals.undertime,
                overtime: totals.overtime,
                nightDifferential: totals.nightDiff
            };
        });
    };

    const handleWeeklyReport = () => {
        const summary = [];
        resData?.data.data.map((user) => {
            const weeklySummaryPerUser = getWeeklySummaryPerUser(user);
            weeklySummaryPerUser.forEach((entry) => {
                summary.push({
                    name: user.name,
                    weekStart: entry.weekStart,
                    workedHours: entry.workedHours,
                    late: entry.late,
                    undertime: entry.undertime,
                    overtime: entry.overtime,
                    nightDifferential: entry.nightDifferential
                });
            });
        });
        console.log(summary);
        setWeeklyReport(summary);
        setIsWeeklyReportOpen(true);
    }

    const handleDailySummaryOpen = () => {
        setIsDailySummaryOpen(true);
        const summary = [];
        resData?.data.data.map((user) => {
            
            const dailySummaryPerUser = getDailySummaryPerUser(user);
            dailySummaryPerUser.forEach((entry) => {
                summary.push({
                    name: user.name,
                    date: entry.date,
                    workedHours: entry.workedHours,
                    late: entry.late,
                    undertime: entry.undertime,
                    overtime: entry.overtime,
                    nightDifferential: entry.nightDifferential
                });
            });

        });
        setDailySummary(summary);
    }
    

    return (
        <div className="container mx-auto py-2 px-6 md:px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-[#f5f5f5] text-xl">
                        Attendance History
                    </h2>
                    <p className="text-sm text-[#ababab]">
                        Update and delete attendance and sumary.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleDailySummaryOpen} className="bg-[#333] hover:bg-[#555] text-[#f5f5f5] text-sm py-2 px-4 rounded-md">
                        Daily Summary
                    </button>
                    <button onClick={handleWeeklyReport}className="bg-[#333] hover:bg-[#555] text-[#f5f5f5] text-sm py-2 px-4 rounded-md">
                        Weekly Report
                    </button>
                </div>
                <div>
                    <label htmlFor="employess" className="block mb-2 text-sm font-medium text-gray-100">Select Employee</label>
                    <select 
                        name="employees"
                        onChange={handleUserChange}
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        id="employees">
                        <option value="">All</option>
                        {resData?.data.data.map((user, index) => (
                            <option key={index} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>                
            </div>
            <div className="py-4">
                <table className="w-full text-left text-[#f5f5f5]">
                    <thead className="bg-[#333] text-[#ababab]">
                        <tr>
                            <th className="p-3">Employee</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3 w-46">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (selectedUser
                            ? attendance?.data.data.filter(item => item.userId === selectedUser)
                            : attendance?.data.data
                            )?.map((item, index) => {
                                const user = resData?.data.data.find(user => user.id === item.userId);

                                return (
                                    <tr key={index} className="border-b border-gray-600 hover:bg-[#333]/50">
                                        <td className="p-3">{user?.name || "Unknown"}</td>
                                        <td className="p-3">Punch <span className="capitalize">{item.type}</span></td>
                                        <td className="p-3">{ formatDateAndTime(item.timestamp)}</td>
                                        <td className="p-3 flex gap-2">
                                            <button className="hover:text-[#e6ff01]!" onClick={() => handleEditPunch(item)}>Edit</button>
                                            <button onClick={() => handleDeletePunch(item.id)} className="hover:text-[#e6ff01]!">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                            
                        }
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Punch">
                <form onSubmit={updatePunch}>
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-200">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={selectedPunch.type}
                            onChange={(e) => setSelectedPunch({ ...selectedPunch, type: e.target.value })}
                            className="mt-1 block w-full py-2 px-3 border text-[#f5f5f5] border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="in">Punch In</option>
                            <option value="out">Punch Out</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="timestamp" className="block text-sm font-medium text-gray-200">
                            Timestamp
                        </label>
                        <input
                            type="datetime-local"
                            id="timestamp"
                            name="timestamp"
                            defaultValue={DateTime.fromISO(selectedPunch.timestamp).toFormat("yyyy-MM-dd'T'HH:mm")}
                            onChange={(e) => setSelectedPunch({ ...selectedPunch, timestamp: e.target.value })}
                            className="mt-1 block w-full py-2 px-3 border text-[#f5f5f5] border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-500! text-white py-2 px-4 rounded-md hover:bg-indigo-600"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={isDailySummaryOpen} onClose={() => setIsDailySummaryOpen(false)} title="Daily Report">
                <table className="w-full text-left text-[#f5f5f5]">
                    <thead className="bg-[#333] text-[#ababab]">
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Employee</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Hours Worked</th>
                            <th className="p-2">Late</th>
                            <th className="p-2">Undertime</th>
                            <th className="p-2">OT</th>
                            <th className="p-2">ND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailySummary?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-600 hover:bg-[#333]/50">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.workedHours)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.late)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.undertime)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.overtime) }</td>
                                <td className="p-2">{formatMinutesToHHMM(item.nightDifferential)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
            <Modal isOpen={isWeeklyReportOpen} onClose={() => setIsWeeklyReportOpen(false)} title="Weekly Report">
                <table className="w-full text-left text-[#f5f5f5]">
                    <thead className="bg-[#333] text-[#ababab]">
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Employee</th>
                            <th className="p-2">Week Start</th>
                            <th className="p-2">Hours Worked</th>
                            <th className="p-2">Late</th>
                            <th className="p-2">Undertime</th>
                            <th className="p-2">OT</th>
                            <th className="p-2">ND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weeklyReport?.map((item, index) => (
                            <tr key={index} className="border-b border-gray-600 hover:bg-[#333]/50">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{new Date(item.weekStart).toLocaleDateString()}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.workedHours)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.late)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.undertime)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.overtime)}</td>
                                <td className="p-2">{formatMinutesToHHMM(item.nightDifferential)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </div>
    )
};

export default Activities;