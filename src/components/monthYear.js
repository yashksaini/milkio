import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTheMonth, changeTheYear } from "../redux/monthyear";
const MonthYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const { month, year } = useSelector((state) => state.monthYear);
  const dispath = useDispatch();
  return (
    <div className="month-box">
      <select
        className="dropdown"
        value={month}
        onChange={(e) => {
          dispath(changeTheMonth(e.target.value));
        }}
      >
        {monthNames.map((monthName, index) => {
          return (
            <option key={index} value={index}>
              {monthName}
            </option>
          );
        })}
      </select>
      {/* <p className="sub-heading">{days} days</p> */}
      <select
        className="dropdown"
        value={year}
        onChange={(e) => {
          dispath(changeTheYear(e.target.value));
        }}
      >
        {monthNames.map((monthName, index) => {
          return (
            <option key={index} value={currentYear - index}>
              {currentYear - index}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default MonthYear;
