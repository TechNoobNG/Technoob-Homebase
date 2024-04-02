import { useState, createContext } from "react";

const AppContext = createContext({
  Notification: false,
  isLoggedIn: false,
  isAdmin: false,
});

const AppProvider = ({ children }) => {
  const [Notification, setNotification] = useState(false);
  const [UserProfile, setUserProfile] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardToggle, setDashboardToggle] = useState({
    displayToggle: false,
    toggleValue: "User Dashboard",
  });

  const storedUser = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("userData")) : null;

  const [userData, setUserData] = useState(storedUser);

  return (
    <AppContext.Provider
      value={{
        Notification,
        setNotification,
        UserProfile,
        setUserProfile,
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        dashboardToggle,
        setDashboardToggle,
        userData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
