import serverApi from "../../../utility/server";
import { useEffect, useState } from "react";

export const ProgrammesSlider = () => {
  const [programmes, setProgrammes] = useState({
    events: [],
    count: 0,
    limit: 0,
    page: 0,
  });

  const fetchData = async () => {
    try {
      const res = await serverApi.get("/events/public/all");

      if (res.status === 200) {
        setProgrammes(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching data from endpoint:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center  ">
      <h2 className="text-tblue uni text-2xl lg:text-5xl font-black ">
        WHAT WE HAVE <span className="text-tgreen">DONE</span>
      </h2>
      <div className="flex justify-between w-full overflow-auto no-scrollbar items-center bg-[#E1FBF7] lg:pl-[100px] my-8 lg:my-20 lg:p-14 p-6 ">
        {programmes.events.map((event, _i) => {
          return <img className="w-auto h-full lg:w-[694px] lg:h-[646px] mr-10" src={event.poster} alt="" key={_i}/>;
        })}
      </div>
    </div>
  );
};
