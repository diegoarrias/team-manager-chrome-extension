import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SignUp from "./signup";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import '@assets/font/Jakarta/PlusJakartaSans-Regular.ttf'

refreshOnUpdate("pages/popup/signup");

function init() {
  const appContainer = document.querySelector("#signup-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(<SignUp />);
}

init();
