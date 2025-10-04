import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDate, formatTime } from '../../utils';
const Greetings = () => {
    const userData = useSelector(state => state.user);

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);



    return (
        <div className='flex justify-between items-center px-8 mt-5'>
            <div>
                <h3 className='text-[#F5F5F5] text-2xl tracking-wide'>Welcome <span className='capitalize'>{userData.name || "TEST USER"}</span>!</h3>
                <p className='text-[#ababab] text-sm '>We're glad to see you at the Mini HCM Time Tracking - Activity System.</p>
            </div>
            <div>
                <h3 className='text-[#f5f5f5] font-bold text-3xl tracking-wide w-[250px]'>{formatTime(dateTime)}</h3>
                <p className='text-[#ababab]'>{formatDate(dateTime)}</p>
            </div>
        </div>
    );
};

export default Greetings;