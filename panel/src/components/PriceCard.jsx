/* eslint-disable react/prop-types */
import { FaCheck } from "react-icons/fa";

const PriceCard = ({ title, price, description, features, buttonText }) => {
  return (
    <div className="flex flex-col border border-gray-500 text-center rounded-xl p-8 dark:border-neutral-800  w-9/12 md:w-3/12  min-h-[400px] shadow-2xl shadow-black">
      <h4 className="font-medium text-lg text-gray-800 dark:text-slate-700">
        {title}
      </h4>
      <span className="mt-7 font-bold text-5xl text-gray-800 dark:text-slate-700">
        {price}
      </span>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-700">
        {description}
      </p>
      <ul className="mt-7 space-y-2.5 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex space-x-2">
            <FaCheck />
            <span className="text-gray-800 dark:text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        className="mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-500 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-gray-700  dark:hover:border-gray-900 dark:hover:bg-gray-900 dark:hover:text-neutral-200"
        href="#"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default PriceCard;
