/* eslint-disable react/prop-types */
import { CiClock1 } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { IoDocumentTextOutline } from "react-icons/io5";

const ErrorLogs = ({ logs }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-lightGreen dark:bg-lightGray rounded-2xl px-2 py-4">
      <div
        id="error-logs"
        className="flex flex-col justify-center items-center gap-y-4 min-w-full"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col justify-start items-start  rounded-2xl px-2 py-4 border-b border-black rounded-b-none w-full"
          >
            <div className="flex flex-row justify-between items-center gap-x-1">
              <h4 id="title">
                {log.company} / {log.type}
              </h4>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <IoDocumentTextOutline />
              <p id="message" className="">
                {log.error_msg.slice(0, 15)}...
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <CiClock1 />
              <p id="date">{log.timestamp.slice(11, 16)}</p>
            </div>
            <div className="flex flex-row items-center gap-x-1">
              <SlCalender />
              <p id="date">{log.timestamp.slice(0, 10)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLogs;
