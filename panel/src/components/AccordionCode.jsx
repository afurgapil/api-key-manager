/* eslint-disable react/prop-types */
import CodeArea from "../components/CodeArea";
import { GEMINI, OPENAI } from "../constant/examples";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
const AccordionCode = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const getCodeByType = (type) => {
    switch (type) {
      case "gemini-pro":
        return GEMINI;
      case "gpt-3.5-turbo":
        return OPENAI;
      default:
        return " ";
    }
  };
  return (
    <>
      <button
        className="flex justify-between items-center w-full text-left bg-green-900 dark:bg-gray-900 rounded-t-lg p-1 border-b border-white "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-bold text-white">Example Request:</span>
        <span className="dark:text-slate-300 text-2xl">
          {isOpen ? (
            <IoIosArrowUp className="text-white" />
          ) : (
            <IoIosArrowDown className="text-white" />
          )}
        </span>
      </button>
      {isOpen && <CodeArea code={getCodeByType(type)}></CodeArea>}
    </>
  );
};
export default AccordionCode;
