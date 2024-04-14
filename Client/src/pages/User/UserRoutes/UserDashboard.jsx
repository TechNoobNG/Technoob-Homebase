import img1 from "./_images/dash_img1.png";
import bannerImg from "./_images/dash_banner.png";
import techForAllImg from "./_images/tech_for_all.png";
import QuizSection from "./_components/QuizSection";
import DashboardHeader from "./_components/DashboardHeader";
import ActiveTask from "./_components/ActiveTask";
import JobCard from "./_components/JobCard";
import { useEffect } from "react";
import serverApi from "../../../utility/server";

const UserDashboard = () => {
  useEffect(() => {
    const UserStats = async () => {
      serverApi.requiresAuth(true);
      const result = await serverApi("/user/dashboard");
      //   setData(result?.data?.data)
      console.log(result);
    };

    UserStats();
  }, []);

  // console.log({UserProfile})

  const activeTasks = [
    {
      type: "Event",
      title: "Women in tech summit",
      borderColor: "#5E7CE8",
    },
    {
      type: "Quiz",
      title: "Front-end web development",
      borderColor: "#70D399",
    },
    {
      type: "Competition",
      title: "Task management design",
      borderColor: "#EA929A",
    },
  ];
  return (
    <div>
      {/* header */}
      <DashboardHeader />

      {/* banner */}
      <div className="hidden lg:block w-full h-[250px] relative mt-8 px-8 py-3 shadow-lg">
        {/* bg image */}
        <img src={bannerImg} alt="" className="z-0 absolute inset-0 w-full h-full" />
        <div className="w-full h-full relative  flex justify-between items-center z-10">
          {/* work from home image */}
          <img src={img1} alt="" className="w-[420px] h-full object-contain" />

          {/* text content */}
          <div>
            <h2 className="flex flex-col text-tblackk text-4xl font-bold ">
              <span>One space</span>
              <span>to rule them all</span>
            </h2>

            <p className="max-w-[290px] font-light  mt-4">Empowering technoobs with cutting-edge tools</p>
          </div>
        </div>
      </div>
      {/* mobile screen banner */}
      <div className="lg:hidden w-full h-fit py-4 px-3 flex justify-center items-center text center mt-14 bg-[#27ae60]/40 rounded-[24px]">
        <div>
          <h2 className="flex text-tblackk text-2xl font-bold gap-x-2">
            <span>One space</span>
            <span>to rule them all</span>
          </h2>

          <p className="max-w-[290px] font-light  mt-4 text-center">Empowering technoobs with cutting-edge tools</p>
        </div>
      </div>

      {/* quiz cards */}
      <QuizSection />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 place-items-start w-full lg:mt-16 mt-12">
        {/* active tasks */}
        <div className="w-full">
          <h2 className="text-tblackk font-bold text-2xl mb-5">Active Tasks</h2>

          <div className="space-y-8">
            {activeTasks.map((task, i) => (
              <ActiveTask key={i} task={task} />
            ))}
          </div>
        </div>

        {/* recent jobs */}
        <div className="w-full">
          <h2 className="text-tblackk font-bold text-2xl mb-5">Recent Jobs</h2>

          <div className="space-y-8">
            {[1, 2].map((t, _i) => (
              <JobCard key={_i} />
            ))}
          </div>

          <img src={techForAllImg} alt="" className="w-full h-[270px] mt-10 object-contan" />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
