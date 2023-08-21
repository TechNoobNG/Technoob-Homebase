import React from "react";

const JobCard = ({
  title,
  company,
  location,
  contractType,
  workplaceType,
  link,
  exp,
  poster,
  onDelete,
  isAdmin,
  id
}) => {

  const onClick = (e) => { 
    e.preventDefault()
    onDelete(id)
  }
  return (
    <div className="w-full p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Display the image only on non-mobile screens */}
        <div className="hidden sm:block w-24 sm:w-32 h-24 sm:h-32 mt-3 sm:mt-0 sm:rounded-l-md flex items-center justify-center p-2">
          <img
            src={poster}
            alt={title}
            className="object-cover rounded-lg w-full h-full"
          />
        </div>
        <div className="flex flex-col pl-4 pt-3 sm:pt-0 sm:pl-6 w-full">
          <h1 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
            {title}
          </h1>
          <p className="text-sm sm:text-base font-normal truncate w-full">
            {workplaceType} <span className="text-gray-400">. {location}</span>
          </p>
          <div className="flex mt-2 gap-2">
            <span className="text-xs bg-green-100 text-green-500 py-1 px-2 rounded-md">
              {company}
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-500 py-1 px-2 rounded-md">
              {contractType ? contractType : "contract"}
            </span>
            <span className="text-xs bg-blue-100 text-blue-500 py-1 px-2 rounded-md">
              {exp}
            </span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col gap-4 flex-row justify-center items-center mt-4 sm:mt-0">
        <a
          href={link}
          className="w-full sm:w-auto sm:text-sm text-center sm:text-left text-white bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-md mb-2 sm:mb-0 sm:mr-2"
        >
          Apply
        </a>

        {
          isAdmin && (
            <button
          onClick={onClick}
          className="w-full sm:w-auto sm:text-sm text-center sm:text-left text-white bg-red-500 hover:bg-red-600 py-2 px-3 rounded-md mb-2 sm:mb-0 sm:mr-2"
        >
          Delete
        </button>
          )
        }
        
      </div>
    </div>
  );
};

export default JobCard;
