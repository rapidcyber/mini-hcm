import React, { useEffect, useState } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import Users from "../components/dashboard/Users";
import Activities from "../components/dashboard/Activities";
import Modal from "../components/dashboard/Modal";
import { FaUsers } from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";

  const tabs = [
    { label: "Users", icon: <FaUsers /> },
    { label: "Activities", icon: <MdOutlineInventory /> },
  ];

const Dashboard = () => {

  useEffect(() => {
    document.title = "POS | Admin Dashboard"
  }, [])

  const [activeTab, setActiveTab] = useState("Users");


  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hide">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {tabs.map(({ label, icon}) => {
            return (
              <button
                key={label} 
                className={`
                  
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                  activeTab === label
                     ? "bg-[#262626]!"
                    : "bg-[#1a1a1a]! hover:bg-[#262626]"
                }`}
                onClick={() => setActiveTab(label) }
              >
                {label} {icon}
              </button>
            );
          })}
        </div>
      </div>
      { activeTab === "Users" && <Users />}
      { activeTab === "Activities" && <Activities />}
    </div>
  );
};

export default Dashboard;
