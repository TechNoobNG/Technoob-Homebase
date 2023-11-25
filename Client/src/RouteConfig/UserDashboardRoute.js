import { Route, Routes } from "react-router-dom";
import AppLayout from "../user-dashboard/layout/AppLayout";
import { userDashboardRoutes } from ".";

function UserDashboardRoute() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {userDashboardRoutes.map(({ path, element }) => (
          <Route path={`${path}`} element={element} key={path} />
        ))}
      </Route>
    </Routes>
  );
}

export default UserDashboardRoute;
