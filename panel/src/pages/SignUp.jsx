import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import isValidMail from "../utils/isValidMail";
import logoGreen from "../assets/logo-green.svg";
import logoGrey from "../assets/logo-grey.svg";
import { UserContext } from "../context/UserContext";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function SignUp() {
  const { t } = useTranslation();
  const { signup, theme } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errorResponse, setErrorResponse] = useState({
    bool: false,
    message: "",
  });
  const [termsConfirm, setTermsConfirm] = useState(false);
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
      case "email":
        if (!isValidMail(email)) {
          handleError("email", "Invalid E-Mail address!");
        } else {
          handleClear(fieldName);
        }
        break;
      case "username":
        if (username.length < 4) {
          handleError("username", "Usernames must be minimum 4 characters!");
        } else if (username.length > 32) {
          handleError("username", "Usernames must be maximum 32 characters!");
        } else {
          handleError("username", "");
        }
        break;
      case "password":
        if (password.length < 8) {
          handleError("password", "Passwords must be minimum 8 characters!");
        } else {
          handleError("password", "");
        }
        break;
      case "confirm-password":
        if (!(password === confirmPassword)) {
          handleError("confirmPassword", "Passwords don't match!");
        } else {
          handleError("confirmPassword", "");
        }
        break;
      default:
        break;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      if (termsConfirm) {
        if (isValidMail(email)) {
          if (username.length >= 4 && username.length <= 32) {
            if (password.length >= 8) {
              if (password === confirmPassword) {
                await signup(username, email, password);
                navigate("/signin");
              } else {
                handleError("confirmPassword", "Passwords don't match!");
              }
            } else {
              handleError(
                "password",
                "Passwords must be minimum 8 characters!"
              );
            }
          } else {
            handleError(
              "username",
              "Usernames must be between 4 and 32 characters."
            );
          }
        } else {
          handleError("password", "Passwords must be minimum 8 characters!");
        }
      } else {
        console.log("true degil");
        setError((prevError) => ({
          ...prevError,
          terms: true,
        }));
        console.log(error.terms);
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
    <section className="bg-bg2l dark:bg-bg2d bg-scroll bg-center bg-no-repeat min-h-screen">
      <Helmet>
        <title> {t("helmet.signUp.title")}</title>
        <meta name="description" lang="en" content="A page for signup" />
      </Helmet>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen ">
        <Link to="/" className="flex items-center mb-6 ">
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
              {t("pagesSignUp.createAccountTitle")}
            </h1>
            <form
              onSubmit={handleSignUp}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("pagesSignUp.labels.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("pagesSignUp.placeholders.emailPlaceholder")}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => {
                    checkData(e);
                  }}
                />
                {error.email && (
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {error.email}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t("pagesSignUp.labels.usernameLabel")}
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={t(
                    "pagesSignUp.placeholders.usernamePlaceholder"
                  )}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={(e) => {
                    checkData(e);
                  }}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 p-1">
                  {t("pagesSignUp.usernameRequirements")}
                </div>
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
                  {t("pagesSignUp.labels.passwordLabel")}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder={t(
                    "pagesSignUp.placeholders.passwordPlaceholder"
                  )}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  maxLength={16}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => {
                    checkData(e);
                  }}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 m-0 p-1">
                  {t("pagesSignUp.passwordRequirements")}
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
                  {t("pagesSignUp.labels.confirmPasswordLabel")}
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder={t(
                    "pagesSignUp.placeholders.passwordPlaceholder"
                  )}
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
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsConfirm"
                    aria-describedby="termsConfirm"
                    type="checkbox"
                    className={`w-4 h-4  rounded focus:ring-3 focus:ring-primary-300 ${
                      error.terms
                        ? "border-red-500 bg-red-500 dark:bg-red-700 dark:border-red-600 dark:focus:ring-primary-600 dark:ring-offset-red-800 border"
                        : "border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 border"
                    }`}
                    required
                    onChange={(e) => {
                      if (error.terms && e.target.checked) {
                        setError((prevError) => ({
                          ...prevError,
                          terms: false,
                        }));
                      }
                      setTermsConfirm(e.target.checked);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="termsConfirm"
                    className={`font-light ${
                      error.terms
                        ? "text-red-500 dark:text-red-500"
                        : "text-gray-500 dark:text-gray-300"
                    } `}
                  >
                    {t("pagesSignUp.labels.termsLabel")}
                    <a
                      href="#"
                      className={`font-medium ${
                        error.terms
                          ? "text-red-500"
                          : "text-primary-600 dark:text-primary-500"
                      }  hover:underline `}
                    >
                      {t("pagesSignUp.termsLink")}
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full text-white bg-green-800 hover:bg-green-900   font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                  Object.values(error).some((errMsg) => errMsg !== "") ||
                  termsConfirm
                    ? "cursor-not-allowed"
                    : ""
                }`}
                // disabled={
                //   Object.values(error).some((errMsg) => errMsg !== "") ||
                //   !termsConfirm
                // }
              >
                {t("pagesSignUp.submitButton")}
              </button>
              {errorResponse.bool && (
                <div className="bg-red-100 text-red-800 text-mg text-center font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                  {errorResponse.message}
                </div>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {t("pagesSignUp.haveAccountMessage")}
                <Link
                  to="/signin"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t("pagesSignUp.signInLink")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
