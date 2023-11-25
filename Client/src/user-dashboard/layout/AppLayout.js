import Aside from "../components/Aside";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import { UserProvider } from "../context/userContext";

function AppLayout() {
  return (
    <UserProvider>
      <Header />
      <div className="content">
        <Aside />
        <MainContent />
      </div>
    </UserProvider>
  );
}

export default AppLayout;
