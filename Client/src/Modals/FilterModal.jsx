import { useState } from "react";
import Modal from "react-modal";
import { RiArrowDownSLine, RiArrowLeftSLine } from "react-icons/ri";
import { filtersearch } from "../data/assets";
import Checks from "../pages/LandingPage/FindJob/components/Checks";

const FilterComponent = ({
  isOpen,
  onRequestClose,
  selected,
  setSelected,
  options,
  passedOptions,
  setpassedOptions,
  handleBox1Change,
  box1,
  closeFilterModal,
  setFilter,
}) => {
  const [active, setActive] = useState(false);

  const Options = options.map((option, index) => {
    let alias;
    let key = option.key;

    if (key === "averageRating") alias = "Ratings";
    if (key === "stack") alias = "Stack";
    if (key === "type") alias = "Type";

    return {
      id: index,
      alias: alias,
      name: option.key,
      values: option.value,
    };
  });

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-4 bg-white rounded-md">
          <div className="flex justify-start items-center p-4">
            <img src={filtersearch} alt="icon" className="mr-2 w-6 h-6" />
            <p className="text-sm font-normal">Filter By</p>
          </div>
          <div className="border-b-[0.5px] border-[#C2C7D6] mb-7" />
          <div className="shadow-md rounded-lg p-2">
            <div
              onClick={() => setActive((prev) => !prev)}
              className="flex justify-between items-center p-2 cursor-pointer"
            >
              <h1 className="sm:text-2xl">{selected}</h1>
              {active ? <RiArrowDownSLine /> : <RiArrowLeftSLine />}
            </div>
            <ul className={`${active ? "block" : "hidden"} `}>
              {Options.map((option, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setActive(false);
                    setSelected(option.alias);
                    setpassedOptions(option);
                  }}
                  className="text-sm pl-4 hover:bg-[#F0F4FE] rounded-md cursor-pointer"
                >
                  {option.alias}
                </li>
              ))}
            </ul>
          </div>
          <Checks passOptions={passedOptions} handleBox1Change={handleBox1Change} box1={box1} />
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto" onClick={setFilter}>
              Apply Filter
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto" onClick={closeFilterModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterComponent;
