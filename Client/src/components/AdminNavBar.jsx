import React, {useState,useContext} from 'react';
import { Link } from 'react-router-dom';
import { emptyProfile } from '../data/assets/asset';
import { NavLink } from 'react-router-dom';

import {TbSettings} from 'react-icons/tb'
import {BsBell} from 'react-icons/bs'
import { MdOutlineDashboard } from 'react-icons/md';
import { menu, close } from '../data/assets';
import { AppContext } from '../AppContext/AppContext';

import { AdminNavs} from '../data/contact';

const AdminNavBar = () => {
    const [toggle, setToggle] = useState(false);
    const { userData } = useContext(AppContext);
  return (
    <div className='w-full bg-white sm:h-full p-6 sm:py-7 sm:px-20 flex justify-between items-start'>

        <div className='text-lg md:text-2xl font-extrabold text-[#5E7CE8] cursor-pointer'>
            <Link to={'/Admin-Home'}>Tech Noob</Link>
        </div>
        <div className='w-auto hidden h-full sm:flex flex-row justify-around gap-3 items-center float-right'>
            <div>
                <BsBell className='sm:text-2xl cursor-pointer'/>
            </div>
            <div>
                <TbSettings className='sm:text-2xl cursor-pointer'/>
            </div>
            <NavLink to={'/admin/profile'}>
                <div className='rounded-full h-5 w-5 sm:w-8 sm:h-8 cursor-pointer'>
                    <img src={userData.photo || emptyProfile } alt="profile" className='rounded-full w-full h-full object-cover' />
                </div>
            </NavLink>
        </div>
        <div className='flex lg:hidden h-full items-center justify-center'>
                <img src={toggle ? close : menu} alt="menu" onClick={()=> setToggle((prev) => !prev)} className='h-4 w-4 cursor-pointer'/>

                <div className={`${toggle ? 'flex' : 'hidden'} bg-gray-100 p-4 rounded-md absolute top-12 right-0 mx-1 my-2 w-[375px] z-10 h-[29rem] sidebar flex-col transition`}>
                    <div className='flex font-normal justify-center items-center gap-3 list-none flex-col'>

                    <NavLink to={'/admin/dashboard'} onClick={()=> setToggle((prev) => !prev)}>
                    <div className='mb-12 w-[260px] h-[54px] flex items-center rounded-md text-black'>
                        <MdOutlineDashboard className='mr-5 text-2xl'/>
                        <h2 className='text-base capitalize'>dashboard</h2>
                    </div>
                            </NavLink>
                            {AdminNavs.map((nav, i) =>(
                            <NavLink
                                to={nav.link}
                                key={nav.id}
                                onClick={()=> setToggle((prev) => !prev)}
                                className={` w-[260px] h-[54px] text-black flex items-center rounded-md`}
                                >
                                <div className='mr-5 text-2xl'>{nav.icon}</div>
                                <h2 className='text-base'>{nav.title}</h2>
                            </NavLink>
                        ))}

                    </div>

                    {/* <div className='flex flex-col justify-center items-center mt-10 gap-5'>
                      </div> */}
                </div>
            </div>
    </div>
  )
}

export default AdminNavBar