import { useContext } from "react";
import ActivityOverview from "./ActivityOverview";
import AvatarProfile from "./AvatarProfile";
import Banner from "./Banner";
import JobEvent from "./JobEvent";
import { UserContext } from "../context/userContext";
import Loader from "../animation/Loader";

function UserDashboard() {
  const { isLoading } = useContext(UserContext);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <AvatarProfile />
          <Banner />
          <ActivityOverview />
          <JobEvent />
        </>
      )}
    </>
  );
}

export default UserDashboard;
