import React, { useMemo, useState } from "react";
import "./styles.css";
import { ReactComponent as SearchIcon } from "./search.svg";
import Instructions from "./instructions";
import Question from "./question";
import Submission from "./submission";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const data = [
  {
    type: "Daily Quiz",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#FAF09D",
  },
  {
    type: "Daily Quiz",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#FFB6DD",
  },
  {
    type: "Daily Quiz",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#DDBEEC",
  },
  {
    type: "Daily Quiz",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#CEF1D5",
  },
];
const competitionData = [
  {
    type: "Daily Competition",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#FAF09D",
  },
  {
    type: "Daily Competition",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#FFB6DD",
  },
  {
    type: "Daily Competition",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#DDBEEC",
  },
  {
    type: "Daily Competition",
    name: "Product Testing",
    date: "Sat. June 2024",
    time: "9:00am - 11:00am",
    color: "#CEF1D5",
  },
];
const myEventsList = [
  {
    start: moment().toDate(),
    end: moment().add(1, "days").toDate(),
    title: "Some title",
  },
];
const QuizzesAndCompetition = () => {
  const [activeTab, setActiveTab] = useState("Quiz");
  const [quizMode, setQuizMode] = useState("off");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showQuestion, setShowQuestion] = useState({
    show: false,
    no: 0,
  });
  const [showSubmit, setShowSubmit] = useState(false);
  const [que, setQue] = useState(
    "Which of the following design principles is not a part of the Gestalt theory?"
  );
  const [options, setOptions] = useState([
    "Similarity",
    "Closure",
    "Continuity",
    "Serendipity",
  ]);

  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date(),
    }),
    []
  );

  return (
    <div className="p-10 flex gap-6">
      <div className="w-[80%]">
        <section className="flex items-center border-b">
          <span
            className={`${
              activeTab === "Quiz"
                ? "bg-[#EFF0F5] text-[#5E7CE8] text-2xl"
                : "text-[#3A3A3A80] text-xl"
            } p-[10px] cursor-pointer`}
            onClick={
              quizMode === "off" ? () => setActiveTab("Quiz") : undefined
            }
          >
            Quiz
          </span>
          <span
            className={`${
              activeTab === "Competition"
                ? "bg-[#EFF0F5] text-[#5E7CE8] text-2xl"
                : "text-[#3A3A3A80] text-xl"
            } p-[10px] cursor-pointer`}
            onClick={
              quizMode === "off" ? () => setActiveTab("Competition") : undefined
            }
          >
            Competition
          </span>
        </section>
        {quizMode === "on" && (
          <>
            {showInstructions ? (
              <Instructions
                type={activeTab}
                setShowQuestion={setShowQuestion}
                setShowInstructions={setShowInstructions}
              />
            ) : showQuestion.show ? (
              <Question
                number={showQuestion.no}
                total={20}
                question={que}
                options={options}
                onNext={() => {
                  setShowQuestion({
                    show: true,
                    no: 20,
                  });
                  setQue(
                    "Which of the following design principles is not a part of the Gestalt theory?"
                  );
                  setOptions([
                    "Similarity",
                    "Closure",
                    "Continuity",
                    "Serendipity",
                  ]);
                }}
                onSubmit={() => {
                  setShowQuestion({
                    no: 0,
                    show: false,
                  });
                  setShowSubmit(true);
                }}
              />
            ) : showSubmit ? <Submission /> : null}
          </>
        )}
        {quizMode === "off" && (
          <div className="pt-[18px] pb-[75px]">
            <Calendar
              localizer={localizer}
              defaultDate={defaultDate}
              defaultView={"week"}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 800 }}
              views={["week"]}
            />
          </div>
        )}
        {quizMode === "off" && (
          <>
            {activeTab === "Quiz" ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-[32px] text-[#27AE60]">
                    Pending Quiz
                  </span>
                  <span className="font-bold text-xl text-[#5E7CE8] cursor-pointer">
                    See All
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.map((item, index) => {
                    const color = item.color;
                    return (
                      <section
                        key={index}
                        onClick={() => {
                          setQuizMode("on");
                          setShowInstructions(true);
                        }}
                        className="cursor-pointer bg-white pending-quiz-card border p-6 rounded-[24px] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[#111111B2] mb-3">{item.type}</p>
                          <h4 className="font-semibold text-xl text-[#111111]">
                            {item.name}
                          </h4>
                        </div>
                        <div
                          className="w-[7px] h-full"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="mb-3 font-semibold text-xs text-[#111111B2]">
                            {item.date}
                          </p>
                          <p className="font-semibold text-xs text-[#111111B2]">
                            {item.time}
                          </p>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            ) : activeTab === "Competition" ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-[32px] text-[#27AE60]">
                    Pending Competitions
                  </span>
                  <span className="font-bold text-xl text-[#5E7CE8] cursor-pointer">
                    See All
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {competitionData.map((item, index) => {
                    const color = item.color;
                    return (
                      <section
                        key={index}
                        onClick={() => {
                          setQuizMode("on");
                          setShowInstructions(true);
                        }}
                        className="cursor-pointer bg-white pending-quiz-card border p-6 rounded-[24px] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[#111111B2] mb-3">{item.type}</p>
                          <h4 className="font-semibold text-xl text-[#111111]">
                            {item.name}
                          </h4>
                        </div>
                        <div
                          className="w-[7px] h-full"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="mb-3 font-semibold text-xs text-[#111111B2]">
                            {item.date}
                          </p>
                          <p className="font-semibold text-xs text-[#111111B2]">
                            {item.time}
                          </p>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
      {quizMode === "off" && (
        <div className="w-[20%]">
          <div className="mb-[26px] flex items-center gap-3 w-full py-[15px] px-[24px] rounded-[5px] border border-[#BDBDBD] relative top-[50px]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Keyword"
              className="border-0 outline-0 placeholder:text-[#BDBDBD] text-base"
            />
          </div>
          <button className="w-full h-[54px] rounded-[5px] bg-[#5E7CE8] text-white relative top-[50px]">
            Search
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizzesAndCompetition;
