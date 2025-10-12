import React, { useState } from "react";
import { getUsers, updateUser, deleteUser } from "../../https";
import { keepPreviousData,useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { formatTime24to12 } from "../../utils";


const Users = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const queryClient = useQueryClient();

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const { data: resData, isError } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await getUsers();
            return response;
        },
        placeholderData: keepPreviousData
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    const handleUpdateUser = (e) => {
        e.preventDefault();
        updateUserMutation.mutate(selectedUser);
    }

    const updateUserMutation = useMutation({
        mutationFn: async (user) => {
            user.userId = user.id;
            user.scheduleStart = user.schedule.start;
            user.scheduleEnd = user.schedule.end;
            if(user.role === 0) {
                user.role = false;
            }
            return await updateUser(user);
        },

        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            enqueueSnackbar("User updated successfully!", { variant: "success" });
            handleCloseModal();
        },
        onError: (error) => {
            console.log(error);
            const { data } = error.response;
            enqueueSnackbar(data.message, { variant: "error" })
            
        }
    });

    const handleDeleteUser = async (user) => {
        if (window.confirm("Are you sure you want to delete this user? All data will be lost.")) {
            
            await deleteUser(user.id);
            queryClient.invalidateQueries(["users"]);
            enqueueSnackbar("User deleted successfully!", { variant: "success" });
        }
    }
    const handleCheckboxChange = (e) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name]: e.target.checked
        });
    }

    return (
        <div className="container mx-auto py-2 px-6 md:px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-[#f5f5f5] text-xl">
                        Users
                    </h2>
                    <p className="text-sm text-[#ababab]">
                        Update and delete users.
                    </p>
                </div>
            </div>
            <div className=" py-2 overflow-x-auto">
                <table className="w-full text-left text-[#f5f5f5]">
                    <thead className="bg-[#333] text-[#ababab]">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Rsession.in.toJSDaole</th>
                            <th className="p-3">Timezone</th>
                            <th className="p-3">Schedule</th>
                            <th className="p-3 w-[250px]">Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resData?.data.data.map((user, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-600 hover:bg-[#333]/50"
                            >
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.role ? 'Admin' : 'Employee'}</td>
                                <td className="p-3">{user.timezone}</td>
                                <td className="p-3">
                                    {formatTime24to12(user.schedule.start)} - {formatTime24to12(user.schedule.end)}
                                </td>
                                <td className="p-3 flex gap-2">
                                    {/* <button onClick={()=> handleOpenModal(user)} className="hover:text-[#e6ff01]!">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="hover:text-[#e6ff01]!">
                                        Delete
                                    </button> */}
                                    <button onClick={()=> handleOpenModal(user)} className="hover:text-[#e6ff01]!">Edit</button>
                                    <button onClick={()=> handleDeleteUser(user)} className="hover:text-[#e6ff01]!">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedUser ? "Edit User" : "Add User"}>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="name">Name</label>
                        <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                            <input
                                type="text"
                                id="name"
                                className="bg-transparent flex-1 text-white focus:outline-none"
                                placeholder="Enter employee name"
                                defaultValue={selectedUser ? selectedUser.name : ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                required
                                name="name"
                            />
                        </div>
                    </div>
                    {/* <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="email">Email</label>
                        <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                            <input
                                type="email" 
                                id="email" 
                                className="bg-transparent flex-1 text-white focus:outline-none"
                                name="email"
                                defaultValue={selectedUser ? selectedUser.email : ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                placeholder="Enter employee email"
                                required
                                />
                        </div>
                    </div> */}
                    <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="phone">Timezone</label>
                        <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                            <input type="text" list="timezones" id="timezone" name="timezone" 
                                placeholder="Asia/Manila"
                                defaultValue={selectedUser ? selectedUser.timezone : ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, timezone: e.target.value })}
                                required className="bg-transparent flex-1 text-white focus:outline-none" />
                            <datalist id="timezones">
                                <option value="Asia/Manila">Asia/Manila</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="America/Los_Angeles">America/Los_Angeles</option>
                                <option value="Europe/London">Europe/London</option>
                            </datalist>
                        </div>
                    </div>
                    {/* <div>
                        <label 
                            className="block text-[#ababab] mb-2 mt-3 text-sm font-medium"
                            htmlFor="password">Password</label>
                        <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                            <input type="password" id="password" name="password"
                                className="bg-transparent flex-1 text-white focus:outline-none"
                                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                placeholder="Enter employee password"
                                />
                        </div>
                    </div> */}
                    <div>
                        <label className="flex items-center gap-2 text-[#ababab] mb-2 mt-3 text-sm font-medium">
                            <input
                                id="role"
                                type="checkbox"
                                name="role"
                                checked={selectedUser ? selectedUser.role : false}
                                onChange={handleCheckboxChange}
                                className="w-4 h-4"
                            />
                            Admin Role
                        </label>
                    </div>

 
                    <div className="flex gap-3">
                        <div>
                            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="scheduleStart">Schedule Start</label>
                            <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                                <input type="time" id="scheduleStart" name="scheduleStart"
                                    defaultValue={selectedUser ? selectedUser.schedule.start : ""}
                                    className="bg-transparent flex-1 text-white focus:outline-none"
                                    onChange={(e) => setSelectedUser({ ...selectedUser, scheduleStart: e.target.value })}
                                    />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="scheduleEnd">Schedule End</label>
                            <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                                <input type="time" id="scheduleEnd" name="scheduleEnd"
                                    defaultValue={selectedUser ? selectedUser.schedule.end : ""}
                                    className="bg-transparent flex-1 text-white focus:outline-none"
                                    onChange={(e) => setSelectedUser({ ...selectedUser, scheduleEnd: e.target.value })}
                                    />
                            </div>
                        </div>
                    </div>
                    <button type="submit"
                        className="w-full bg-[#F6B100]! text-gray-900 hover:text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">Submit</button>
                </form>
            </Modal>
        </div>
  );
};

export default Users;