import { FaDropbox } from "react-icons/fa";

const JobCard = ({ job }) => {
  return (
    <div className="max-w-[350px] border border-tblackk/63 rounded-lg py-3 px-4 flex items-start gap-x-3 hover:bg-gray-100 mt-2">
      <div className="rounded-md p-1 w-[45px] h-[45px] ">
        <img src={job.poster} alt={job.title} />
      </div>

      <div className="space-y-3">
        <p className="text-black text-lg font-semibold">{job.title}</p>

        <p className="text-[#616161]">{job.company}</p>

        {/* chips */}
        <div className="flex items-center gap-x-3">
          <span className="text-[8px] font-semibold text-[#3DB193] border bg-[#eefaf7] py-1 rounded-md px-3 ">
            {job.contractType}
          </span>

          <span className="text-[8px] font-semibold text-[#FBB635] border border-[#FBB635] bg-white py-1 rounded-md px-3 ">
            {job.searchKeywords[0]}
          </span>

          <span className="text-[8px] font-semibold text-tblue border border-tblue bg-white py-1 rounded-md px-3">
            {job.workplaceType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
