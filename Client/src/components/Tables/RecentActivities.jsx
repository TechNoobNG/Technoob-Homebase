import React from 'react'

const RecentActivities = () => {
  return (
    <div>
    <div className=' flex justify-between'>
      <div>
        <h2 className=' text-xl font-semibold pt-4'>Recent Activities</h2>
        <p className=' text-lg text-[#747272] mb-1'>See list of resent activities</p>
      </div>
      <button className='float-right border py-2 px-8 my-[20px] rounded flex justify-between shadow-sm'>Weekly</button>
    </div>
    <div className='flex overflow-x-auto'>
      <table className=' border-t border-b w-full overflow-x-auto'>
        <thead>
          <tr>
          <td><h4 className=' font-semibold text-lg'>Name</h4></td>
          <td><h4 className=' px-14 font-semibold text-lg'>File</h4></td>
          <td><h4 className=' px-14 font-semibold text-lg'>Category</h4></td>
          <td><h4 className=' px-14 font-semibold text-lg'>Track</h4></td>
          <td><h4 className=' px-14 font-semibold text-lg'>Author</h4></td>
          <td><div  className=' text-sm flex justify-between mb-2'><p>status</p> <span>...</span></div></td>
        </tr>
        </thead>
        <tbody>
          <tr className=''>
          <td><p className=' text-sm'>Dont make me think</p></td>
          <td><p className=' px-14 text-sm'>PDF</p></td>
          <td><p className=' px-14 text-sm'>Book</p></td>
          <td><p className=' px-14 text-sm'>Design</p></td>
          <td><p className=' px-14 text-sm'>Don Norman</p></td>
          <td> <span className=' bg-green-700 w-2 h-2 rounded-full'> </span><button className=' bg-green-300 rounded-full px-4 py-1 my-2'> Complete</button></td>
        </tr>
        <tr className=' border-t'>
          <td><p className=' text-sm'>Design of everyday thing</p></td>
          <td><p className=' px-14 text-sm'>PDF</p></td>
          <td><p className=' px-14 text-sm'>Book</p></td>
          <td><p className=' px-14 text-sm'>Design</p></td>
          <td><p className=' px-14 text-sm'>Oshin Timi</p></td>
          <td> <span className=' bg-green-700 w-2 h-2 rounded-full'> </span><button className=' bg-green-300 rounded-full px-4 py-1 my-6'> Complete</button></td>
        </tr>
        <tr className=' border-t'>
          <td><p className=' text-sm'>Coding for Newbies</p></td>
          <td><p className=' px-14 text-sm'>PDF</p></td>
          <td><p className=' px-14 text-sm'>Book</p></td>
          <td><p className=' px-14 text-sm'>Software Development</p></td>
          <td><p className=' px-14 text-sm'>Esther Imodu</p></td>
          <td> <span className=' bg-[#35BA834D] w-2 h-2 rounded-full'> </span><button className=' bg-green-300 rounded-full px-4 py-1 my-6'> Complete</button></td>
        </tr>
        </tbody>

      </table>
    </div>
  </div>
  )
}

export default RecentActivities