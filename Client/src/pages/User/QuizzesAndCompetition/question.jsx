import React from "react";
import { ReactComponent as UncheckedIcon } from "./unchecked.svg";

const Question = ({ number, total, question, options }) => {
  const getOptionLabel = (index) =>
    index === 0
      ? "A"
      : index === 1
      ? "B"
      : index === 2
      ? "C"
      : index === 3
      ? "D"
      : "";
  return (
    <div className="rounded-xl quiz-competition-instructions bg-white px-5 py-6">
      <div className="px-6 pb-5">
        <h4 className="font-bold text-2xl text-[#27AE60] mb-4">
          QUESTION {number} of {total}
        </h4>
        <div className="text-[#3A3A3A] text-xl">
          <p className="mb-6">{question}</p>
          {options.map((option, index) => {
            return (
              <label
                htmlFor={`option__${index + 1}`}
                key={index}
                className="flex items-center mb-2"
              >
                <input
                  type="radio"
                  name="option"
                  id={`option__${index + 1}`}
                  hidden
                />
                <UncheckedIcon className="mr-1" />
                {getOptionLabel(index)}) {option}
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button className="w-[287px] h-[54px] rounded-[5px] bg-[#5E7CE8] text-white">
          Previous
        </button>
        <button className="w-[287px] h-[54px] rounded-[5px] bg-[#5E7CE8] text-white">
          {number === total ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Question;
