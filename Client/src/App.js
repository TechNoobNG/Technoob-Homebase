import React, { useContext, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer, NavBar } from "./components/index.js";

import { SignUp } from "./pages/Auth";
import {
  AboutUs,
  ContactUs,
  FindJobs,
  Home,
  Resources,
  UserLogin,
} from "./pages/LandingPage";

import { AppContext } from "./AppContext/AppContext";
import AdminNavBar from "./components/AdminNavBar";
import AdminSideBar from "./components/AdminSideBar";
import QuizzesAndCompetition from "./pages/User/QuizzesAndCompetition/index.jsx";
import DashSelector from "./utility/DashSelector";
import ProfileUpdateNotification from "./utility/ProfileUpdateNotification";
import AllResources from "./pages/LandingPage/Resources/reasources_pages/Page1";
import Profile from "./pages/Admin/AdminRoutes/Profile";
import { Impact } from "./pages/LandingPage/Impact/Impact.jsx";
import {
  AdminDashboard,
  EventManagement,
  JobManagement,
  ResourceManagement,
} from "./pages/Admin/AdminRoutes";
import UserDashboard from "./pages/User/UserRoutes/UserDashboard.jsx";
import UserDashboardNavbar from "./components/UserDashboard/UserDashboardNavbar.jsx";
import UserDashboardSideBar from "./components/UserDashboard/UserDashboardSideBar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Quizzes from "./pages/Admin/AdminRoutes/Quizzes.jsx";

// import JobDetails from "./pages/LandingPage/FindJob/JobDetails"

function App() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setDashboardToggle,
    dashboardToggle,
    setUserProfile,
  } = useContext(AppContext);
  const { displayToggle, toggleValue } = dashboardToggle;

  useEffect(() => {
    const checkUserLogin = sessionStorage.getItem("userData");
    const checkUserViewPreference = sessionStorage.getItem("viewPreference");

    // const sessionCookie = cookies.get('session')

    if (checkUserLogin) {
      setIsLoggedIn(true);
      setUserProfile(JSON.parse(checkUserLogin));
    } else {
      setIsLoggedIn(false);
    }

    if (checkUserViewPreference) {
      setDashboardToggle(JSON.parse(checkUserViewPreference));
    }
  }, [isLoggedIn, setDashboardToggle, setIsLoggedIn, setUserProfile]);

  //const [isAdmin] = useContext(AppContext)

  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children;
  };
  return (
    <BrowserRouter>
      <ToastContainer />
      {displayToggle && <DashSelector />}
      {displayToggle && <div className="blur-effect" />}

      {toggleValue === "User Dashboard" ? !isLoggedIn ? (       
          <div className="bg-primary w-full overflow-auto relative">
          <div className="flex flex-start w-full top-0 lg:fixed z-50">
            <div className="w-full">
              <NavBar />
            </div>
          </div>
          <main className="lg:pt-16 w-full">
            <Wrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About-Us" element={<AboutUs />} />
                <Route path="/Find-Jobs" element={<FindJobs />} />
                <Route path="/Contact-Us" element={<ContactUs />} />
                <Route path="/Resources" element={<Resources />} />
                <Route path="/all-resources" element={<AllResources />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<UserLogin />} />
                {/* <Route path="/dashboard" element={<UserDashboard />} /> */}
                <Route path="/impact" element={<Impact />} />
                <Route
                  path="/quizzes-and-competition"
                  element={<QuizzesAndCompetition />}
                />
                {/*<Route path="/Job-Description" element={<JobDescription />} />*/}
              </Routes>
            </Wrapper>
          </main>

          <div className="">
            <Footer />
          </div>
        </div>
       ): (
        <div className="min-h-screen bg-[#f9f9f9] w-full">
        <div className="flex flex-start h-full w-full top-0  z-50">
          <div className="w-full h-full">
           <UserDashboardNavbar />
          </div>
        </div>

        <div className="flex justify-between h-full overflow-hidden">
          <div className="hidden sm:block rounded-md shadow-md w-[380px] h-full overflow-y-scroll">
            <UserDashboardSideBar />
          </div>

          <div className="bg-[#f9f9f9] w-full grow h-auto pb-16 lg:pr-10 p-5 overflow-y-scroll">
            <Routes>
              <Route path="/dashboard" element={<UserDashboard />} />
              
            </Routes>
          </div>
        </div>
      </div>
        ) 
        
       : (
        <div className="h-full bg-[#f9f9f9] w-full">
          <div className="flex flex-start h-full w-full sticky top-0  z-50">
            <div className=" w-full h-full">
              <AdminNavBar />
            </div>
          </div>

          <div className="flex justify-between h-auto">
            <div className="hidden xl:block rounded-md fixed top-22 left-0 shadow-md w-[360px] h-[100vh]">
              <AdminSideBar />
            </div>

            <div className="bg-[#f9f9f9] xl:ml-[350px] w-full grow h-auto p-5">
              <Routes>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route
                  path="/admin/Job-Management"
                  element={<JobManagement />}
                />

                <Route path="/admin/profile" element={<Profile />} />


                <Route
                  path="/admin/Resources-Management"
                  element={<ResourceManagement />}
                />
                <Route
                  path="/admin/Event-Management"
                  element={<EventManagement />}
                />
                <Route path="/admin/Quizzes" element={<Quizzes />} /> 

              </Routes>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
