import { useEffect, useRef, useState, useContext } from "react";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import Checks from "./components/Checks";
import Button from "../../../utility/button";
import { container, main } from "../style/style";
import { RiArrowDownSLine } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import { close, filtersearch, SearchIcon } from "../../../data/assets";
import serverApi from "../../../utility/server";
import { fetchFilteredData, fetchFirstData } from "../../../utility/filterGather.jsx";
import FilterComponent from "../../../Modals/FilterModal";
import { AppContext } from "../../../AppContext/AppContext";
import showToast from "../../../utility/Toast.jsx";

const FindJobs = () => {
  const [selected, setSelected] = useState("Select filter");
  const [passedOptions, setpassedOptions] = useState({});
  const [active, setActive] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [togggle, setTogggle] = useState(false);
  const [box1, setBox1] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [pagination, setPagination] = useState({});
  const [jobData, setJobData] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [, setLoading] = useState(false);
  const isInitialRender = useRef(true);
  const { UserProfile } = useContext(AppContext);

  // const [, setJobMetrics] = useState({"total": 0,
  //   "views": 0})

  const handleActive = () => {
    setActive(!active);
  };

  // const openFilterModal = () => {
  //     setIsFilterModalOpen(true);
  // };
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilter = () => {
    setFilter(true);
  };

  const deleteJob = async (id) => {
    try {
      if (UserProfile.role !== "admin") {
        throw new Error("You are not authorized to perform this action");
      }
      serverApi.requiresAuth(true);
      const response = await serverApi.post(`/jobs/delete/${id}`);
      if (response.status === 200) {
        setReset(!reset);
      } else {
        alert("Invalid ID");
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  };

  const Options = options.map((option, index) => {
    let alias;
    let key = option.key;

    if (key === "title") alias = "Title";
    if (key === "exp") alias = "Experience";
    if (key === "location") alias = "Location";
    if (key === "workplaceType") alias = "Workplace Type";
    if (key === "contractType") alias = "Contract Type";

    return {
      id: index,
      alias: alias,
      name: option.key,
      values: option.value,
    };
  });

  useEffect(() => {
    let params = {};
    if (box1.length > 0 && !isLoading) {
      params[passedOptions.name] = box1.join(",");
      fetchFilteredData(params, `/jobs/all`, setJobData, "jobs", setPagination).then((r) => {});
    }
    if (reset) {
      fetchFirstData("/jobs/all", setJobData, setOptions, false, "jobs", setPagination).then((_r) =>
        setIsLoading(false)
      );
    }
  }, [filter, reset]);

  const handleBox1Change = (e) => {
    e.preventDefault();
    const newValue = e.currentTarget.value;
    const updatedSelectedValues = box1.includes(newValue)
      ? box1.filter((val) => val !== newValue)
      : [...box1, newValue];
    setBox1(updatedSelectedValues);
    if (updatedSelectedValues.length === 0) {
      setReset(true);
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setLoading(true);
    const params = {
      page: currentPage,
    };

    fetchFirstData("/jobs/all", setJobData, setOptions, false, "jobs", setPagination, params).then((_r) => {
      setLoading(false);
      setReset(false);
    });
  }, [currentPage]);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      let params = {};
      if (searchLocation) {
        params.location = searchLocation;
      }
      if (searchTitle) {
        params.searchTitle = encodeURIComponent(searchTitle);
      }

      params.limit = 30;
      const response = await serverApi.get(`/jobs/all`, {
        params,
      });
      if (response.status === 200) {
        let responseData = response.data?.data?.jobs;
        setJobData(responseData);
      } else {
        showToast({
          message: "No jobs found",
          type: "info",
        });
      }
    } catch (e) {
      showToast({
        message: "An error Occured, Please contact support",
        type: "error",
     })
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchFirstData("/jobs/all", setJobData, setOptions, false, "jobs", setPagination).then((_r) => setIsLoading(false));
  }, []);

  return (
    <div className={`${main.wraper}`}>
      <Header />
      <div
        className={`absolute shadow-sm right-0 left-4 mt-20 h-auto z-10 bg-white w-[85%] flex flex-col justify-start items-start ${togggle ? "block" : "hidden"} xl:hidden`}
      >
        <div className="flex justify-between items-center p-4 w-full">
          <div className="flex p-2">
            <img src={filtersearch} alt="icon" className="mr-3 w-6 h-6" />
            <p className="text-sm font-normal">Filter By</p>
          </div>
          <img src={close} alt="close" onClick={() => setTogggle(!togggle)} />
        </div>
        <div className=" border-b-[0.5px] m-auto w-[95%] mt-6 border-[#C2C7D6] mb-7" />
      </div>
      <div className={`${container.containerGrid}`}>
        <div className={`${container.leftGrid}`}>
          <div onClick={() => setToggle(!toggle)} className="flex justify-between items-center p-4 cursor-pointer">
            <div className="flex justify-center">
              <img src={filtersearch} alt="icon" className="mr-2 w-6 h-6" />
              <p className="text-sm font-normal">Filter By</p>
            </div>
            <RiArrowDownSLine />
          </div>
          <div className=" border-b-[0.5px] border-[#C2C7D6] mb-7" />
          <div className={` ${toggle ? "block" : "hidden"} shadow-md rounded-lg p-2`}>
            <div
              onClick={() => setActive(handleActive)}
              className="flex justify-between items-center p-2 cursor-pointer"
            >
              <h1 className="text-sm">{selected}</h1>
              <RiArrowDownSLine />
            </div>
            <ul className={`${active ? "block" : "hidden"}`}>
              {Options.map((option, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setActive(false);
                    setSelected(option.alias);
                    setpassedOptions(option);
                  }}
                  className="text-sm p-3 pl-4 hover:bg-[#F0F4FE] rounded-md cursor-pointer"
                >
                  {option.alias}
                </li>
              ))}
            </ul>
          </div>
          <Checks passOptions={passedOptions} handleBox1Change={handleBox1Change} box1={box1} />
        </div>
        <div className={`${container.rightGrid}`}>
          <form className=" w-[95%] flex flex-col sm:flex-row justify-start md:justify-center items-centers gap-6 ">
            <div className="flex justify-start items-center border border-[#BDBDBD] sm:w-[80%] h-[54px] rounded-md bg-transparent pl-7 ">
              <img src={SearchIcon} alt="icon" className="h-5 w-5 md:hidden" />
              <input
                type="text"
                placeholder="Job title"
                className="placeholder:italic placeholder:text-slate-400 focus:outline-none text-base w-full h-[100%] p-3 mr-2 focus:border-none focus:ring-[0] "
                onChange={(e) => setSearchTitle(e.target.value)}
              />
              <img
                src={filtersearch}
                alt="icon"
                onClick={() => {
                  setTogggle((prev) => !prev);
                }}
                className="xl:hidden block mr-2 w-6 h-6"
              />
            </div>
            <div className="flex justify-start items-center border border-[#BDBDBD] sm:w-[35%] h-[54px] rounded-md bg-transparent pl-5 ml-[-15px] ">
              <MdLocationOn className=" text-slate-400 h-8 w-8" />
              <input
                type="text"
                placeholder="Lagos"
                className="placeholder:italic placeholder:text-slate-400 focus:outline-none text-base w-full h-[100%] p-3 mr-2 focus:border-none focus:ring-[0] "
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div>
              <Button name={"Search"} handleClick={handleClick} />
            </div>
          </form>
          {jobData.length > 0 ? (
            <MainSection data={jobData} onDelete={deleteJob} isAdmin={UserProfile?.role === "admin"} />
          ) : (
            <div className="text-center mt-8 h-full">
              <h1 className="text-xl font-bold">No job found</h1>
              <p className="text-gray-500 mt-2">Unfortunately, we couldn&apos;t find any matching jobs.</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mt-20 mb-10">
        {jobData.length > 0 && (
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, index) => (
              <button
                key={index}
                className={`px-2 py-1 rounded ${
                  pagination.page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <FilterComponent
        isOpen={isFilterModalOpen}
        onRequestClose={closeFilterModal}
        passedOptions={passedOptions}
        setpassedOptions={setpassedOptions}
        options={options}
        selected={selected}
        setSelected={setSelected}
        handleBox1Change={handleBox1Change}
        box1={box1}
        closeFilterModal={closeFilterModal}
        setFilter={handleFilter}
      />
    </div>
  );
};

export default FindJobs;
