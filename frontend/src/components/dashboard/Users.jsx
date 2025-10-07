import React, { useState } from "react";
import { getUsers, updateUser, deleteUser, register} from "../../https";
import { keepPreviousData,useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import Modal from "../shared/Modal";
import { formatTime24to12 } from "../../utils";

/**
 * Users
 *
 * A React component to display the users.
 *
 * @returns {React.ReactElement} The component.
 */
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
            if(!user._id) {
                return await register(user);
            }
            user.userId = user._id;
            return await updateUser(user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            enqueueSnackbar(!selectedUser._id ? "User registered successfully!" : "User updated successfully!", { variant: "success" });
            handleCloseModal();
        },
        onError: (error) => {
            console.log(error);
            const { data } = error.response;
            enqueueSnackbar(data.message, { variant: "error" })
            
        }
    });

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
            queryClient.invalidateQueries(["users"]);
            enqueueSnackbar("User deleted successfully!", { variant: "success" });
        }
    }   

    return (
        <div className="container mx-auto py-2 px-6 md:px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-[#f5f5f5] text-xl">
                        Users
                    </h2>
                    <p className="text-sm text-[#ababab]">
                        Update and delete users
                    </p>
                </div>
            </div>
            <div className=" py-2 overflow-x-auto">
                <table className="w-full text-left text-[#f5f5f5]">
                    <thead className="bg-[#333] text-[#ababab]">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Schedule</th>
                            <th className="p-3 w-[200px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resData?.data.data.map((user, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-600 hover:bg-[#333]"
                            >
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.role ? 'Admin' : 'Employee'}</td>
                                <td className="p-3">{formatTime24to12(user.schedule.start)} - {formatTime24to12(user.schedule.end)}</td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={()=> handleOpenModal(user)} className="px-4 py-2 focus:text-[#f5f5f5] hover:bg-[#262626] rounded-md text-[#f5f5f5] bg-[#1a1a1a]!">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteUser(user._id)} className="px-4 py-2 focus:text-red-500 hover:bg-[#262626] rounded-md text-[#f5f5f5] bg-[#1a1a1a]!">
                                        Delete
                                    </button>
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
                    <div>
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
                    </div>
                    <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="phone">Phone Number</label>
                        <div className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f]">
                            <input type="number" id="phone" name="phone" 
                                placeholder="Enter employee phone number"
                                defaultValue={selectedUser ? selectedUser.phone : ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                                required className="bg-transparent flex-1 text-white focus:outline-none" />
                        </div>
                    </div>
                    <div>
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
                    </div>
                    <div>
                        <label
                            className="block text-[#ababab] mb-2 mt-3 text-sm font-medium" htmlFor="role">Role</label>
                        <select 
                            name="role" id="role"
                            value={selectedUser ? selectedUser.role : ""}
                            className="flex item-center rounded-lg py-4 px-5 bg-[#1f1f1f] text-white focus:outline-none border-transparent border-r-10"
                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            required>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="cashier">Cashier</option>
                            <option value="kitchen">Kitchen Staff</option>
                        </select>
                    </div>    
                    
                    <button type="submit"
                        className="w-full bg-[#F6B100] text-gray-900 hover:text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700">Submit</button>
                </form>
            </Modal>
        </div>
  );
};

export default Users;