import { Route, Routes } from "react-router-dom";
import { AdminPageLayout } from "../pages";
import { adminRoutes } from ".";

function AdminPageRoute() {
  return (
    <Routes>
      <Route element={<AdminPageLayout />}>
        {adminRoutes.map(({ path, element }) => (
          <Route path={`${path}`} element={element} key={path} />
        ))}
      </Route>
    </Routes>
  );
}

export default AdminPageRoute;
