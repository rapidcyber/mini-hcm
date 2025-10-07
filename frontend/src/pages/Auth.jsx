import React, { useEffect, useState } from "react";
import authImage from "../assets/images/auth.webp"
import logo from "../assets/react.svg"
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {

    useEffect(() => {
        document.title = "Mini HCM | Auth"
    }, [])

    const [
        isRegister,
        setIsRegister
    ] = useState(false);

    return (
        <div className='flex min-h-screen w-full'>
            {/* Left section */}
            <div className='w-1/2 relative items-center justify-center bg-cover'>
                <img className='w-full h-full object-cover' src={authImage} alt="Restaurant Image" />
                <div className='aboslute inset-0 bg-black/80'></div>
                <blockquote className='absolute bottom-10 px-8 mb-10 text-2xl italic text-white'>
                    Early Is On Time, On Time Is Late, And Late Is Unacceptable.
                    <br />
                    <span className='block mt-4 text-yellow-400'>
                    PROBLEM LOGGING IN? FEEL FREE TO CONTACT US @ 02-8-928-6742,
                    0906-071-1320
                    </span>
                </blockquote>
            </div>
            {/* Right Side */}
            <div className='w-1/2 min-h-screen bg-[#1a1a1a] p-10'>
                <div className='flex flex-col items-center gap-2'>
                    <img src={logo} className='logo logo-spin react' alt="React Logo" />
                    <div className='text-center'>
                        <h1 className='text-4xl text-[#f5f5f5] tracking-wide'>Mini HCM</h1>
                        <p className='font-semibold text-[#f5f5f5]'>Time Tracking - Activity</p>
                    </div>
                    <h2 className='text-3xl text-center mt-10 text-yellow-400 mb-10'>
                        {isRegister ? "Register" : "Login"} Employee
                    </h2>
                    {/* Components */}
                    {isRegister ? <Register/> : <Login />}


                    <div className='flex items-center justify-center mt-6 text-[#ababab]'>
                        
                        {isRegister ? "Already" : "Don't"} have an account?&nbsp;
                        <button onClick={() => setIsRegister(!isRegister)} className='appearance-none! text-yellow-500! bg-transparent! border-0! hover:border-b-2! p-0! rounded-none hover:border-0'>
                            {isRegister ? "Log in" : "Register"}
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
