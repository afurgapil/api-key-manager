import { Link } from "react-router-dom";
import logoGrey from "../assets/logo-grey.svg";

function Footer() {
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
              Api Manager
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white dark:text-gray-400 sm:mb-0 ">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
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
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
