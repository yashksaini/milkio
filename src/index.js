import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

window.dbVersion = "1";
window.dbNewName = "milkio";

function setUpDatabase() {
  const dbVersion = window.dbVersion;
  const dbName = window.dbNewName;
  const request = indexedDB.open(dbName, dbVersion);
  //On Upgrade Needed
  request.onupgradeneeded = (e) => {
    const tempdb = e.target.result;

    // Create collection to store the morning and evening milk data for specific date
    const milkStore = tempdb.createObjectStore("milkstore", {
      keyPath: "id",
      autoIncrement: true,
    });
    milkStore.createIndex("date", "date", { unique: true });

    // Create collection to store the month price and caption for the month.
    const monthStore = tempdb.createObjectStore("months", {
      keyPath: "id",
      autoIncrement: true,
    });
    monthStore.createIndex("date", "date", { unique: true });
  };
  //On Success (Every time called if any success)
  request.onsuccess = (e) => {
    const tempdb = e.target.result;
    window.data_base = tempdb;
  };
  //On Error
  request.onerror = (e) => {
    console.log(`error: ${e.target.error} was found `);
  };
}
setUpDatabase();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

serviceWorkerRegistration.register();
