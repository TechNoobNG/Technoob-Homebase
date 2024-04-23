import { useContext, useState } from "react";
import { UserDashboardNavs } from "../../data/contact";
import {  NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings, } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi";
import serverApi from "../../utility/server";
import { AppContext } from "../../AppContext/AppContext";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

const UserDashboardSideBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { setDashboardToggle, UserProfile } = useContext(AppContext);

  const switchView = async () => {
    if (UserProfile.role !== "admin") return;
    setDashboardToggle({
      displayToggle: false,
      toggleValue: "Admin Dashboard",
    });
    // navigate("/admin/dashboard");
  };

  return (
    <div className="hidden bg-white lg:flex flex-col px-5 h-full border-r-[0.5px] w-full  justify-start items-center">
      <div className=" w-full flex justify-center items-center mb-[10rem] item-between">
        <div className="flex flex-col justify-center items-center w-full space-y-6">
          <NavLink
            to={"/dashboard"}
            className={`${
              pathname === "/dashboard" ? "bg-tblue text-[#fff] text-lg" : ""
            } hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2`}
          >
            <MdOutlineDashboard className=" text-3xl" />
            <h2 className="font-bold capitalize text-sm">dashboard</h2>
          </NavLink>

          <div className="w-[320px] h-[2.3px] opacity-20 bg-gray-400 mb-20" />
          {UserDashboardNavs.map((Nav, i) => (
            <NavLink
              to={Nav.link}
              key={Nav.id}
              className={`${pathname === Nav.link ? "bg-tblue text-white" : ""}  hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-lg`}
            >
              <div className={` text-xl`}>{Nav.icon}</div>
              <h2 className="text-sm font-semibold">{Nav.title}</h2>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mb-5 w-full border-t-2 border-slate-300">
        <div className="flex flex-col mt-6 gap-6">
          <NavLink
            to={"/dashboard/profile"}
            className="hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-sm"
          >
            <CgProfile className="font-normal" /> Profile
          </NavLink>
          <span className="hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-sm">
            <FiSettings className="font-normal" /> Settings
          </span>

          {UserProfile.role === "admin" && (
            <button onClick={switchView}>
              <span className="hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-sm">
                <HiOutlineSwitchHorizontal className="font-normal" /> {"Switch to Admin view "}
              </span>
            </button>
          )}
            <SignOut></SignOut>
        </div>
      </div>
    </div>
  );
};

function SignOut() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserProfile, setDashboardToggle } = useContext(AppContext);

  const signOut = async () => {
    setLoading(true);
    const response = await serverApi.post("/authenticate/logout");
    setLoading(false);
    if (response.status === 200) {
      navigate("/Home");
      setIsLoggedIn(false);
      setUserProfile(null);
      setDashboardToggle({
        displayToggle: false,
        toggleValue: "User Dashboard",
      });
      sessionStorage.clear();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <button onClick={submit}>
      <span className="hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-sm">
        <BiLogOut className="" /> {loading ? "Logging out" : "Log Out"}
      </span>
    </button>
  );
}
export default UserDashboardSideBar;
