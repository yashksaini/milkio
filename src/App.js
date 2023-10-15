// import { useEffect } from "react";
import { useEffect, useState } from "react";
import DisplayCalendar from "./components/displayCalendar";
import MonthYear from "./components/monthYear";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      <div className={isLoading ? "loader" : "hide"}>
        <img src="images/logo.png" alt="Logo" />
        <h1 className="heading">Welcome to Milkio</h1>
        <p className="sub-heading">Organize your daily milk expences</p>
        <div className="loaderBox"></div>
      </div>
      <div className={isLoading ? "hide" : "container"}>
        <img src="images/logo.png" alt="Logo" />
        <h1 className="heading">Welcome to Milkio</h1>
        <p className="sub-heading">Organize your daily milk expences</p>
        <MonthYear />
        <DisplayCalendar />
        <p className="sub-heading">Version 12.10.2023.9.00</p>
      </div>
    </>
  );
}

export default App;
