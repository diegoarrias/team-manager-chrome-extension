import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/home/index.css";
import Home from "@pages/popup/home/home";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import '@assets/font/Jakarta/PlusJakartaSans-Regular.ttf'

refreshOnUpdate("pages/popup/home");

function init() {
  const appContainer = document.querySelector("#home-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(<Home />);
}

init();
