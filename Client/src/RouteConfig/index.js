import { Navigate } from "react-router-dom";
import { SignUp } from "../pages/Auth";
import {
  AboutUs,
  ContactUs,
  FindJobs,
  Home,
  Resources,
  UserLogin,
} from "../pages/LandingPage";
import AllResources from "../pages/LandingPage/Resources/reasources_pages/Page1";
import {
  AdminDashboard,
  EventManagement,
  JobManagement,
  ResourceManagement,
} from "../pages/AdminPage/Dashboard";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "Home", element: <Navigate to="/" /> },
  { path: "About-us", element: <AboutUs /> },
  { path: "Find-Jobs", element: <FindJobs /> },
  { path: "Contact-Us", element: <ContactUs /> },
  { path: "Resources", element: <Resources /> },
  { path: "all-resources", element: <AllResources /> },
  { path: "Sign-Up", element: <SignUp /> },
  { path: "User-Login", element: <UserLogin /> },
];

export const adminRoutes = [
  { path: "/", element: <AdminDashboard /> },
  { path: "Home", element: <Navigate to="/" /> },
  { path: "Admin-Home", element: <Navigate to="/" /> },
  { path: "Job-Management", element: <JobManagement /> },
  { path: "Resources-Management", element: <ResourceManagement /> },
  { path: "Event-Management", element: <EventManagement /> },
];

// export default routes;
