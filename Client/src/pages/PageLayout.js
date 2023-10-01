import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components";

function PageLayout() {
  return (
    <div className="bg-primary w-full overflow-hidden">
      <Header />
      <Outlet />
      {/* <Footer></Footer> */}
      <Footer />
    </div>
  );
}

export default PageLayout;
