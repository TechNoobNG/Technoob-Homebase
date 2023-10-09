import Aside from "../components/Aside";
import Header from "../components/Header";
import MainContent from "../components/MainContent";

function AppLayout() {
  return (
    <>
      <Header />
      <div className="content">
        <Aside />
        <MainContent />
      </div>
    </>
  );
}

export default AppLayout;
