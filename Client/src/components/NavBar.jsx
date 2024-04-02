import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Button from "../utility/button";
import { navLinks } from "../data/contact";
import { close, menu, TechNoobLogo } from "../data/assets";
import { AppContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import serverApi from "../utility/server";
import { AiOutlineLogout } from "react-icons/ai";
import showToast from "../utility/Toast";

const NavBar = () => {
  const cookies = new Cookies();
  const { setIsLoggedIn, setUserProfile, isLoggedIn, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState("");
  const { UserProfile, setDashboardToggle } = useContext(AppContext);
  const navigate = useNavigate();

  const handleActive = (e) => {
    setActive(e.target.innerText);
  };

  const logout = async () => {
    try {
      const abortController = new AbortController();
      serverApi.requiresAuth(true);
      setLoading(true);
      await serverApi.post(
        "/authenticate/logout/",
        {},
        {
          signal: abortController.signal,
          headers: { "content-type": "application/json" },
        }
      );
      setIsLoggedIn(false);
      setUserProfile(null);
      cookies.remove("user");
      sessionStorage.clear();
      setLoading(false);
      return;
    } catch (error) {
      showToast({
        message: error.message || "An error ocurred, please contact support.",
        type: "error",
      });
    } finally {
      setLoading(false);
      showToast({
        message: "See you soon! 🙂",
        type: "info",
      });
      navigate("/Home");
    }
  };

  const handleClick = async () => {
    await logout();
    navigate("/Home");
  };

  const handleLoggout = async (e) => {
    e.preventDefault();
    await logout();
  };

  const switchView = async () => {
    setDashboardToggle({
      displayToggle: true,
      toggleValue: "Admin Dashboard",
    });
    navigate("/admin/dashboard");
  };

  return (
    <nav className="w-full bg-white shadow-md ">
      <div className="w-full py-2 px-5 sm:px-20 flex justify-between md:justify-between items-center lg:h-[80px] ">
        <Link to={"/"}>
          <img src={TechNoobLogo} alt="technooblogo" width="150" height="50" />
        </Link>
        <div className="hidden lg:flex w-[800px] justify-center">
          <ul className="flex font-normal justify-between gap-8">
            {navLinks.map((nav, i) => (
              <li key={nav.id} className={`text-lg hover:text-[#27AE60]`}>
                <Link
                  className={`${UserProfile?.role !== "admin" && nav.id === "switch-view" ? "hidden" : ""} ${active === nav.title ? "text-[#27AE60]" : ""}`}
                  to={`/${nav.link}`}
                  onClick={nav.id === "switch-view" ? switchView : handleActive}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* toggle button */}
        <div className="flex xl:hidden h-full items-center justify-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            onClick={() => setToggle((prev) => !prev)}
            className="h-4 w-4 cursor-pointer"
          />
          {/* togggle button on the nav bar for small screens */}
          <div
            className={`rounded-md absolute flex justify-start items-end top-[75px] right-0  my-2 w-full z-10 h-screen ${toggle ? "sidebar" : "sidebarClose"} flex-col `}
          >
            <div
              className="bg-slate-300 opacity-50 z-[-2] w-full h-full absolute "
              onClick={() => setToggle((prev) => !prev)}
            />
            <div className="flex bg-white w-[80%] h-[95%] rounded-l-xl flex-col p-4">
              <ul className="flex flex-col p-4 font-normal gap-4 list-none">
                {navLinks.map((nav, i) => (
                  <li key={i} className={`text-2xl hover:text-tblue w-full`}>
                    {}
                    <Link
                      className={`${UserProfile?.role !== "admin" && nav.id === "switch-view" ? "hidden" : ""} sidebar ${"text-black border-b-2 hover:text-tblue hover:border-blue-500 transition-all ease-in duration-200"}`}
                      to={`/${nav.link}`}
                      onClick={() => setToggle((prev) => !prev)}
                    >
                      {nav.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {!isLoggedIn ? (
                <div className="flex justify-center items-center mt-4 gap-5">
                  <Link onClick={() => setToggle((prev) => !prev)} to={"/User-Login"}>
                    <button
                      name={"Login"}
                      className=" text-[#111111] bg-[#EFF0F5] font-[600] text-base rounded-md py-4 px-8"
                    >
                      Login
                    </button>
                  </Link>
                  <p className="text-base font-semibold">Or</p>
                  <Link onClick={() => setToggle((prev) => !prev)} to={"/Sign-Up"}>
                    <button name={"Login"} className=" text-white bg-tblue font-[600] text-base rounded-md py-3 px-8">
                      Get Started
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center items-center mt-4 gap-5">
                  {/* <Button width={'w-20 h-10'} name={loading ? 'Loading...' : "Logout"} handleClick={handleLoggout} /> */}
                  <AiOutlineLogout className="text-xl text-red-500" onClick={handleLoggout} />
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="hidden lg:flex gap-2 items-center">
            <div className="hidden lg:flex w-[20%] gap-2 text-center">
              <div className="gap-2">
                {" "}
                {!loading ? (
                  <h2 className="lg:text-2xl w-[10rem] font-semibold truncate">Hi {userData?.username} </h2>
                ) : (
                  <h2 className="lg:text-xl font-semibold ">Loading...</h2>
                )}{" "}
              </div>
              <div>
                {/* <Button width={'w-20 h-10'} name={loading ? 'Loading...' : "Logout"} handleClick={handleLoggout} /> */}
                <AiOutlineLogout className="text-xl text-red-500" onClick={handleLoggout} />
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden gap-2 lg:flex">
            <Link to={"/login"}>
              <button
                name={"Login"}
                className="w-[130px] sm:w-[130px] h-[54px] text-[#111111] bg-[#EFF0F5] rounded-md py-4 px-3.5 text-base font-[600]"
              >
                {" "}
                Login
              </button>
            </Link>
            <Link to={"/register"}>
              <Button name={"Get Started"} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
