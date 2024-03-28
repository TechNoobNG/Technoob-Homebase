import { useNavigate } from "react-router-dom";
import partnership from "../../../data/assets/partnership.png";

export const Partnerships = () => {
  const navigate = useNavigate();

  const navigateToContact = () => {

    navigate("/Contact-Us");
  };
  return (
    <div className="flex  justify-center px-5 lg:px-48 pb-20">
      <div className="flex flex-col justify-center w-full ">
        <h2 className="text-tblue nun text-2xl my-6 lg:my-0 lg:text-6xl font-black ">
          Partner <span className="text-tgreen">With Us</span>
        </h2>
        <div className="py-3">
          <img src={partnership} alt="" className=" lg:hidden w-auto h-auto" />
        </div>
        <p className="nun text-xl font-normal w-auto lg:pr-48 py-3">
          We have an array of events and workshops planned and we need all the help we can get, if you like to partner
          with us or sponsor an event, we would be glad.
        </p>
        <button
          className={` w-full lg:w-[201px] h-[54px] text-base font-[400] bg-[#5E7CE8] rounded-md text-[#F2F2F2] py-4 px-3.5`}
          onClick={navigateToContact}
        >
          Contact Us
        </button>
      </div>
      <div className="pb-20">
        <img src={partnership} alt="" className="lg:flex w-[900px] h-auto hidden" />
      </div>
    </div>
  );
};

