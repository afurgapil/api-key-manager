import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import App from "./App.jsx";
import "./index.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "./locales/en.json";
import trLang from "./locales/tr.json";
import deLang from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLang,
    },
    de: {
      translation: deLang,
    },
    tr: {
      translation: trLang,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

//todo helmet kur
//todo alertify falan kur
