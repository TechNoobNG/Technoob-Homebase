import React, { useState } from 'react'
import { image5 } from '../data/assets';
import Button from '../utility/button';

const CTA = () => {
  
  const [email, setEmail] = useState('');
  const regEx =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;



  const handleChange = (e) =>{
    setEmail(e.target.value);

  };


const handleClick = async (e) =>{
  e.preventDefault();
  if(regEx.test(email) === false){
   alert('Please enter a valid Email')
  } else{

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        email
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
     const response = await fetch("https://technoob-staging.azurewebsites.net/api/v1/user/mailing-list", requestOptions)
      
     if(response.status){
     alert('Email successfully added');
     }
    
    } catch (error) {
      console.log(error)
    }
  
   
    setEmail('')
  }
  

}
   

 
  return (
    <div className='flex justify-center items-center bg-[#F5F5F5] w-full h-auto py-20'>
        <div className='flex flex-col w-full'>
            <div className='flex flex-col justify-center items-center text-center bg-[#F9FAFB]'>
                <img src={image5} alt="subscribe" className='w-[123px] h-[56px] sm:my-4 '/>

                <div>
                    
                </div>
                <h1 className='font-[700] text-2xl text-[#5E7CE8] text-center sm:mb-3 '>
                      Stay <span className='text-[#27AE60]'> in the loop </span> 
                </h1>
                <p className='text-xs w-[90%] sm:w-auto sm:text-lg text-[#667085] sm:mb-6'>want to be the first to know when we have exciting news?
                     subscribe to our list</p>

                     <div className='flex flex-col justify-center items-center sm:flex-row my-16 sm:my-6 gap-4'>
                        <input placeholder='Enter your email address' type='email' value={email} onChange={handleChange} className='bg-white w-[355px] h-[56px] border rounded-md ring-2 outline-0 text-base pl-4 placeholder:italic'/>
                        <Button name={'Subscribe'} type={'submit'} handleClick={handleClick}/>
                        
                     </div>
            </div>

        </div>
    </div>
  )
}

export default CTA