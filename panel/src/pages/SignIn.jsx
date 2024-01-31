import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const { signin } = useContext(UserContext);
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
        if (username.length < 1) {
          handleError("username", "Please enter a valid username!");
        } else {
          handleError("username", "");
        }
        break;
      case "password":
        if (password.length < 1) {
          handleError("password", "Please enter a valid password");
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
          navigate("/");
        } else {
          handleError("password", "Passwords must be minimum 8 characters!");
        }
      } else {
        handleError(
          "username",
          "Usernames must be between 4 and 32 characters."
        );
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
                Sign in to your account
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
                    Your username
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
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-gray-300 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
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
                  Sign in
                </button>
                {errorResponse.bool && (
                  <div className="bg-red-100 text-red-800 text-mg text-center font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                    {errorResponse.message}
                  </div>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
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

export default SignIn;
