import React, {useState} from "react";
import { getAllAttendance, getUsers } from "../../https";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { formatDateAndTime } from "../../utils";

const Activities = () => {

    const [selectedUser, setSelectedUser] = useState(null);
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

    return (
        <div className="container mx-auto py-2 px-6 md:px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-[#f5f5f5] text-xl">
                        Attendance History
                    </h2>
                    <p className="text-sm text-[#ababab]">
                        Update and delete attendance
                    </p>
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
                            <th className="p-3 w-24">Actions</th>
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
                                    <tr key={index}>
                                        <td>{user?.name || "Unknown"}</td>
                                        <td>{item.type}</td>
                                        <td>{ formatDateAndTime(item.timestamp)}</td>
                                        <td>
                                            <button onClick={() => setSelectedUser(item.userId)}>Update</button>
                                            <button>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Activities;