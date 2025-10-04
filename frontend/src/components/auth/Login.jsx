import React, { useState } from "react";
// import { useMutation } from "@tanstack/react-query"
// import { login } from ',,/https';
// import { enqueueSnackbar } from "notistack";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../redux/slices/userSlice";
// import { useNavigate } from "react-router-dom";

const Login = () => {

    // const navigate = useNavigate();
    // const dispatch = useDispatch();


    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = () => {
        console.log('Logged in');
        // loginMutation.mutate(formData);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // const loginMutation = useMutation({
    //     mutationFn: (reqData) => login(reqData),
    //     onSuccess: (res) => {
    //         const { data } = res;
    //         const { _id, name, email, schedule, role } = data;
            
    //         dispatch(setUser({ _id, name, email, schedule, role }));
    //         navigate("/");
    //     },
    //     onError: (error) => {
    //         const { response } = error;
    //         enqueueSnackbar(response.data.message, { variant: "error" });
    //     }
    // })
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
                        className="w-full hover:bg-yellow-500! rounded-lg mt-6 py-3 text-lg bg-yellow-400! text-green-800 hover:text-black font-bold!"
                    >
                        Log in
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;