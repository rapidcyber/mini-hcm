import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        type: "",
        role: false,
        timezone: "Asia/Manila",
        scheduleStart: null,
        scheduleEnd: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // const handleRoleSelection = () => {
    //     setFormData({ ...formData, role: selectedRole });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            type: formData.type,
            role: formData.role,
            timezone: formData.timezone,
            schedule: {
                start: formData.scheduleStart,
                end: formData.scheduleEnd
            }
        };

        console.log(userData);
        registerMutation.mutate(userData);
    }

    const registerMutation = useMutation({
        mutationFn: (reqData) => register(reqData),
        onSuccess: (data) => {
            console.log(data);
            enqueueSnackbar(data.data.message, { variant: "success" });
            navigate("/");
        },
        onError: (error) => {
            console.log(error);
            enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
    });

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Employee Name
                    </label>
                    <div className="flex item-center rounded-lg py-4 px-3 bg-[#1F1F1F]">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter employee name"
                            className="bg-transparent flex-1 text-white focus:outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Employee Email
                    </label>
                    <div className="flex item-center rounded-lg py-4 px-3  bg-[#1F1F1F]">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter employee email"
                            className="bg-transparent flex-1 text-white focus:outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[#ababab] mb-2 text-sm font-medium">
                        Password
                    </label>
                    <div className="flex item-center rounded-lg py-4 px-3  bg-[#1F1F1F]">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="bg-transparent flex-1 text-white focus:outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="timezone" className="block text-[#ababab] mb-2 text-sm font-medium">
                        Timezone
                    </label>
                    <div className="flex item-center rounded-lg py-4 px-3  bg-[#1F1F1F]">
                        <input
                            id="timezone"
                            list="timezones"
                            type="text"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="bg-transparent flex-1 text-white focus:outline-none"
                            required
                        />
                        <datalist id="timezones">
                            <option value="Asia/Manila" />
                            <option value="America/New_York" />
                            <option value="Europe/London" />
                        </datalist>
                    </div>
                </div>
                <div>
                    <fieldset className="flex gap-2">
                        <legend className="block text-[#ababab] mb-2 text-sm font-medium">
                            Employee Schedule
                        </legend>
                        <div className="flex gap-2 items-center text-[#ababab]">
                            <label className="items-center">
                                Start
                            </label>
                            <div className="flex item-center rounded-lg py-4 px-3  bg-[#1F1F1F]">
                                <input
                                    type="time"
                                    name="scheduleStart"
                                    defaultValue="09:00"
                                    onChange={handleChange}
                                    className="bg-transparent w-full text-white focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 text-[#ababab]">
                            
                            <label className="flex items-center">
                                End
                            </label>
                            <div className="flex item-center rounded-lg py-4 px-3  bg-[#1F1F1F]">
                                <input
                                    type="time"
                                    name="scheduleEnd"
                                    defaultValue="18:00"
                                    onChange={handleChange}
                                    className="bg-transparent w-full text-white focus:outline-none"
                                />
                            </div>

                        </div>
                    </fieldset>
                </div>

                <button type="submit" className="w-full rounded-lg hover:bg-yellow-600 mt-6 py-3 text-lg bg-yellow-400! text-gray-800 font-semibold">
                    Register
                </button>
            </form>
        </div>
    )
}
export default Register;