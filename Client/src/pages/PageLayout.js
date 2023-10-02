import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Footer, NavBar } from "../components";

function PageLayout() {
  return (
    <div className="bg-primary w-full overflow-auto relative">
      <Header>
        <NavBar />
      </Header>
      <main className="lg:pt-16 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PageLayout;
