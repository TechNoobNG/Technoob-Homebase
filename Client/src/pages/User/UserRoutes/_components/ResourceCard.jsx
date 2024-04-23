import { FaDropbox } from "react-icons/fa";

const ResourceCard = ({ resource }) => {
  return (
    <div className="max-w-[350px] border border-tblackk/63 rounded-lg py-3 px-4 flex items-start gap-x-3 hover:bg-gray-100 mt-2">
      <div className="rounded-md p-1 w-[45px] h-[45px] ">
        <img src={resource.image_placeholder} alt={resource.name} />
      </div>

      <div className="space-y-3">
        <p className="text-black text-lg font-semibold">{resource.name}</p>

        <p className="text-[#616161]">{resource.stack}</p>

        {/* chips */}
        <div className="flex items-center gap-x-3">
          <span className="text-[8px] font-semibold text-[#3DB193] border bg-[#eefaf7] py-1 rounded-md px-3">
            {resource.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
