import React, { useState } from "react";
import { Router } from "react-chrome-extension-router";
import { createRoot } from "react-dom/client";
import Popup from "@pages/popup/Popup";
import Home from "./home/home";
import "@pages/popup/index.css";

import refreshOnUpdate from "virtual:reload-on-update-in-view";
import "@assets/font/Jakarta/PlusJakartaSans-Regular.ttf";

refreshOnUpdate("pages/popup");
let constant:any;

const getAuth = async () => {
  const { careerlyUser } = await chrome.storage.local.get(['careerlyUser']);
  constant = careerlyUser
};

const Login = () => {
  return (
    <Router>
      <Popup />
    </Router>
  );
};

const Main = () => {
  return (
    <Router>
      <Home />
    </Router>
  );
};

async function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  await getAuth()
  console.log('constant', constant)
  const root = createRoot(appContainer);
  root.render(constant ? <Main /> : <Login />);
}

init();
