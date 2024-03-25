import { IoIosCreate } from "react-icons/io";
import { BsShieldLockFill } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";
import { BiSolidMessageError } from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function Logic() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full py-8 flex flex-col justify-start items-center bg-neutral-200 dark:bg-slate-800">
      <Helmet>
        <title> {t("helmet.logic.title")}</title>
        <meta name="description" lang="en" content="A page for logic" />
      </Helmet>
      <div className="w-full flex justify-center items-center">
        <h3 className="text-center font-[Handjet] text-black dark:text-white text-[96px]">
          {t("pagesLogic.howItWorks")}
        </h3>
      </div>
      <div className="w-full flex flex-row justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <IoIosCreate className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              {t("pagesLogic.step1Title")}
            </h2>
            <p className="text-black dark:text-white">
              {t("pagesLogic.step1Content")}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row-reverse justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <BsShieldLockFill className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              {t("pagesLogic.step2Title")}
            </h2>
            <p className="text-black dark:text-white">
              {t("pagesLogic.step2Content")}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <IoStatsChartSharp className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              {t("pagesLogic.step3Title")}
            </h2>
            <p className="text-black dark:text-white">
              {t("pagesLogic.step3Content")}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <BiSolidMessageError className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              {t("pagesLogic.step4Title")}
            </h2>
            <p className="text-black dark:text-white">
              {t("pagesLogic.step4Content")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logic;
