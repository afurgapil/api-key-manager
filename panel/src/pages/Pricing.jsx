import { useState } from "react";
import PriceCard from "../components/PriceCard";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function Pricing() {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsAnnual(event.target.checked);
  };
  return (
    <div className="min-h-screen w-full py-8 flex flex-col justify-start items-center bg-neutral-200 dark:bg-slate-300">
      <Helmet>
        <title> {t("helmet.pricing.title")}</title>
        <meta name="description" lang="en" content="A page for error logs" />
      </Helmet>
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-slate-900">
          {t("pagesPricing.pageTitle")}
        </h2>
        <p className="mt-1 text-gray-600 dark:text-slate-700">
          {t("pagesPricing.pageSubtitle")}
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex justify-center items-center">
          <label htmlFor="toggle-count-switch" className="inline-block p-2">
            <span className="inline-block text-sm text-gray-800 cursor-pointer  dark:text-slate-700">
              {t("pagesPricing.monthly")}
            </span>
          </label>
          <input
            id="toggle-count-switch"
            name="toggle-count-switch"
            type="checkbox"
            value={isAnnual}
            onChange={handleCheckboxChange}
            className="relative w-[3.25rem] h-7 bg-gray-300 dark:bg-neutral-700 checked:bg-green-600 dark:checked:bg-slate-900 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent focus:border-green-600 dark:focus:border-black focus:ring-green-600 dark:focus:ring-black ring-offset-white dark:focus:ring-offset-gray-800 focus:outline-none appearance-none before:inline-block before:w-6 before:h-6 before:bg-white dark:before:bg-neutral-300 checked:before:bg-green-200 dark:checked:before:bg-slate-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200"
          ></input>
          <label htmlFor="toggle-count-switch" className="inline-block p-2">
            <span className="inline-block text-sm text-gray-800 cursor-pointer  dark:text-slate-700">
              {t("pagesPricing.annual")}
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-y-6 md md:gap-x-6 justify-center items-center w-full ">
        <PriceCard
          title={t("pagesPricing.bronze.title")}
          price={
            isAnnual
              ? t("pagesPricing.bronze.priceAnnual")
              : t("pagesPricing.bronze.priceMonthly")
          }
          description={t("pagesPricing.bronze.priceDesc")}
          features={[
            `${t("pagesPricing.bronze.list1")}`,
            `${t("pagesPricing.bronze.list2")}`,
            `${t("pagesPricing.bronze.list3")}`,
          ]}
          buttonText={t("pagesPricing.updateBtn")}
        />

        <PriceCard
          title={t("pagesPricing.gold.title")}
          price={
            isAnnual
              ? t("pagesPricing.gold.priceAnnual")
              : t("pagesPricing.gold.priceMonthly")
          }
          description={t("pagesPricing.gold.priceDesc")}
          features={[
            `${t("pagesPricing.gold.list1")}`,
            `${t("pagesPricing.gold.list2")}`,
            `${t("pagesPricing.gold.list3")}`,
          ]}
          buttonText={t("pagesPricing.updateBtn")}
        />
        <PriceCard
          title={t("pagesPricing.diamond.title")}
          price={
            isAnnual
              ? t("pagesPricing.diamond.priceAnnual")
              : t("pagesPricing.diamond.priceMonthly")
          }
          description={t("pagesPricing.diamond.priceDesc")}
          features={[
            `${t("pagesPricing.diamond.list1")}`,
            `${t("pagesPricing.diamond.list2")}`,
            `${t("pagesPricing.diamond.list3")}`,
          ]}
          buttonText={t("pagesPricing.updateBtn")}
        />
      </div>
    </div>
  );
}

export default Pricing;
