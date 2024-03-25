import { useContext, useEffect, useLayoutEffect } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { NavBar, Footer } from "../components/index";
import { AppContext } from "../AppContext/AppContext";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

const LandingPageLayout = () => {
  const { isLoggedIn, dashboardToggle } = useContext(AppContext);
  const { toggleValue } = dashboardToggle;

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && toggleValue === "Admin Dashboard") {
      navigate("/admin/dashboard");
    }

    if (isLoggedIn && toggleValue === "User Dashboard") {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate, toggleValue]);

  return (
    <div className="bg-primary w-full overflow-auto relative">
      <div className="flex flex-start w-full top-0 lg:fixed z-50">
        <div className="w-full">
          <NavBar />
        </div>
      </div>
      <main className="lg:pt-16">
        <Wrapper>
          <Outlet />
        </Wrapper>
      </main>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPageLayout;
