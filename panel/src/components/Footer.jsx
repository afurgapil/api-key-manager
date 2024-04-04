import { Link } from "react-router-dom";
import logoGrey from "../assets/logo-grey.svg";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function Footer() {
  const { t, i18n } = useTranslation();
  const { toggleTheme, theme } = useContext(UserContext);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  return (
    <footer className="bg-green-900 dark:bg-gray-900  shadow ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to=""
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img src={logoGrey} className="h-8" alt="Apilman Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white">
              {t("componentsFooter.apilman")}
            </span>
          </Link>
          <ul className="flex flex-wrap justify-center gap-x-4 items-center mb-6 text-sm font-medium text-white dark:text-gray-400 sm:mb-0 ">
            <li>
              <a href="#" className="hover:underline">
                {t("componentsFooter.about")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("componentsFooter.privacyPolicy")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("componentsFooter.licensing")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("componentsFooter.contact")}
              </a>
            </li>
            <li>
              <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="bg-transparent text-4xl"
              >
                <option value="en">🇬🇧</option>
                <option value="de">🇩🇪</option>
                <option value="tr">🇹🇷</option>
              </select>
              <button
                onClick={toggleTheme}
                id="toggle "
                className="dark:text-yellow-600 text-white text-2xl hover:bg-gray-50 hover:text-green-800 ease-in-out transition-all dura font-medium rounded-lg  px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-white sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a
            href="https://github.com/afurgapil"
            target="_blank"
            className="hover:underline"
            rel="noreferrer"
          >
            Gapil™
          </a>
          {t("componentsFooter.rightsReserved")}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
