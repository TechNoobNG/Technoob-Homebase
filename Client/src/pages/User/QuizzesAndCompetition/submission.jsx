import { ReactComponent as MsgIcon } from "./msg.svg";

const Submission = () => {
  return (
    <div className="rounded-xl quiz-competition-instructions bg-white px-20 pt-6 pb-[200px] mt-[46px]">
      <h4 className="font-bold text-2xl text-[#27AE60] mb-6">SUBMISSION</h4>
      <p className="mb-10 text-[#3A3A3A] text-xl">
        Great job! Your quiz has been submitted successfully. You&apos;ll receive your results shortly.
      </p>
      <div className="grid place-items-center">
        <MsgIcon />
      </div>
    </div>
  );
};

export default Submission;
