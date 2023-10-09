import { Route } from "react-router-dom";
import { AdminPageLayout } from "../pages";
import { adminRoutes } from ".";

function AdminPageRoute() {
  return (
    <Route element={<AdminPageLayout />}>
      {adminRoutes.map((path, element) => (
        <Route path={`${path}`} element={element} key={path} />
      ))}
    </Route>
  );
}

export default AdminPageRoute;
