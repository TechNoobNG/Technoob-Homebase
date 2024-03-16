


import { MdOutlineNoteAdd, MdPermIdentity } from 'react-icons/md';
import { BsFileEarmarkSpreadsheet } from 'react-icons/bs';
import { HiArrowsRightLeft } from 'react-icons/hi2';
import serverApi from '../../../utility/server';
import { useContext, useEffect, useState } from 'react';
import RecentActivities from '../../../components/Tables/RecentActivities';
import { AppContext } from '../../../AppContext/AppContext';
// import img from '../img/Annotation 2023-05-22 185307.jpg'
// import { AppContext } from '../../../AppContext/AppContext';
// import Cookies from "universal-cookie";
// const cookies = new Cookies();

const Dashboard = () => {
  const [data, setData] = useState(null)
  const statistics = [
    {
      name : 'Uploads',
      amount : data?.resourceMetrics?.uploads,
      amtlabel : 'Documents',
      tracks :` ${data?.resourceMetrics?.uploads }+ downloads`,
      icon : <MdOutlineNoteAdd/>,
      style : 'bg-green-100 text-tgreen'
    },
    {
      name : 'Users',
      amount : data?.userMetrics?.total,
      amtlabel : 'Total Users',
      tracks : '80 New Users',
      icon : <MdPermIdentity/>,
      style : 'text-[#D4C433] bg-yellow-100'
    },
    {
      name : 'Downloads',
      amount : data?.resourceMetrics?.downloads,
      amtlabel : 'Downloads',
      tracks : `${data?.resourceMetrics?.downloads } downloads`,
      icon : <BsFileEarmarkSpreadsheet/>,
      style : 'text-[#114FF580] bg-blue-100'
    },
    {
      name : 'Traffic',
      amount : data?.trafficMetric?.totalCount,
      amtlabel : 'Views',
      tracks : '3600 views',
      icon : <HiArrowsRightLeft/>,
      style : 'text-[#6835BA80] bg-purple-100'
    }
  ];
  const {UserProfile} = useContext(AppContext);
  const username = null;

  useEffect(() => {
    
    const AdminStats = async () => {
      serverApi.requiresAuth(true)
      const result = await serverApi("/admin/dashboard")
      setData(result?.data?.data)
      console.log(result);
    }

    AdminStats()
  
  }, [])
  

  return (
    <section>
     <div className="flex justify-between ">
      <div className="flex  sm:flex-row mb-5 md:mb-0 py-1 sm:py-5 justify-start sm:justify-center items-start sm:items-center ">
          <h1 className=" md:text-3xl text-xl font-semibold">Hey, {UserProfile.firstname} -</h1>
          <p className="md:pt-2 pt-1 text-sm ml-3 sm:text-lg text-[#3A3A3A66] sm:text-black">
            Welcome to the resource page.
          </p>
        </div>
      </div>
        <div className=' lg:mx-5 px-10 py-5 rounded-xl bg-white w-full pb-20 '>
          <h1 className=' text-2xl lg:py-4 font-semibold'>Admin Overview</h1>
          <p className='text-lg'>Statistics</p>
          <div className=' md:flex block w-full justify-between pb-3 '>
            {statistics.map((opt, i) => (
              <div key={i} className=' p-3 shadow-md rounded-md my-2 mx-2 lg:w-[80%] lg:h-auto'>
                <p className=' py-3 px-2 flex text-[#71717A] justify-between w-[auto]'>{opt.name}<span className={`${opt.style} rounded-full p-2`}>{opt.icon}</span> </p>
                <p className=' p-2'><span className=' font-bold text-xl'>{opt.amount}</span> {opt.amtlabel} </p>
                <p className=' p-2 text-[#35BA83]'>{opt.tracks} </p>
              </div>
            ))}
          </div>
          <div className=' flex py-10 border-t-2 border-b-2'>
            <p className=' font-semibold text-lg  ml-10 mt-3'>Traffic Report</p>
            <span className=' border ml-14 p-2 rounded-full bg-[#bbc5e780]'>
              <button className=' bg-[#5E7CE880] text-twhite p-2 rounded-full border w-[120px] hover:bg-[#5E7CE880] hover:text-twhite shadow
              '>Last Year</button> <button className=' p-2 rounded-full border bg-twhite w-[120px] hover:bg-[#5E7CE880] hover:text-twhite
              '>6 Months</button> <button className=' p-2 rounded-full border bg-twhite w-[120px] hover:bg-[#5E7CE880] hover:text-twhite
              '>3 Months</button> <button className=' p-2 rounded-full border bg-twhite w-[120px] hover:bg-[#5E7CE880] hover:text-twhite
              '>30 Days</button> <button className=' p-2 rounded-full border bg-twhite w-[120px] hover:bg-[#5E7CE880] hover:text-twhite
              '>7 Days</button>
            </span>
          </div>
          {/* <img src={img} alt="Chart" className=' w-full' /> */}
      <RecentActivities/>
        </div>
    </section>
  )
}

export default Dashboard