import { avatar } from "../../../../data/assets";
const People = ({ people }) => {
  return (
    <>
      {people?.data.map((person) => (
        <div
          id={person?._id}
          key={person?._id}
          className=" text-center md:w-[480px] w-auto px-4 md:h-[360px] h-[200px] shadow-md rounded-xl lg:px-10 mx-4 lg:py-10 py-4"
        >
          <div className="w-[200px] flex justify-center  h-[120px] md:w-[250px] md:h-[200px] ">
            <img
              src={person?.image ? person?.image : avatar}
              alt=" Member img"
              className="h-[120px] w-[190px] sm:h-[200px] sm:w-[250px] object-cover rounded-2xl"
            />
          </div>

          <div className="mt-4 md:mt-7">
            <h3 className=" md:text-2xl text-sm font-semibold">{`${person?.last_name} ${person?.first_name}`}</h3>
            <p className=" md:text-xl text-[10px] text-tblue font-extrabold ">{person?.designation} </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default People;
