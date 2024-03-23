
import { FaDropbox } from "react-icons/fa";

const JobCard = () => {

    return (
        <div className='max-w-[350px] border border-tblackk/63 rounded-lg py-3 px-4 flex items-start gap-x-3'>

            <div className="rounded-md p-1 w-[45px] h-[45px] ">
            <FaDropbox  className="h-full w-full text-tblue"/>
            </div>

            <div className="space-y-3">
                <p className="text-black text-lg font-semibold">Social Media Assistant</p>

                <p className='text-[#616161] '>Dropbox . San francisco, USA</p>

                {/* chips */}
                <div className="flex items-center gap-x-3">
                    <span className="text-[8px] font-semibold text-[#3DB193] border bg-[#eefaf7] py-1 rounded-md px-3 ">Full time</span>

                    <span className="text-[8px] font-semibold text-[#FBB635] border border-[#FBB635] bg-white py-1 rounded-md px-3 ">Marketing</span>

                    <span className="text-[8px] font-semibold text-tblue border border-tblue bg-white py-1 rounded-md px-3">Design</span>
                </div>
            </div>
        </div>
    )
}

export default JobCard;