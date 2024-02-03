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
    <section className="bg-bg4l dark:bg-bg4d bg-scroll bg-center bg-no-repeat min-h-screen">
      <div className="flex flex-col items-center justify-start px-6 py-20 mx-auto md:h-screen ">
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
                className={`w-full text-white bg-green-800 hover:bg-green-900  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700  transition-all ease-in-out duration-200`}
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
  );
}

export default ResetRequest;
