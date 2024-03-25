import { useContext, useState } from "react";
import { BsBell } from "react-icons/bs";
import { TbSettings } from "react-icons/tb";
import { Link, NavLink, useLocation } from "react-router-dom";
import { people01 } from "../../data/assets/asset";
import { menu, close } from "../../data/assets";
import { MdOutlineDashboard } from "react-icons/md";
import { UserDashboardNavs } from "../../data/contact";
import { AppContext } from "../../AppContext/AppContext";

const UserDashboardNavbar = () => {
  const { pathname } = useLocation();
  const [toggle, setToggle] = useState(false);

  const { UserProfile } = useContext(AppContext);

  // console.log({UserProfile})
  return (
    <div className="w-full bg-white sm:h-full p-6 sm:py-7 sm:px-20 flex justify-between items-start">
      <div className="text-lg md:text-2xl font-extrabold text-[#5E7CE8] cursor-pointer">
        <Link to={"/dashboard"}>Tech Noob</Link>
      </div>
      <div className="w-auto hidden h-full sm:flex flex-row justify-around gap-3 items-center float-right">
        <div>
          <BsBell className="sm:text-2xl cursor-pointer" />
        </div>
        <div>
          <TbSettings className="sm:text-2xl cursor-pointer" />
        </div>
        <div className="rounded-full h-5 w-5 sm:w-8 sm:h-8 cursor-pointer">
          <img
            src={UserProfile?.photo !== "default.jpg" ? UserProfile?.photo : people01}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex lg:hidden h-full items-center justify-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          onClick={() => setToggle((prev) => !prev)}
          className="h-4 w-4 cursor-pointer"
        />

        <div
          className={`${toggle ? "flex" : "hidden"} p-4 bg-white rounded-md absolute top-16 right-0 mx-1 my-2 w-[375px] z-10 h-full sidebar flex-col transition`}
        >
          <ul className="flex font-normal justify-center items-center gap-3 list-none flex-col text-white">
            <NavLink
              to={"/dashboard"}
              className={`${
                pathname === "/dashboard" && "bg-tblue  text-[#fff] text-lg"
              } hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-black`}
              onClick={() => setToggle((prev) => !prev)}
            >
              <MdOutlineDashboard className="text-2xl" />
              <h2 className="text-base capitalize">dashboard</h2>
            </NavLink>
            {UserDashboardNavs.map((nav, i) => (
              <NavLink
                to={nav.link}
                key={nav.id}
                onClick={() => setToggle((prev) => !prev)}
                className={`${
                  pathname === nav.link ? "bg-tblue text-white" : ""
                }  hover:bg-tblue hover:text-white transition-all duration-500 rounded-md w-full flex items-center gap-x-4 px-3 py-2 text-lg text-black`}
              >
                <div className="text-2xl">{nav.icon}</div>
                <h2 className="text-base">{nav.title}</h2>
              </NavLink>
            ))}
          </ul>

          <div className="flex flex-col justify-center items-center mt-10 gap-5"></div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardNavbar;
