import React, { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = () => {
        console.log('Logged in');
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Employee Email
                    </label>
                    <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
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
                    <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                            Password
                        </label>
                        <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="bg-transparent flex-1 text-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full hover:bg-yellow-500! rounded-lg mt-6 py-3 text-lg bg-yellow-400! text-gray-900 font-bold"
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;