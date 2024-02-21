import React, { useState } from "react";
import "./styles.css";
import Instructions from "./instructions";
import Submission from "./submission";

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
const QuizzesAndCompetition = () => {
  const [activeTab, setActiveTab] = useState("Quiz");
  return (
    <div className="p-10">
      <section className="flex items-center border-b">
        <span
          className={`${
            activeTab === "Quiz"
              ? "bg-[#EFF0F5] text-[#5E7CE8] text-2xl"
              : "text-[#3A3A3A80] text-xl"
          } p-[10px] cursor-pointer`}
          onClick={() => setActiveTab("Quiz")}
        >
          Quiz
        </span>
        <span
          className={`${
            activeTab === "Competition"
              ? "bg-[#EFF0F5] text-[#5E7CE8] text-2xl"
              : "text-[#3A3A3A80] text-xl"
          } p-[10px] cursor-pointer`}
          onClick={() => setActiveTab("Competition")}
        >
          Competition
        </span>
      </section>
      <div>Calendar</div>
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
                  className="bg-white pending-quiz-card p-6 rounded-[24px] flex items-center justify-between"
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
                  className="bg-white pending-quiz-card p-6 rounded-[24px] flex items-center justify-between"
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
    </div>
  );
};

export default QuizzesAndCompetition;
