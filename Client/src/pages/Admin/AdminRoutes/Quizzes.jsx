import React, { useContext } from "react";
import QuizComponent from "../../../components/QuizComponent";
import { useState } from "react";
import RecentActivities from "../../../components/Tables/RecentActivities";
import { AppContext } from "../../../AppContext/AppContext";

const Quizzes = () => {
  const username = null;
  const active = "Quiz";
  const [noInput, setNoInput] = useState(Array(4).fill(""));
  const {UserProfile} = useContext(AppContext);
  return (
    <section className="">
    <div className="flex justify-between ">
      <div className="flex  sm:flex-row mb-5 md:mb-0 py-1 sm:py-5 justify-start sm:justify-center items-start sm:items-center ">
          <h1 className=" md:text-3xl text-xl font-semibold">Hey, {UserProfile.firstname} -</h1>
          <p className="md:pt-2 pt-1 text-sm ml-3 sm:text-lg text-[#3A3A3A66] sm:text-black">
            Welcome to the resource page.
          </p>
        </div>
      </div>

      <div className="flex flex-col h-full bg-white lg:shadow-lg w-full p-5 rounded-md">
        <div className="w-full flex max-lg:flex-col gap-3 lg:gap-24 py-5 lg:py-10 nun justify-between lg:items-center">
          <div className="flex ">
            <h1 className=" font-semibold md:text-3xl text-xl">
              Quizzes and Competition
            </h1>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="p-3 border w-full lg:w-[400px] rounded-[5px]"
          />
        </div>
        <div className="flex flex-col gap-3 mb-5 lg:mb-10">
          <div className="flex border-b gap-2 lg:gap-4">
            <p
              className={`${
                active === "Quiz" &&
                "bg-gray-100 text-tblue max-lg:w-[50%] border-b-2 border-b-tblue"
              } border px-4 py-2`}
            >
              Quiz
            </p>
            <p
              className={`${
                active === "competition" &&
                "text-tblue border-b-2  border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%]`}
            >
              Competition
            </p>
          </div>
          {active === "Quiz" && <QuizComponent />}
          <h1 className="mt-10 font-semibold">Add Questions</h1>
          <div className="flex border-b gap-2 lg:gap-4">
            <p
              className={`${
                active === "Quiz" &&
                "bg-gray-100 text-tblue border-b-2 border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%]`}
            >
              Multiple choice
            </p>
            <p
              className={`${
                active === "competition" &&
                "text-tblue border-b-2 border-b-tblue"
              } border px-4 py-2 max-lg:w-[50%]`}
            >
              Open ended
            </p>
          </div>
          <div className="flex flex-col gap-10 border-b py-2">
            <div className="flex gap-12 w-[99%] justify-between items-center ">
              <h1 className="text-lg font-semibold">Question</h1>
              <input
                type="text"
                placeholder="~~input text here~~"
                className="border p-1 w-full"
              />
            </div>
            <div className="flex gap-12 w-[99%] justify-start items-center ">
              <h1 className="text-lg font-semibold">Answers</h1>
              <div className="w-full gap-3 flex items-center justify-between">
                {noInput.map((item, i) => (
                  <input
                    key={i}
                    value={item}
                    type="text"
                    placeholder="A ~~input text here~~"
                    className="border p-1 w-[20%]"
                  />
                ))}
              </div>
            </div>
            <button className="border w-full lg:w-fit rounded-md text-tblue border-tblue px-6 p-4 lg:py-2">Add Question</button>
          </div>
          <div className="w-full flex items-center">
            <div className="flex max-lg:flex-col gap-5 w-full lg:justify-end">
                <button className=" px-16 py-3 bg-gray-400 rounded-md font-semibold">Save to draft</button>
                <button className="px-16 py-3 bg-tblue text-white rounded-md ">Publish Quiz</button>
            </div>
          </div>
        </div>
      <RecentActivities/>
      </div>
    </section>
  );
};

export default Quizzes;
