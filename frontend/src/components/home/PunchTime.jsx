import React from "react";
import { MdOutlinePunchClock } from "react-icons/md";
import { MdPunchClock } from "react-icons/md";

const PunchTime = () => {
    return (
        <div className="p-8 w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Punch Time</h2>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full flex justify-around gap-4">
                <button id="punchInBtn" className="bg-green-500! font-bold! w-full text-white px-4 py-2 text-2xl! rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                    <MdPunchClock className="inline-block mr-2" />
                    Punch In
                </button>
                <button id="punchOutBtn" className="bg-red-500! font-bold! w-full text-white px-4 py-2 text-2xl! rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                    <MdOutlinePunchClock className="inline-block mr-2" />
                    Punch Out
                </button>
            </div>
        </div>
    );
};

export default PunchTime;