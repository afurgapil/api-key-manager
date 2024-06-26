import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import logoGreen from "../assets/logo-green.svg";
import logoGrey from "../assets/logo-grey.svg";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function SignIn() {
  const { t } = useTranslation();
  const { signin, theme } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const [errorResponse, setErrorResponse] = useState({
    bool: false,
    message: "",
  });
  const navigate = useNavigate();
  const handleError = (event, message) => {
    setError((prevError) => ({
      ...prevError,
      [event]: message,
    }));
  };

  const checkData = (event) => {
    const fieldName = event.target.name;
    switch (fieldName) {
      case "username":
        if (username.length < 4 || username.length > 32) {
          handleError("username", t("pagesSignIn.validUsername"));
        } else {
          handleError("username", "");
        }
        break;
      case "password":
        if (password.length < 8) {
          handleError("password", t("pagesSignIn.validPassword"));
        } else {
          handleError("password", "");
        }
        break;
      default:
        break;
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      if (username.length >= 4 && username.length <= 32) {
        if (password.length >= 8) {
          await signin(username, password, rememberMe);
          navigate("/dashboard");
        } else {
          handleError("password", t("pagesSignIn.minimumPassword"));
        }
      } else {
        handleError("username", t("pagesSignIn.minimumUsername"));
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
    <section className="bg-bg1l dark:bg-bg1d bg-scroll bg-center bg-no-repeat min-h-screen">
      <Helmet>
        <title> {t("helmet.signIn.title")}</title>
        <meta name="description" lang="en" content="A page for signin" />
      </Helmet>
      <div className="flex flex-col items-center justify-start px-6 py-8  mx-auto md:h-screen ">
        <Link to="/" className="flex items-center mb-6">
          {theme === "dark" ? (
            <img
              className="mr-2"
              src={logoGreen}
              alt="logo"
              width={100}
              height={100}
            />
          ) : (
            <img
              className="mr-2"
              src={logoGrey}
              alt="logo"
              width={100}
              height={100}
            />
          )}
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("pagesSignIn.signInTitle")}
            </h1>
            <form
              onSubmit={handleSignIn}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("pagesSignIn.usernameLabel")}
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="gafurapil"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={(e) => {
                    checkData(e);
                  }}
                />
                {error.username && (
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {error.username}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("pagesSignIn.passwordLabel")}
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
                {error.password && (
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {error.password}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      {t("pagesSignIn.rememberMeLabel")}
                    </label>
                  </div>
                </div>
                <Link
                  to="/reset-request"
                  className="text-gray-400 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("pagesSignIn.forgotPasswordLink")}
                </Link>
              </div>
              <button
                type="submit"
                className={`cursor-pointer w-full text-white bg-green-800 hover:bg-green-900  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${Object.values(
                  error
                ).some((errMsg) => errMsg !== "")}`}
                disabled={Object.values(error).some((errMsg) => errMsg !== "")}
              >
                {t("pagesSignIn.signInButton")}
              </button>
              {errorResponse.bool && (
                <div className="bg-red-100 text-red-800 text-mg text-center font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                  {errorResponse.message}
                </div>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t("pagesSignIn.noAccountMessage")}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("pagesSignIn.signUpLink")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
