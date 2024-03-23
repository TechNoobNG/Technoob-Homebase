import { IoMdTime } from "react-icons/io";

const QuizSection = () => {

    return (
        <div className="mt-8 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">

                {/*  */}
                <div className="border border-[#27ae60]/40 rounded-lg shadow">
                    <div className="flex px-6 py-4 justify-between items-center">
                        <div className="text-tblackk flex flex-col items-center">
                        <IoMdTime className="text-2xl"/>
                            <p className="text-sm font-semibold">Recent Quiz Score</p>
                        </div>

                        <div className="text-tblackk text-center">
                            <p className="text-base">18/20</p>
                            <p className="text-sm font-semibold">Correct Responses</p>
                        </div>
                    </div>

                    <div className="flex px-8 py-3 justify-between items-center text-tblackk bg-[#27ae60]/40 text-center">
                    <div >
                            <p className="text-sm">20/20</p>
                            <p className="text-xs">High Score</p>
                        </div>

                        <div>
                            <p className="text-sm">80%</p>
                            <p className="text-xs">Your Scores</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#5E7CE8]/40 rounded-lg shadow">
                    <div className="flex px-6 py-4 justify-between items-center">
                        <div className="text-tblackk flex flex-col items-center">
                        <IoMdTime className="text-2xl"/>
                            <p className="text-sm font-semibold">Leaderboard</p>
                        </div>

                        <div className="text-tblackk text-center">
                            <p className="text-base">8</p>
                            <p className="text-sm font-semibold">Position</p>
                        </div>
                    </div>

                    <div className="flex px-8 py-3 justify-between items-center text-white bg-[#5E7CE8]/40 text-center">
                    <div >
                            <p className="text-sm">40%</p>
                            <p className="text-xs">Engagement</p>
                        </div>

                        <div>
                            <p className="text-sm">8/10</p>
                            <p className="text-xs">Responses</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#27ae60]/40 rounded-lg shadow">
                    <div className="flex px-6 py-4 justify-between items-center">
                        
                        <IoMdTime className="text-4xl"/>
                          

                        <div className="text-tblackk text-center">
                            <p className="text-base font-bold">20</p>
                            <p className="text-sm font-semibold">Questions</p>
                        </div>
                    </div>

                    <div className="flex px-8 py-3 justify-center items-center text-tblackk bg-[#27ae60]/40 text-center">
                    <div >
                            <p className="text-sm font-semibold">15mins</p>
                            <p className="text-xs">Total time</p>
                        </div>

                    </div>
                </div>
            </div>
    )
};

export default QuizSection;