import React, { useEffect } from "react" ;

import { getMyAttendance } from "../../https";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { formatDateAndTime } from "../../utils";

const Activity = () => {

    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries(["my-attendance"]);
    }, [queryClient]);

    const { data: myAttendance, isError } = useQuery({
        queryKey: ["my-attendance"],
        queryFn: async () => {
            const response = await getMyAttendance();
            console.log(response.data.data);
            return response.data.data;
        },
        
        placeholderData: keepPreviousData
    })

    if(isError) {
        enqueueSnackbar("Cannot get your activity", { variant: "error" });
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1 h-[calc(100vh-10.5rem)] overflow-y-scroll scrollbar-hide">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Activity</h2>
            {
                myAttendance && myAttendance.length > 0 ? (
                    myAttendance.map((attendance, index) => (
                        <React.Fragment key={index}>
                            <p className="text-sm text-gray-300">
                                <strong>Punch <span className="capitalize">{attendance.type}</span>:</strong> &nbsp;
                                <span id={`punchInTime-${index}`}>{formatDateAndTime(attendance.timestamp)}</span>
                            </p>
                            <hr />
                        </React.Fragment>
                        ))
                    ) : (
                    <p>No attendance records found.</p>
                    )
                }
        </div>        
    );
};

export default Activity;
