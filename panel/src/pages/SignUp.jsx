import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import isValidMail from "../utils/isValidMail";

import { UserContext } from "../context/UserContext";
function SignUp() {
  const { signup } = useContext(UserContext);
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
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Flowbite
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
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
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="gafurapil"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={(e) => {
                      checkData(e);
                    }}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 p-1">
                    *** Usernames must be between 4 and 32 characters.
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
                      I accept the{" "}
                      <a
                        href="#"
                        className={`font-medium ${
                          error.terms
                            ? "text-red-500"
                            : "text-primary-600 dark:text-primary-500"
                        }  hover:underline `}
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ${
                    Object.values(error).some((errMsg) => errMsg !== "") ||
                    termsConfirm
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    Object.values(error).some((errMsg) => errMsg !== "") ||
                    !termsConfirm
                  }
                >
                  Create an account
                </button>
                {errorResponse.bool && (
                  <div className="bg-red-100 text-red-800 text-mg text-center font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                    {errorResponse.message}
                  </div>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
