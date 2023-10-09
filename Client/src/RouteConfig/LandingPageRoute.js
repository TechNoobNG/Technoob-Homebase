import { Route } from "react-router-dom";
import { PageLayout } from "../pages";
import { routes } from ".";

function LandingPageRoute() {
  return (
    <Route element={<PageLayout />}>
      {routes.map((path, element) => (
        <Route path={`${path}`} element={element} key={path} />
      ))}
    </Route>
  );
}

export default LandingPageRoute;
