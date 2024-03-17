import impact from "../../../data/assets/impact.png";

export const JumbotronSection = () => {
  return (
    <div className="flex flex-col py-20 justify-center items-center px-5 lg:px-32">
      <h2 className="uni text-3xl uppercase lg:text-5xl text-tblue">
        Impacts <span className="uni text-tgreen">made</span>{" "}
      </h2>
      <div className="py-8 flex flex-col justify-center items-center w-[300px] lg:w-[900px]">
        <p className="nun text-base lg:text-2xl text-center">
          At Technoob, we hope to impact hundreds of enthusiast in Tech Careers
          and sustain their Tech careers.
        </p>
        <p className="nun text-base lg:text-2xl text-center">
          Through your donations, sponsorships and partnerships, we'll be able
          to impact more people and touch more lives.
        </p>
      </div>

      <img className="w-full h-[195px] lg:w-1529px lg:h-[498px] object-fit" src={impact} alt="" />
    </div>
  );
};
