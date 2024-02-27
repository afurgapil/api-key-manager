import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useLimit = () => {
  const { limit } = useContext(UserContext);
  return limit;
};
