import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllAttendance } from "../../https";
import { formatDateAndTime } from "../../utils";
import FullScreenLoader from "../shared/FullScreenLoader";



const DailyReport = (selectedUser) => {
    
    const { data: attendance, isLoading } = useQuery({
        queryKey: ["attendance"],
        queryFn: async () => {
            const response = await getAllAttendance();

            if(selectedUser){
                response.data.data = response.data.data.filter((attendance) => attendance.userId === selectedUser.id);
            }
            
            return response;
        },
        
            placeholderData: keepPreviousData
        }
    );
    
    if(isLoading){
        return <FullScreenLoader />
    }
    
    

    return (
        <div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <thead>
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            Punch
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Time
                        </th>
                    </tr>
                </thead>

                {attendance?.data.data.map((attendance, index) => {
                 

                    return (
                        <tr>
                            <td className="text-sm text-gray-300">
                                <strong>Punch <span className="capitalize">{attendance.type}</span>:</strong>{" "}
                                
                            </td>
                            <td><span id={`punchInTime-${index}`}>{formatDateAndTime(attendance.timestamp)}</span></td>
                        </tr>
                    )
                })}
            </table>
        </div>
        


    );
};

export default DailyReport;