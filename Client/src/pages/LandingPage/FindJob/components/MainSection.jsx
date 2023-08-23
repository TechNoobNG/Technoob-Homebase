import { React, useState }  from "react";
import JobCard from "../../../../utility/jobCards";
import Pagination from "./Pagination";

const MainSection = ({ data, onDelete, isAdmin }) => {
  const jobs = data;

  return (
    <div>
      <div className="nun mt-16 mb-10 w-full">
        <p className="text-lg font-bold">All Jobs</p>
        <p className="text-[#71717A] text-[10px]">
          Showing {jobs.length} Results
        </p>
        <div className="border-b-[0.5px] border-[#C2C7D6] mb-7 py-1" />
        <div className="flex flex-col gap-4 justify-start w-full mb-4">
          {jobs.map((job) => (
            <div key={job._id} className="w-full">
              <JobCard
                data={data}
                title={job.title}
                company={job.company}
                contractType={job.contractType}
                link={job.link}
                exp={job.exp}
                workplaceType={job.workplaceType}
                poster={job.poster}
                location={job.location}
                onDelete={onDelete}
                isAdmin={isAdmin}
                id={job._id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
