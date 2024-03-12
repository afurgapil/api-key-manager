/* eslint-disable react/prop-types */
import AccordionItem from "./AccordionItem";
const Category = ({ category, faqs }) => {
  return (
    <div className="mb-4">
      <h3 className="text-2xl font-bold py-2">{category}</h3>
      <div className="bg-white dark:bg-[#1f2937] shadow-md rounded-lg">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
};
export default Category;
