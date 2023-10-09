import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import UserDashboard from "./components/UserDashboard";
import Resources from "./components/Resources";
import UserEvents from "./components/UserEvents";
import Quiz from "./components/Quiz";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/event" element={<UserEvents />} />
            <Route path="/quiz" element={<Quiz />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
