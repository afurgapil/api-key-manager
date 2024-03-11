import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
//layouts
import Footer from "./components/Footer";
import Header from "./components/Header";
//pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ResetCheck from "./pages/ResetCheck";
import ResetRequest from "./pages/ResetRequest";
//private
import Dashboard from "./pages/Dashboard";
import Apis from "./pages/Apis";
import ErrorLogs from "./pages/ErrorLogs";
import Contact from "./pages/Contact";
function PreApp() {
  const privateRoutes = [
    { path: "/dashboard", element: Dashboard },
    { path: "/apis", element: Apis },
    { path: "/error-logs", element: ErrorLogs },
  ];
  const publicRoutes = [
    { path: "/", element: Home },
    { path: "/signin", element: SignIn },
    { path: "/signup", element: SignUp },
    { path: "/contact", element: Contact },
    { path: "/reset-check/:mail", element: ResetCheck },
    { path: "/reset-request", element: ResetRequest },
  ];
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <PrivateRoute>
                      <route.element />
                    </PrivateRoute>
                  }
                />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </>
        }
      />
    </Routes>
  );
}

export default PreApp;
