import { useState, createContext, useEffect } from "react";
import serverApi from "../utility/server";

const AppContext = createContext({
  Notification: false,
  isLoggedIn: false,
  isAdmin: false,
  defaults: {}, // Add a defaults state
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
  const [userData, setUserData] = useState(null);
  const [defaults, setDefaults] = useState({});
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const response = await serverApi.get("utils/defaults");
        if (response.statusText === "OK"){
          const defaultsData = response.data.data;
          setDefaults(defaultsData);
        }
      } catch (error) {
        console.error("Error fetching defaults:", error);
      }
    };

    fetchDefaults();
  }, []);

  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

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
        defaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
