import img1 from "./_images/dash_img1.png";
import bannerImg from "./_images/dash_banner.png";
import techForAllImg from "./_images/tech_for_all.png";
import QuizSection from "./_components/QuizSection";
import DashboardHeader from "./_components/DashboardHeader";
import ActiveTask from "./_components/ActiveTask";
import JobCard from "./_components/JobCard";
import ResourceCard from "./_components/ResourceCard";
import { useEffect, useState } from "react";
import serverApi from "../../../utility/server";
import showToast from "../../../utility/Toast";

const fetchUserStats = async (setUserDashboardInfo) => {
  serverApi.requiresAuth(true);
  try {
    const { data: response } = await showToast({
      type: "promise",
      promise: serverApi("/user/dashboard")
    });
    const responseData = response?.data;
    setUserDashboardInfo(responseData || {});
  } catch (error) {
    showToast({
      message: error.message || "An error ocurred, please contact support.",
      type: "error",
    });
    setUserDashboardInfo({})
  }
};

const extractdashInfo = ({ userDashboardInfo, setActiveTasks }) => {
  if (!Object.keys(userDashboardInfo).length) {
    return
  }
  //add pending quizes to active tasks
  let activeTasks = [...userDashboardInfo.pendingQuizzes.map((quiz)=>{
    return {
      type:  quiz.quiz_info.type.charAt(0).toUpperCase() + quiz.quiz_info.type.slice(1),
      title: quiz.quiz_info.theme,
      borderColor: quiz.quiz_info.type === 'quiz' ?  "#70D399": "#EA929A",
    }
  })];

  const currentDateTime = new Date();
  
  //add quiz recommendations to active tasks
  activeTasks.push(
      ...userDashboardInfo.recommendations.quiz.filter(quiz => {
          const deadline = new Date(quiz.deadline);
          return deadline > currentDateTime;
      }).map((quiz) => {
        return {
          type: quiz.type.charAt(0).toUpperCase() + quiz.type.slice(1),
          title: quiz.theme,
          borderColor:  quiz.quiz_info.type === 'quiz' ?  "#70D399": "#EA929A",
        }
      })
  );

  setActiveTasks(activeTasks);
}

const UserDashboard = () => {

  const [activeTasks, setActiveTasks] = useState([]);
  const [userDashboardInfo, setUserDashboardInfo] = useState({});

  useEffect(() => {
    fetchUserStats(setUserDashboardInfo);
    extractdashInfo({userDashboardInfo, setActiveTasks})
  }, []);


  const { recommendations, lastCompletedQuizAttempt, rank, leaderboardRecord, leaderBoardUsers } = userDashboardInfo;
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

          <p className="max-w-[290px] font-light  mt-4 text-center">Empowering technoobs</p>
        </div>
      </div>

      {/* quiz cards */}
      <QuizSection
        lastCompletedQuizAttempt={lastCompletedQuizAttempt}
        rank={rank}
        leaderboardRecord={leaderboardRecord}
        leaderBoardUsers={leaderBoardUsers}
        quizRecommendation = {recommendations && recommendations.quiz}
      />

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
          <h2 className="text-tblackk font-bold text-2xl mb-5">Recommended Jobs</h2>

          <div className="space-y-8">
            {recommendations && recommendations.jobs && recommendations.jobs.map((job, _i) => (
              <a href={ job.link } key={_i}>
                <JobCard key={_i} job={job} />
              </a>
            ))}
          </div>

          <h2 className="text-tblackk font-bold text-2xl mb-5 mt-5">Recommended Resources</h2>

          <div className="space-y-8">
            {recommendations && recommendations.resources && recommendations.resources.map((resource, _i) => (
             <a href={ resource.url } key={_i}>
                <ResourceCard key={_i} resource={resource} />
              </a>
            ))}
          </div>

          <img src={techForAllImg} alt="" className="w-full h-[270px] mt-10 object-contan" />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
