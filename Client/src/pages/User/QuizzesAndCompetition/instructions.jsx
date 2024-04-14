import { ReactComponent as LinkIcon } from "./link.svg";

const Instructions = ({ type, setShowQuestion, setShowInstructions }) => {
  return (
    <div className="rounded-xl quiz-competition-instructions bg-white pl-20 pr-10 py-6 mt-[46px]">
      <h4 className="font-bold text-2xl text-[#27AE60] mb-6">{type.toUpperCase()} INSTRUCTIONS</h4>
      <div className="text-[#3A3A3A] text-xl mb-6">
        {type === "Quiz" ? (
          <>
            <p className="mb-6">
              Kind read the following instructions for this multiple choice quiz for product designers:
            </p>
            <ul className="">
              <li>1. Start by selecting the quiz you want to take.</li>
              <li>2. Read each question carefully and choose the best answer from the options provided.</li>
              <li>{`3. Once you have selected your answer, click the "Next" button to move on to the next question.`}</li>
              <li>{`4. You can go back to previous questions by clicking the "Previous" button.`}</li>
              <li>{`5. When you have answered all the questions, click the "Submit" button to see your score.`}</li>
              <li>6. Review your score and the correct answers to the questions you missed.</li>
              <li>7. Use this feedback to improve your product design skills and knowledge.</li>
            </ul>
          </>
        ) : type === "Competition" ? (
          <>
            <p className="mb-6">
              Hey there! To participate in our product design competition, please follow the instructions below:
            </p>
            <ul className="">
              <li>1. Create a high-quality design for a product that fits the competition theme.</li>
              <li>2. Submit your design by the deadline provided on our website.</li>
              <li>
                3. Our judges will review all submissions and select the winners based on creativity, functionality, and
                overall design quality.
              </li>
              <li>4. Winners will be announced on our website and social media channels, so stay tuned!</li>
            </ul>
            <p className="mb-6">Good luck, and we can&apos;t wait to see your amazing designs!</p>
          </>
        ) : null}
      </div>
      {type === "Quiz" ? (
        <button
          className="w-[287px] h-[54px] rounded-[5px] bg-[#5E7CE8] text-white"
          onClick={() => {
            setShowQuestion({
              show: true,
              no: 1,
            });
            setShowInstructions(false);
          }}
        >
          Start
        </button>
      ) : type === "Competition" ? (
        <div className="flex items-center gap-1">
          <div className="flex items-center w-full border border-[#BDBDBD] rounded-[5px] h-[54px] pl-6">
            <LinkIcon className="mr-2" />
            <input
              type="text"
              name=""
              id=""
              className="border-0 outline-0 text-[#3A3A3A] placeholder:text-[#BDBDBD]"
              placeholder="Add link"
            />
          </div>
          <button
            className="w-[287px] h-[54px] rounded-[5px] bg-[#5E7CE8] text-white"
            onClick={() => {
              setShowQuestion({
                show: true,
                no: 1,
              });
              setShowInstructions(false);
            }}
          >
            Submit Link
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Instructions;
