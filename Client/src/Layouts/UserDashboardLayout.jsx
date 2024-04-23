import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserDashboardSideBar from "../components/UserDashboard/UserDashboardSideBar";
import UserDashboardNavbar from "../components/UserDashboard/UserDashboardNavbar";
import { AppContext } from "../AppContext/AppContext";

const UserDashboardLayout = () => {
  const { isLoggedIn, dashboardToggle, UserProfile } = useContext(AppContext);
  const { toggleValue } = dashboardToggle;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }

    if (UserProfile.role === "admin" && toggleValue === "Admin Dashboard") {
      navigate("/admin/dashboard");
    }
  }, [UserProfile.role, isLoggedIn, navigate, toggleValue]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] w-full">
      <div className="flex flex-start h-full w-full top-0  z-50">
        <div className="w-full h-full">
          <UserDashboardNavbar />
        </div>
      </div>

      <div className="flex w-full h-full overflow-hidden fixed">
        <div className="hidden sm:block w-[380px] h-full">
          <UserDashboardSideBar />
        </div>

        <div className="flex-grow bg-[#f9f9f9] p-5 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
