import React, { useContext, useEffect, useLayoutEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, useLocation } from "react-router-dom";

import { AppContext } from "./AppContext/AppContext";

import DashSelector from "./utility/DashSelector";
import LandingPageRoute from "./RouteConfig/LandingPageRoute";
import AdminPageRoute from "./RouteConfig/AdminPageRoute";

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
      {displayToggle && <DashSelector />}
      {displayToggle && <div className="blur-effect" />}
      {toggleValue === "User Dashboard" ? (
        <Wrapper>
          <Routes>
            <LandingPageRoute />
          </Routes>
        </Wrapper>
      ) : (
        <Routes>
          <AdminPageRoute />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
