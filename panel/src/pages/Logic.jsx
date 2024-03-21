import { IoIosCreate } from "react-icons/io";
import { BsShieldLockFill } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";
import { BiSolidMessageError } from "react-icons/bi";
function Logic() {
  return (
    <div className="min-h-screen w-full py-8 flex flex-col justify-start items-center bg-neutral-200 dark:bg-slate-800">
      <div className="w-full flex justify-center items-center">
        <h3 className="text-center font-[Handjet] text-black dark:text-white text-[96px]">
          How It Works?
        </h3>
      </div>
      <div className="w-full flex flex-row justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <IoIosCreate className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              Step 1: Create an Path
            </h2>
            <p className="text-black dark:text-white">
              Firstly, enter your endpoint and encryption key to create a new
              path. then you must select the api type you use to determine the
              request type. after this step, you can optionally select detailed
              information such as pricing (this data will be presented to you as
              statistics).
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row-reverse justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <BsShieldLockFill className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              Step 2: Encrypt Your Data
            </h2>
            <p className="text-black dark:text-white">
              To use the path you have created, use the url given to you, then
              you must create your api request in the specified form, you must
              send the api request by encrypting your prompt with your security
              key. The encrypted data will be decoded on our servers and the
              response will come to you encrypted with the same security key.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <IoStatsChartSharp className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              Step 3: Monitor Statistics
            </h2>
            <p className="text-black dark:text-white">
              You can access all the different apis you have used through the
              interface. you can access data such as pricing and number of
              requests and examine the usage of your apis in detail.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row-reverse justify-start items-center px-8 ">
        <div className="h-[200px] w-3/5 flex flex-row justify-evenly items-center px-8 my-10 shadow-lg rounded-xl bg-lightGreen dark:bg-gray-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          <BiSolidMessageError className="text-[256px] text-green-900 dark:text-gray-400" />
          <div className="flex flex-col justify-start items-start gap-4 p-5">
            <h2 className="text-black dark:text-white text-4xl font-bold">
              Step 4: Error Management
            </h2>
            <p className="text-black dark:text-white">
              Every error you encounter in your api requests is logged, so you
              can check your apis from a single interface and look for problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logic;
