import { useContext } from "react";
import { AppContext } from "../../../../AppContext/AppContext";
import { emptyProfile } from "../../../../data/assets/asset";
import { format } from "date-fns";

const DashboardHeader = () => {
  const { UserProfile } = useContext(AppContext);

  return (
    <div className="flex items-center gap-x-4">
      <img
        src={UserProfile?.photo !== "default.jpg" ? UserProfile?.photo : emptyProfile}
        alt="profile"
        className="w-[50px] h-[50px] rounded-full object-cover "
      />

      <div>
        <h2 className="text-tblackk text-2xl font-bold">Hello, {UserProfile.firstname}</h2>
        <p className="text-sm text-black">Today is {format(new Date(), "EEEE, d MMMM yyyy")}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
