import React from 'react'

const QuizComponent = () => {
  return (
    <div className='flex w-full flex-col mt-3 gap-8 lg:gap-12'>
        <div className='flex lg:gap-12 gap-4 max-lg:flex-col w-full lg:w-[40%] lg:justify-between lg:items-center '>
            <h1 className='text-lg font-semibold'>Theme</h1>
            <input type="text" placeholder='~~input text here~~' className='border p-1 w-full lg:min-w-[400px]'/>
        </div>
        <div className='flex lg:gap-12 gap-4 max-lg:flex-col w-full lg:w-[40%] lg:justify-between lg:items-center '>
            <h1 className='text-lg font-semibold'>Tech stack</h1>
            <input type="text" placeholder='~~input text here~~' className='border p-1 w-full lg:min-w-[400px]'/>
        </div>
        <div className='flex lg:gap-12 gap-4 max-lg:flex-col w-full lg:w-full  lg:items-center '>
            <h1 className='text-lg font-semibold'>Set Instructions</h1>
            <input type="text" placeholder='~~input text here~~' className='border p-1 w-full lg:min-w-[800px]'/>
            <div className='flex gap-3 justify-between items-center'>
                <label htmlFor="duration">Duration:</label>
                <input type="date"  className='border p-2'/>
            </div>
        </div>
    </div>
  )
}

export default QuizComponent