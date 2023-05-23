import React, { useContext } from 'react';
import './App.css';

import {useLayoutEffect} from 'react';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import {NavBar,Footer} from './components/index.js';

import {SignUp } from './pages/Auth';

import { ContactUs, Resources, AboutUs,Home, UserLogin } from './pages/LandingPage';
import { AppContext } from './AppContext/AppContext';
import AdminNavBar from './components/AdminNavBar';
import AdminSideBar from './components/AdminSideBar';



function App() {

  const [isAdmin] = useContext(AppContext)

  const Wrapper = ({children}) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children
  }
  return (
    <BrowserRouter>
      {isAdmin 
      
      ? 
      
      <div className="bg-primary w-full overflow-auto relative">
        <div className='flex flex-start w-full top-0 lg:fixed z-50'>
          <div className='w-full'>
            <NavBar/>
          </div>
      </div>
      <main className='lg:pt-16'>
        <Wrapper>
        <Routes>
          <Route path= "/" element={<Home/>}/>
          <Route path= "/Home" element={<Home/>}/>
          <Route path= "/About-Us" element={<AboutUs/>}/>
          <Route path= "/Contact-Us" element={<ContactUs/>}/>
          <Route path= "/Resources" element={<Resources/>}/>
          <Route path= "/Sign-Up" element={<SignUp/>}/>
          <Route path="/User-Login" element={<UserLogin/>}/>

      </Routes>
      </Wrapper>
  </main> 

      <div>
        <Footer/>
      </div>
      
    </div> 
    : 
    <div className='h-full w-screen pb-20'>

      <div className='flex flex-start w-full top-0  z-50 mb-10'>
          <div className='w-full mb-10'>
             <AdminNavBar/>
          </div>
        </div>

        <div className='flex justify-between mt-10 gap-3  relative'>
            <div className='rounded-r-md shadow-md  h-[1173px] w-[350px] '>
                <AdminSideBar/> 
            </div>

            <div className='bg-[#F5F5F5]  grow min-h-screen mt-5 mr-10 p-5'>
              
              <div>hello</div>
              
            </div>

        </div>

    </div>
    
}
</BrowserRouter>
)}

export default App;
