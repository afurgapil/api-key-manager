/* eslint-disable react/prop-types */
import CodeArea from "../components/CodeArea";
import { GEMINI, OPENAI } from "../constant/examples";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
const AccordionCode = ({ type }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const getCodeByType = (type) => {
    switch (type) {
      case "gemini-pro":
        return GEMINI;
      case "chatgpt":
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
        <span className="text-xl font-bold text-white">
          {t("componentsCode.title")}
        </span>
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
