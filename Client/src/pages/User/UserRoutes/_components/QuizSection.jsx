import { IoMdTime } from "react-icons/io";
import { MdOutlineLeaderboard } from "react-icons/md";

const QuizSection = ({ lastCompletedQuizAttempt, rank, leaderboardRecord, leaderBoardUsers, quizRecommendation }) => {
  return (
    <div className="mt-8 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
      {/*  */}
      <div className="border border-[#27ae60]/40 rounded-lg shadow">
        <div className="flex px-6 py-4 justify-between items-center">
          <div className="text-tblackk flex flex-col items-center">
            <IoMdTime className="text-2xl" />
            <p className="text-sm font-semibold">Recent Quiz</p>
          </div>

          <div className="text-tblackk text-center">
            <p className="text-base">{lastCompletedQuizAttempt?.quiz?.attempted || "N/A"}</p>
            <p className="text-sm font-semibold">Attempt(s)</p>
          </div>
        </div>

        <div className="flex px-8 py-3 justify-between items-center text-tblackk bg-[#27ae60]/40 text-center">
          <div>
            <p className="text-sm">{ lastCompletedQuizAttempt?.quiz?.completed ? "✅": "❌"  || "N/A"}</p>
            <p className="text-xs">Completed</p>
          </div>

          <div>
            <p className="text-sm">{ `${lastCompletedQuizAttempt?.quiz?.score}%` || "N/A"}</p>
            <p className="text-xs">Your Score</p>
          </div>
        </div>
      </div>

      <div className="border border-[#5E7CE8]/40 rounded-lg shadow">
        <div className="flex px-6 py-4 justify-between items-center">
          <div className="text-tblackk flex flex-col items-center">
            <MdOutlineLeaderboard className="text-2xl" />
            <p className="text-sm font-semibold">Leaderboard</p>
          </div>

          <div className="text-tblackk text-center">
            <p className="text-base">{ rank || "N/A" }</p>
            <p className="text-sm font-semibold">Position</p>
          </div>
        </div>

        <div className="flex px-8 py-3 justify-between items-center text-white bg-[#5E7CE8]/40 text-center">
          <div>
            <p className="text-sm">{ leaderboardRecord?.quizAttempts?.length || "N/A"}</p>
            <p className="text-xs">Total Engagements</p>
          </div>

          <div>
            <p className="text-sm">{leaderBoardUsers || "N/A"}</p>
            <p className="text-xs">Noobies</p>
          </div>
        </div>
      </div>

      <div className="border border-[#27ae60]/40 rounded-lg shadow">
        <div className="flex px-6 py-4 justify-between items-center">
          <div className="text-tblackk flex flex-col items-center">
            <IoMdTime className="text-4xl" />
            {quizRecommendation && quizRecommendation[0] && <p className="text-sm font-semibold">{`Attempt a ${quizRecommendation[0].type.charAt(0).toUpperCase() + quizRecommendation[0].type.slice(1)}` || "N/A"}</p>}
            {!quizRecommendation && <p className="text-sm font-semibold">{"No recommended quizzes available" }</p>}
          </div>
          <div className="text-tblackk text-center">
            {quizRecommendation && quizRecommendation[0] && <p className="text-base font-bold">{quizRecommendation[0].theme || "N/A"}</p>}
            {quizRecommendation && quizRecommendation[0] &&  <p className="text-sm font-semibold">{ quizRecommendation[0].stack || "N/A"}</p>}
          </div>
        </div>

        <div className="flex px-8 py-3 justify-center items-center text-tblackk bg-[#27ae60]/40 text-center">
          <div>
            <button className="">
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
