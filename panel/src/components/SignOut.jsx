import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function SignOut() {
  const navigate = useNavigate();
  const { signout } = useContext(UserContext);

  const handleSignout = () => {
    signout();
    navigate("/signin");
  };

  return (
    <div>
      <button
        type="button"
        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        onClick={handleSignout}
      >
        <FaSignOutAlt />
      </button>
    </div>
  );
}

export default SignOut;
