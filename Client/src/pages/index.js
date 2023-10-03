import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { AdminNavBar, AdminSideBar, Footer, NavBar } from "../components";
import AdminHeader from "../components/AdminHeader";
import AdminAside from "../components/AdminAside";

export function PageLayout() {
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

export function AdminPageLayout() {
  return (
    <div className="h-full bg-[#f9f9f9] w-full">
      <AdminHeader>
        <AdminNavBar />
      </AdminHeader>
      <AdminAside>
        <AdminSideBar />
      </AdminAside>
      <main className="bg-[#f9f9f9] w-full grow h-auto pb-16 lg:pr-10 p-5">
        <Outlet />
      </main>
    </div>
  );
}
