import * as React from "react";
import { NavBar } from "./components/NavBar";
import { AppProvider } from "./providers/AppProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes } from "./components/Routes";
import { AnimatePresence } from "framer-motion";

export const App = () => {
  return (
    <AppProvider>
      <>
        <NavBar />
        <Router>
          <AnimatePresence>
            <Routes />
          </AnimatePresence>
        </Router>
      </>
    </AppProvider>
  );
};
