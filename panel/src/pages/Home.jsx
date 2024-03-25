import { Link } from "react-router-dom";
import logoWhite from "../assets/logo-white.svg";
import { useTranslation } from "react-i18next";
function Home() {
  const { t } = useTranslation();
  return (
    <main className="bg-encryption bg-scroll bg-center bg-no-repeat bg-cover flex flex-col min-h-screen justify-center items-center">
      <div className="w-full min-h-screen flex flex-col justify-start items-center p-8 bg-gray-300 bg-opacity-35">
        <div className="flex flex-col justify-start items-center mb-8">
          <img src={logoWhite} alt="Logo White" />
          <h1 className="text-gray-100 dark:text-gray-100 text-5xl font-bold font-sourceSansPro leading-10 text-center">
            {t("pagesHome.welcomeTitle")}
          </h1>
          <p className="text-gray-200 dark:text-gray-200 text-sm font-bold leading-10 text-center">
            {t("pagesHome.welcomeSubtitle")}
          </p>
        </div>
        <div className="flex flex-col justify-start items-center gap-y-4">
          <Link
            to="/"
            className="flex justify-center items-center cursor-pointer w-96 h-12 rounded-full  bg-green-950 dark:bg-gray-800 border-green-800 border-2 text-white text-base font-semibold leading-6 focus:outline-none"
          >
            {t("pagesHome.getStarted")}
          </Link>
          <Link
            to="/signin"
            className="flex justify-center items-center cursor-pointer w-96 h-12 rounded-full bg-green-950 dark:bg-gray-800 border-green-800 border-2 text-white text-base font-semibold leading-6 focus:outline-none"
          >
            {t("pagesHome.signIn")}
          </Link>
        </div>
        <p className="text-gray-200 dark:text-gray-200 text-base font-source-sans-pro leading-5 text-center mt-4">
          {t("pagesHome.termsAndConditions")}
        </p>
      </div>
    </main>
  );
}

export default Home;
