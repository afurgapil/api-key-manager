import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
function ResetCheck() {
  const { reset_check } = useContext(UserContext);
  const { mail } = useParams();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState({
    bool: false,
    message: "",
  });
  const [error, setError] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleError = (event, message) => {
    setError((prevError) => ({
      ...prevError,
      [event]: message,
    }));
  };

  const handleClear = (event) => {
    setError((prevError) => ({
      ...prevError,
      [event]: "",
    }));
  };
  const checkData = (event) => {
    const fieldName = event.target.name;
    switch (fieldName) {
      case "code":
        if (code.length !== 6) {
          handleError("code", "Codes must be 6  characters!");
        } else {
          handleClear("code");
        }
        break;
      case "password":
        if (password.length < 8) {
          handleError("password", "Passwords must be minimum 8 characters!");
        } else {
          handleClear("password");
        }
        break;
      case "confirm-password":
        if (!(password === confirmPassword)) {
          handleError("confirmPassword", "Passwords don't match!");
        } else {
          handleClear("confirmPassword");
        }
        break;
      default:
        break;
    }
  };
  const handleCheck = async (e) => {
    e.preventDefault();
    try {
      await reset_check(mail, code, password);
      navigate("/signin");
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
        <div className="flex flex-col items-center justify-start  px-6 py-10 mx-auto md:h-screen ">
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
                Confirm Your Account
              </h1>
              <form
                onSubmit={handleCheck}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="code"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="123456"
                    maxLength="6"
                    required
                    onChange={(e) => setCode(e.target.value)}
                    onBlur={(e) => {
                      checkData(e);
                    }}
                  />
                  {error.code && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      {error.code}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => {
                      checkData(e);
                    }}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 m-0 p-1">
                    *** Passwords must be minimum 8 characters.
                  </div>
                  {error.password && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      {error.password}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={(e) => {
                      checkData(e);
                    }}
                  />
                  {error.confirmPassword && (
                    <div className="text-xs text-red-500 dark:text-red-400">
                      {error.confirmPassword}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${Object.values(
                    error
                  ).some((errMsg) => errMsg !== "")}`}
                  disabled={Object.values(error).some(
                    (errMsg) => errMsg !== ""
                  )}
                >
                  Submit
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

export default ResetCheck;
