import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/home/index.css";
import Careerly from "@pages/popup/careerly/careerly";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import '@assets/font/Jakarta/PlusJakartaSans-Regular.ttf'

refreshOnUpdate("pages/popup/careerly");

function init() {
  const appContainer = document.querySelector("#careerly-container");
  if (!appContainer) {
    throw new Error("Can not find #careerly-container");
  }

  const root = createRoot(appContainer);
  root.render(<Careerly imageURL=""/>);
}

init();
