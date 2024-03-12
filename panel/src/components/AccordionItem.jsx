/* eslint-disable react/prop-types */
import { useState } from "react";
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="py-4 px-6 flex justify-between items-center w-full text-left  "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold dark:text-slate-300 text-xl">
          {question}
        </span>
        <span className="dark:text-slate-300 text-2xl">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && <div className="py-2 px-6 dark:text-slate-400">{answer}</div>}
    </>
  );
};
export default AccordionItem;
