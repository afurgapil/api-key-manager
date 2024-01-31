import { createContext, useState, useEffect } from "react";
import { USER_API } from "../urls";

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser !== null && storedUser !== undefined) {
      setUser(JSON.parse(storedUser));
    }

    if (storedToken !== null && storedToken !== undefined) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  const signup = async (username, email, password) => {
    try {
      const response = await fetch(USER_API.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, mail: email, password }),
      });

      if (response.ok) {
        console.log("User created succesfully.");
        const data = await response.json();
        console.log(data);
      } else {
        const errorData = await response.json();
        throw new Error(JSON.stringify({ error: errorData.error }));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const signin = async (username, password, isChecked) => {
    try {
      const response = await fetch(USER_API.SIGNIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);
        if (isChecked) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", JSON.stringify(data.token));
        }
      } else {
        const errorData = await response.json();
        throw new Error(JSON.stringify({ error: errorData.error }));
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        signup,
        signin,
        signout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
