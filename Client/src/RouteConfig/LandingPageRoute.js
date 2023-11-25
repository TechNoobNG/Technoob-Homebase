import { Route, Routes } from "react-router-dom";
import { PageLayout } from "../pages";
import { routes } from ".";

function LandingPageRoute() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        {routes.map(({ path, element }) => (
          <Route path={`${path}`} element={element} key={path} />
        ))}
      </Route>
    </Routes>
  );
}

export default LandingPageRoute;
