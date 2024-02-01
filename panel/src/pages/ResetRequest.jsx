import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import isValidMail from "../utils/isValidMail";
function ResetRequest() {
  const { reset_request } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    isValidMail: true,
    errorResponse: "",
  });
  const [errorResponse, setErrorResponse] = useState({
    bool: false,
    message: "",
  });
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      if (isValidMail(email)) {
        await reset_request(email);
        navigate("/reset-check");
      } else {
        setError({
          isValidMail: false,
          errorResponse: "Please enter a valid mail.",
        });
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message).error;
      setErrorResponse({
        bool: true,
        message: errorMessage,
      });
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-start px-6 py-20 mx-auto md:h-screen ">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            APILMAN
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Reset your password
              </h1>
              <form
                onSubmit={handleRequest}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (!isValidMail(email)) {
                        setError({
                          isValidMail: false,
                          errorResponse: "Please enter a valid mail.",
                        });
                      } else {
                        setError({
                          isValidMail: true,
                          errorResponse: " ",
                        });
                      }
                    }}
                  />
                  {!error.isValidMail && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      {error.errorResponse}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 `}
                >
                  Reset Password
                </button>
                {errorResponse.bool && (
                  <div className="bg-red-100 text-red-800 text-mg text-center font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                    {errorResponse.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetRequest;
