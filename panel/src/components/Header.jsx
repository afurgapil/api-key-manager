import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import SignOut from "./SignOut";
import { FaBars, FaArrowUp } from "react-icons/fa";
import logoWhite from "../assets/logo-white.svg";
import { useTranslation } from "react-i18next";
function Header() {
  const { t } = useTranslation();
  const user = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return (
    <header>
      <nav className="bg-green-900 dark:bg-gray-800 border-white px-4 lg:px-6 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img
              src={logoWhite}
              color="white "
              className="mr-3 h-6 sm:h-9 text-white"
              alt="Api Manager"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white ">
              {t("componentsHeader.apilman")}
            </span>
          </Link>
          {user && Object.keys(user).length > 0 ? (
            <div className="flex items-center lg:order-2">
              <NavLink
                to="/profile"
                className="text-white dark:text-white hover:bg-gray-50 hover:text-green-700  font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
              >
                {user.username.toUpperCase()}
              </NavLink>
              <SignOut></SignOut>
              <div className="flex items-center lg:order-2">
                <button
                  onClick={() => {
                    toggleMobileMenu();
                  }}
                  type="button"
                  className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 "
                  aria-controls="mobile-menu-2"
                  aria-expanded={mobileMenuOpen ? "true" : "false"}
                >
                  <span className="sr-only">
                    {t("componentsHeader.toggleMobileMenu")}
                  </span>
                  {mobileMenuOpen ? (
                    <FaArrowUp className=" w-6 h-6 " />
                  ) : (
                    <FaBars className=" w-6 h-6 " />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center lg:order-2">
              <NavLink
                to="/signin"
                className="text-white dark:text-white hover:bg-gray-50 hover:text-green-800 ease-in-out transition-all duration-200 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
              >
                {t("componentsHeader.signIn")}
              </NavLink>
              <NavLink
                to="/signup"
                className="text-white dark:text-white hover:bg-gray-50 hover:text-green-800 ease-in-out transition-all dura font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700"
              >
                {t("componentsHeader.signUp")}
              </NavLink>

              <div className="flex items-center lg:order-2">
                <button
                  onClick={() => {
                    toggleMobileMenu();
                  }}
                  type="button"
                  className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 "
                  aria-controls="mobile-menu-2"
                  aria-expanded={mobileMenuOpen ? "true" : "false"}
                >
                  <span className="sr-only">
                    {t("componentsHeader.toggleMobileMenu")}
                  </span>
                  {mobileMenuOpen ? (
                    <FaArrowUp className=" w-6 h-6 " />
                  ) : (
                    <FaBars className=" w-6 h-6 " />
                  )}
                </button>
              </div>
            </div>
          )}
          <div
            className={`justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ${
              mobileMenuOpen ? "block" : "hidden"
            }`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 ">
              {/* <li>
                <NavLink
                  to="/"
                  exact
                  className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 active:dark:text-white rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800 lg:hover:bg-transparent     dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                >
                  Home
                </NavLink>
              </li> */}
              {user && Object.keys(user).length > 0 ? (
                <>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/dashboard"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-200 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.dashboard")}
                    </NavLink>
                  </li>{" "}
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/apis"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.apis")}
                    </NavLink>
                  </li>{" "}
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/error-logs"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.logs")}
                    </NavLink>
                  </li>
                  {/* <li
                  onClick={()=>toggleMobileMenu()}
                  >
                    <NavLink
                      to="/community"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.community")}
                    </NavLink>
                  </li> */}
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/pricing"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.pricing")}
                    </NavLink>
                  </li>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/contact"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.contact")}
                    </NavLink>
                  </li>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/how-it-works"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.explore")}
                    </NavLink>
                  </li>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/faq"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.faq")}
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  {/* <li
                  onClick={()=>toggleMobileMenu()}
                  >
                    <NavLink
                      to="/community"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.community")}
                    </NavLink>
                  </li> */}
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/how-it-works"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.explore")}
                    </NavLink>
                  </li>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/faq"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.faq")}
                    </NavLink>
                  </li>
                  <li onClick={() => toggleMobileMenu()}>
                    <NavLink
                      to="/contact"
                      className="block py-2 pr-4 pl-3 text-white dark:text-gray-400 rounded-none border-b md:border-0 md:rounded-md border-gray-100 hover:bg-gray-50 hover:text-green-800      dark:hover:bg-gray-700 dark:hover:text-white  dark:border-gray-700"
                    >
                      {t("componentsHeader.contact")}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
