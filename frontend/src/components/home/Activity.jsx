import React from "react";

const Activity = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1 h-[150px] overflow-y-scroll scrollbar-hide">

            <h2 className="text-lg font-semibold text-gray-700 mb-2">Activity</h2>
            <p className="text-sm text-gray-600"><strong>Punch In:</strong> <span id="punchInTime">--:--:--</span></p>
            <p className="text-sm text-gray-600"><strong>Punch Out:</strong> <span id="punchOutTime">--:--:--</span></p>
            <p className="text-sm text-gray-600"><strong>Total Hours:</strong> <span id="totalHours">0:00</span></p>
        </div>        
    );
};

export default Activity;
