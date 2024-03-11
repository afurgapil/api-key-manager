import { useState } from "react";
import { USER_API } from "../urls";
import isValidMail from "../utils/isValidMail";
import { SiDialogflow } from "react-icons/si";
import { AiOutlineCode } from "react-icons/ai";
import { GoMail } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleError = (message) => {
    setError(message);
  };

  const handleClear = () => {
    setError("");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidMail(formData.email)) {
      try {
        const response = await fetch(USER_API.SEND_MAIL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Request failed");
        }

        const data = await response.json();
        if (data.message == "User message saved successfully.") {
          setFormData({
            name: "",
            lastname: "",
            email: "",
            message: "",
          });
        }
      } catch (error) {
        // Handle errors (e.g., show error message, update UI)
        console.error("Error sending mail: ", error.message);
      }
    } else {
      setError("Please enter a valid mail.");
    }
  };
  const checkData = (email) => {
    if (!isValidMail(email)) {
      handleError("Invalid E-Mail address!");
    } else {
      handleClear();
    }
  };
  return (
    <div className="min-h-screen w-full py-8 px-8 flex flex-row justify-evenly items-start bg-neutral-50 dark:bg-slate-300">
      <div className="bg-neutral-50 dark:bg-gray-800 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto rounded-xl">
        <div className="max-w-2xl lg:max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
              Contact us
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              We love to talk about how we can help you.
            </p>
          </div>
          <div className="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
            <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-gray-700">
              <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-gray-200">
                Fill in the form
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="sr-only">First Name</label>
                      <input
                        type="text"
                        name="name"
                        onChange={handleChange}
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        placeholder="First Name"
                      ></input>
                    </div>

                    <div>
                      <label className="sr-only">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        onChange={handleChange}
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        placeholder="Last Name"
                      ></input>
                    </div>
                  </div>

                  <div>
                    <label className="sr-only">Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={() => {
                        checkData(formData.email);
                      }}
                      autoComplete="email"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                      placeholder="Email"
                    ></input>
                    {error && (
                      <div className="text-xs text-red-500 dark:text-red-400 mx-2 my-1">
                        {error}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="sr-only">Details</label>
                    <textarea
                      onChange={handleChange}
                      name="message"
                      rows="4"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                      placeholder="Details"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 grid">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Send inquiry
                  </button>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    We get back to you in 1-2 business days.
                  </p>
                </div>
              </form>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="flex gap-x-7 py-6">
                <SiDialogflow className="text-black dark:text-white text-xl" />
                <div className="grow">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    FAQ
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Search our FAQ for answers to anything you might ask.
                  </p>
                  <Link
                    className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    to="/faq"
                  >
                    Visit FAQ
                    <IoIosArrowRoundForward className="text-lg" />
                  </Link>
                </div>
              </div>
              <div className=" flex gap-x-7 py-6">
                <AiOutlineCode className="text-black dark:text-white text-xl" />
                <div className="grow">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Explore
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check out our work logic .
                  </p>
                  <Link
                    className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    to="/how-it-works"
                  >
                    Contact sales
                    <IoIosArrowRoundForward className="text-lg" />
                  </Link>
                </div>
              </div>

              <div className=" flex gap-x-7 py-6">
                <GoMail className="text-black dark:text-white text-xl" />
                <div className="grow">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Contact us by email
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    If you wish to write us an email instead please use
                  </p>
                  <a
                    className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                    href="mailto:someone@example.com"
                  >
                    example@site.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
