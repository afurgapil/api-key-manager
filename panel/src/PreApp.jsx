import { Routes, Route } from "react-router-dom";
//layouts
import Footer from "./components/Footer";
import Header from "./components/Header";
//pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
function PreApp() {
  // const privateRoutes = [];
  const publicRoutes = [
    { path: "/signup", element: SignUp },
    { path: "/signin", element: SignIn },
    { path: "/signin", element: SignIn },
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
              {/* {privateRoutes.map((route) => (
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
              {protectedRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <route.element />
                    </ProtectedRoute>
                  }
                />
              ))} */}
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
