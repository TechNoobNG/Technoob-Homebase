import React, { useContext, useState } from "react";
import { AdminNavs } from "../data/contact";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings, FiUser } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import {HiOutlineSwitchHorizontal} from "react-icons/hi"
import serverApi from "../utility/server";
import { AppContext } from "../AppContext/AppContext";
import showToast  from "../utility/Toast";
const AdminSideBar = () => {
  const isActive = false;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setDashboardToggle, setIsLoggedIn, setUserProfile, } = useContext(AppContext);

  const switchView = async () => {
    navigate("/");
    setDashboardToggle({
      displayToggle: true,
      toggleValue: "User Dashboard",
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await showToast({
        type: "promise",
        promise: serverApi.post("/authenticate/logout")
      })
      setLoading(false);
      navigate("/Home");
      setIsLoggedIn(false);
      setUserProfile(null);
      setDashboardToggle({
        displayToggle: false,
        toggleValue: "User Dashboard",
      });
      sessionStorage.clear();
    } catch (error) {
      showToast({
        message: error.message || "An error ocurred, please contact support.",
        type: "error",
      })
      setLoading(false)
    }
  };

const submit = async (e) => {
  e.preventDefault();
  await signOut();
}

  return (
    <div className=" bg-[#fff] flex flex-col h-full overflow-auto border-r-[0.5px] w-full justify-start items-center">
      <div className=" w-full flex justify-center items-center mb-[3rem] item-between">
        <div className="flex flex-col justify-center items-center w-full ">
          <NavLink to={"/admin/dashboard"} className=" hover:text-[#fff]">
            <div className="mb-4 w-[230px] h-[54px] flex items-center p-3 m-2 rounded-md hover:bg-tblue ">
              <MdOutlineDashboard className="mr-5 text-3xl" />
              <h2 className="font-bold capitalize text-lg">dashboard</h2>
            </div>
          </NavLink>

          <div className="w-[260px] h-[2.3px] opacity-20 bg-gray-400 mb-5" />
          {AdminNavs.map((Nav, i) => (
            <NavLink
              to={Nav.link}
              key={Nav.id}
              className={`${
                isActive ? "bg-tblue" : ""
              } w-[260px] h-[54px] flex items-center p-3 m-2 mb-4 rounded-md hover:bg-tblue hover:text-white`}
            >
              <div className={`mr-5 text-2xl`}>{Nav.icon}</div>
              <h2 className="text-[14px] font-semibold">{Nav.title}</h2>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mb-5 mx-5 w-[80%] border-t-2 border-slate-300">
        <div className="flex flex-col  mt-3 gap-1 ">
          <Link
            to={"/admin/profile"}
            className="flex justify-start items-center gap-4  hover:bg-tblue hover:text-white p-3 text-base cursor-pointer font-semibold"
          >
            <FiUser className=" font-normal" /> Profile
          </Link>
          <span className="flex  justify-start items-center gap-4 hover:bg-tblue hover:text-white p-3 text-base cursor-pointer font-semibold">
            <FiSettings className="" /> Settings
          </span>

          <button onClick={switchView}>
              <span className="flex justify-start items-center gap-4 text-tblue p-3 text-lg cursor-pointer font-semibold">
                <HiOutlineSwitchHorizontal className="" /> {"Switch to user view "}
              </span>
          </button>
          <button onClick={submit}>
            <span className="flex justify-start items-center gap-4 text-red-400 p-3 text-lg cursor-pointer font-semibold">
              <BiLogOut className="" /> {loading ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// function SwitchToUser() {
//   const navigate = useNavigate();
//   const { setDashboardToggle } = useContext(AppContext);

//   const switchView = async () => {
//     navigate("/admin/dashboard");
//     setDashboardToggle({
//       displayToggle: true,
//       toggleValue: "User Dashboard",
//     });
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     await switchView();
//   };

//   return (
//     <button onClick={submit}>
//       <span className="flex justify-start items-center gap-4 text-red-400  hover:bg-tblue hover:text-white text-lg cursor-pointer font-semibold">
//         <BiLogOut className="" /> {"Switch to user view "}
//       </span>
//     </button>
//   );
// }

// function SignOut() {

//   const navigate = useNavigate();
//   const { setIsLoggedIn, setUserProfile, setDashboardToggle } =
//     useContext(AppContext);

//   const signOut = async () => {
//     setLoading(true);
//     const response = await serverApi.post("/authenticate/logout");
//     setLoading(false);
//     if (response.status === 200) {
//       navigate("/Home");
//       setIsLoggedIn(false);
//       setUserProfile(null);
//       setDashboardToggle({
//         displayToggle: false,
//         toggleValue: "User Dashboard",
//       });
//       sessionStorage.clear();
//     }
//   };

  // const submit = async (e) => {
  //   e.preventDefault();
  //   await signOut();
  // };

  // return (
  //   <button onClick={submit}>
  //     <span className="flex justify-start items-center gap-4 text-red-400 text-lg cursor-pointer font-semibold">
  //       <BiLogOut className="" /> {loading ? "Logging out..." : "Log Out"}
  //     </span>
  //   </button>
  // );
// }
export default AdminSideBar;
