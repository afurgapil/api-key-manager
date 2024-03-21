import Category from "../components/FaqCategory";
import { faqData } from "../constant/faqData";
import QMark from "../assets/qmark.png";
const Faq = () => {
  return (
    <div className="min-h-screen w-full py-8 px-8  bg-neutral-200 dark:bg-slate-300">
      <div className="flex flex-row justify-evenly items-start">
        <div className="w-1/3 flex justify-center items-center">
          <div className="flex flex-col justify-center items-start gap-y-4">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-gray-800">
              Frequently
              <br />
              asked questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-600">
              Answers to the most frequently asked questions.
            </p>
            <img src={QMark} alt="Question Mark" />
          </div>
        </div>
        <div className="w-2/3 flex justify-center items-center">
          <div className="w-full mx-auto ">
            <h2 className="text-3xl font-semibold mb-5"></h2>
            {faqData.map((section, index) => (
              <Category
                key={index}
                category={section.category}
                faqs={section.faqs}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Faq;
