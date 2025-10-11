import React from "react";
// import { formatDateAndTime } from "../../utils";

const WeeklyReport = () => {
    // console.log(selectedUser);

    return (
        <div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

                <thead>
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            User
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Punch
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Time
                        </th>
                    </tr>
                </thead>

                {/* {attendance?.map((attendance, index) => {
                 

                    return (
                        <tr>
                            <td className="py-4 px-6">{attendance.userId.name}</td>
                            <td className="text-sm text-gray-300">
                                <strong>Punch <span className="capitalize">{attendance.type}</span>:</strong>{" "}
                                
                            </td>
                            <td><span id={`punchInTime-${index}`}>{formatDateAndTime(attendance.timestamp)}</span></td>
                        </tr>
                    )
                })} */}
            </table>
        </div>
        


    );
};

export default WeeklyReport;