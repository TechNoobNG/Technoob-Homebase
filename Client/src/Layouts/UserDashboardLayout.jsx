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

      <div className="flex justify-between h-full overflow-hidden">
        <div className="hidden sm:block rounded-md shadow-md w-[380px] h-full overflow-y-scroll">
          <UserDashboardSideBar />
        </div>

        <div className="bg-[#f9f9f9] w-full grow h-auto pb-16 lg:pr-10 p-5 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
