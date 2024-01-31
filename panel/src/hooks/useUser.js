import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
  const { user } = useContext(UserContext);
  return user;
};
