import { useEffect, useState } from "react";
import Category from "../components/FaqCategory";
import { faqDataEn, faqDataTr, faqDataDe } from "../constant/faqData";
import QMark from "../assets/qmark.png";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
const Faq = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [currentFaq, setCurrentFaq] = useState([]);

  useEffect(() => {
    const loadFaqData = async () => {
      try {
        const language = i18n.language;
        switch (language) {
          case "en":
            setCurrentFaq(faqDataEn);
            break;
          case "tr":
            setCurrentFaq(faqDataTr);
            break;
          case "de":
            setCurrentFaq(faqDataDe);
            break;
          default:
            setCurrentFaq(faqDataEn);
            break;
        }
      } catch (error) {
        console.error("An error occured:", error);
      }
    };

    loadFaqData();

    const handleLanguageChange = () => {
      loadFaqData();
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);
  return (
    <div className="min-h-screen w-full py-8 px-8  bg-neutral-200 dark:bg-slate-300">
      <Helmet>
        <title> {t("helmet.faq.title")}</title>
        <meta name="description" lang="en" content="A page for FAQ" />
      </Helmet>
      <div className="flex flex-row justify-evenly items-start">
        <div className="w-1/3 flex justify-center items-center">
          <div className="flex flex-col justify-center items-start gap-y-4">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-gray-800">
              {t("pagesFaq.title")}
              <br />

              {t("pagesFaq.subtitle")}
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-gray-600">
              {t("pagesFaq.motto")}
            </p>
            <img src={QMark} alt="Question Mark" />
          </div>
        </div>
        <div className="w-2/3 flex justify-center items-center">
          <div className="w-full mx-auto ">
            <h2 className="text-3xl font-semibold mb-5"></h2>
            {currentFaq.map((section, index) => (
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
