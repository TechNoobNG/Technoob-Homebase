import { CTA } from "../../../components";
import Page1 from "./reasources_pages/Page1";

const Resources = () => {
  return (
    <div className="flex flex-col w-full h-full justify-between items-start md:gap-24">
      <Page1 />
      <CTA />
    </div>
  );
};

export default Resources;
