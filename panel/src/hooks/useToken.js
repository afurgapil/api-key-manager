import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useToken = () => {
  const { token } = useContext(UserContext);
  return token;
};
