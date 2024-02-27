import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useTier = () => {
  const { tier } = useContext(UserContext);
  return tier;
};
