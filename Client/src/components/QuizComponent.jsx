import React from 'react'
import { IoAlarmOutline } from "react-icons/io5";

const QuizComponent = ({data, setData, handleChange}) => {
    const stacks = [
        "Frontend Development",
        "UI/UX",
        "Backend Development",
        "Mobile Development",
        "Product Management",
        "Project Management",
        "Technical Writing",
        "Cloud Development",
        "Cybersecurity",
        "Software Testing",
        "DevOps",
        "SEO",
        "Product Design"
    ]
  return (
    <div className='flex w-full flex-col mt-3 gap-8 lg:gap-12'>
        <div className='flex gap-4 max-lg:flex-col w-full lg:w-[50%] lg:items-center'>
            <h1 className='text-lg font-semibold w-[150px] whitespace-nowrap'>Theme</h1>
            <input type="text" name='theme' onChange={handleChange} placeholder='~~input text here~~' className='border p-1 w-full'/>
        </div>
        <div className='flex  gap-4 max-lg:flex-col w-full lg:w-[50%] lg:justify-between lg:items-center '>
            <h1 className='text-lg font-semibold w-[150px]  whitespace-nowrap'>Tech stack</h1>
            <select type="text" name='stack' onChange={handleChange} className='border p-1 w-full'>
                <option hidden>Select a tech stack</option>
               {stacks.map((stack, i)=>(
                <option key={i} value="stack">{stack}</option>
               ))}
            </select>
        </div>
        <div className='flex lg:gap- gap-4 max-lg:flex-col w-full lg:w-full  lg:items-center '>
            <h1 className='text-lg font-semibold w-[150px] whitespace-nowrap'>Set Instructions</h1>
            <input type="text" name='instructions' onChange={handleChange} placeholder='~~input text here~~' className='border p-1 w-full'/>
            <div className='flex gap-3 justify-between items-center'>
                <label htmlFor="duration" className='flex items-center justify-center gap-1'><IoAlarmOutline className='text-lg' />Duration:</label>
                <input type="date" name='deadline' onChange={handleChange}  className='border p-2 lg:w-[350px]'/>
            </div>
        </div>
    </div>
  );
};

export default QuizComponent;
