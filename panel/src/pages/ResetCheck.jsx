import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function ResetCheck() {
  const { t } = useTranslation();
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
    <section className="bg-bg5l dark:bg-bg5d bg-scroll bg-center bg-no-repeat min-h-screen">
      <Helmet>
        <title> {t("helmet.resetCheck.title")}</title>
        <meta name="description" lang="en" content="A page for reset check" />
      </Helmet>
      <div className="flex flex-col items-center justify-start  px-6 py-10 mx-auto md:h-screen ">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("pagesResetCheck.confirmAccountTitle")}
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
                  {t("pagesResetCheck.verificationCodeLabel")}
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
                  {t("pagesResetCheck.passwordLabel")}
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
                  {t("pagesResetCheck.passwordRequirementText")}
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
                  {t("pagesResetCheck.confirmPasswordLabel")}
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
                className={`w-full text-white bg-green-800 hover:bg-green-900  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 transition-all ease-in-out duration-200 ${Object.values(
                  error
                ).some((errMsg) => errMsg !== "")}`}
                disabled={Object.values(error).some((errMsg) => errMsg !== "")}
              >
                {t("pagesResetCheck.submitButton")}
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

export default ResetCheck;
