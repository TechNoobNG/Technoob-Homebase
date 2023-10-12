import ActivityOverview from "./ActivityOverview";
import AvatarProfile from "./AvatarProfile";
import Banner from "./Banner";
import JobEvent from "./JobEvent";

function UserDashboard() {
  return (
    <>
      <AvatarProfile />
      <Banner />
      <ActivityOverview />
      <JobEvent />
    </>
  );
}

export default UserDashboard;
