import React from 'react';

import Greetings from '../components/home/Greetings';
import PunchTime from '../components/home/PunchTime';
import Activity from '../components/home/Activity';

const Home = () => {

    return (
        <section className='bg-[#1f1f1f] h-[calc(100vh-8rem)] pb-5 overflow-hidden flex gap-3'>
            {/* Left DIV */}
            <div className='flex-[3] overflow-y-scroll scrollbar-hide'>
                <Greetings />
                <div className='flex items-center w-full gap-3 px-8 mt-8'>
                    <PunchTime />
   
                </div>
                <div>
                    
                </div>
            </div>
            {/* Right DIV */}
            <div className='flex-[2] p-5'>
                <Activity />
            </div>
            
        </section>
    );
};

export default Home;