import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { SignUp } from "./pages/Auth";
import { AboutUs, ContactUs, FindJobs, Home, Resources, UserLogin } from "./pages/LandingPage";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./AppContext/AppContext";
import AdminPageLayout from "./Layouts/AdminPageLayout.jsx";
import LandingPageLayout from "./Layouts/LandingPageLayout.jsx";
import UserDashboardLayout from "./Layouts/UserDashboardLayout.jsx";
import { AdminDashboard, EventManagement, JobManagement, ResourceManagement } from "./pages/Admin/AdminRoutes";
import Profile from "./pages/Admin/AdminRoutes/Profile";
import Quizzes from "./pages/Admin/AdminRoutes/Quizzes.jsx";
import { Impact } from "./pages/LandingPage/Impact/Impact.jsx";
import AllResources from "./pages/LandingPage/Resources/reasources_pages/Page1";
import QuizzesAndCompetition from "./pages/User/QuizzesAndCompetition/index.jsx";
import UserDashboard from "./pages/User/UserRoutes/UserDashboard.jsx";
import DashSelector from "./utility/DashSelector";


function App() {
  const { isLoggedIn, setIsLoggedIn, setDashboardToggle, dashboardToggle, setUserProfile } = useContext(AppContext);
  const { displayToggle } = dashboardToggle;

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

  return (
    <BrowserRouter>
      <ToastContainer />
      {displayToggle && <DashSelector />}
      {displayToggle && <div className="blur-effect" />}

      {/* {toggleValue === "User Dashboard" ?        */}

      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPageLayout />}>
          <Route index element={<Home />} />
          <Route path="Home" element={<Home />} />
          <Route path="About-Us" element={<AboutUs />} />
          <Route path="Find-Jobs" element={<FindJobs />} />
          <Route path="Contact-Us" element={<ContactUs />} />
          <Route path="Resources" element={<Resources />} />
          <Route path="all-resources" element={<AllResources />} />

          {/* <Route path="/dashboard" element={<UserDashboard />} /> */}
          <Route path="/impact" element={<Impact />} />
          <Route path="/quizzes-and-competition" element={<QuizzesAndCompetition />} />
        </Route>

        {/* auth screen */}
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<UserLogin />} />

        {/*user dashboard */}
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboard />} />
        </Route>

        {/* admin dashboard */}
        <Route path="/admin" element={<AdminPageLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/Job-Management" element={<JobManagement />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/Resources-Management" element={<ResourceManagement />} />
          <Route path="/admin/Event-Management" element={<EventManagement />} />
          <Route path="/admin/Quizzes" element={<Quizzes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
