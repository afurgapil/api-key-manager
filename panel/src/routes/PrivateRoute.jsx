import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="bg-bd1l dark:bg-bd1d">Loading...</div>;
  }

  if (Object.keys(user).length > 0) {
    return children;
  } else {
    return <Navigate to="/signin" />;
  }
}

export default PrivateRoute;
