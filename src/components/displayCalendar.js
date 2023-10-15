import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DisplayCalendar = () => {
  const db = window.data_base;
  const { month, year, days } = useSelector((state) => state.monthYear);
  const milkAmount = [0, 0.5, 1, 1.5, 2, 2.5, 3];
  const [elements, setElements] = useState([]);
  const [price, setPrice] = useState(0);
  const [caption, setCaption] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const updateOrAddData = (time, currentDate, value, db) => {
    let selectedDate = new Date(year, month, currentDate).toISOString();
    const tx = db.transaction(["milkstore"], "readwrite");
    const dataStore = tx.objectStore("milkstore");
    const getRequest = dataStore.index("date").get(selectedDate);

    getRequest.onsuccess = (event) => {
      // Check for data already present or not
      const exitingData = event.target.result;
      if (exitingData) {
        if (time === "morning") {
          exitingData.morning = parseFloat(value);
        } else {
          exitingData.evening = parseFloat(value);
        }
        dataStore.put(exitingData);
      } else {
        const data = {
          date: selectedDate,
          morning: time === "morning" ? parseFloat(value) : "",
          evening: time === "evening" ? parseFloat(value) : "",
        };
        dataStore.add(data);
      }
    };
  };
  useEffect(() => {
    const request = indexedDB.open("milkio", "1");
    request.onsuccess = (e) => {
      const db = e.target.result;
      getCompleteMilkData(db);
      getPriceData(db);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const getPriceData = (db) => {
    let selectedDate = new Date(year, month, 1).toISOString();
    const tx = db.transaction(["months"], "readwrite");
    const dataStore = tx.objectStore("months");
    const getRequest = dataStore.index("date").get(selectedDate);

    getRequest.onsuccess = (event) => {
      // Check for data already present or not
      const exitingData = event.target.result;
      if (exitingData) {
        setPrice(exitingData.price);
        setCaption(exitingData.caption);
      } else {
        setPrice(0);
        setCaption("");
      }
    };
  };
  const updateMonthData = (db, type, value) => {
    let selectedDate = new Date(year, month, 1).toISOString();
    const tx = db.transaction(["months"], "readwrite");
    const dataStore = tx.objectStore("months");
    const getRequest = dataStore.index("date").get(selectedDate);

    getRequest.onsuccess = (event) => {
      // Check for data already present or not
      const exitingData = event.target.result;
      if (exitingData) {
        if (type === "price") {
          exitingData.price = parseFloat(value);
        } else {
          exitingData.caption = value;
        }
        dataStore.put(exitingData);
      } else {
        const data = {
          date: selectedDate,
          price: type === "price" ? parseFloat(value) : parseFloat(0),
          caption: type === "caption" ? value : "",
        };
        dataStore.add(data);
      }
    };
  };
  const getCompleteMilkData = (db) => {
    let filledData = [];
    let amount = 0.0;
    if (db) {
      const tx = db.transaction(["milkstore"], "readonly");
      const mStore = tx.objectStore("milkstore");
      const start = new Date(year, month, 1).toISOString();
      const end = new Date(year, month, days).toISOString();

      const range = IDBKeyRange.bound(start, end);
      const request = mStore.index("date").openCursor(range);
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          filledData[cursor.value.date] = cursor.value;
          if (cursor.value.morning !== "") {
            amount += cursor.value.morning;
          }
          if (cursor.value.evening !== "") {
            amount += cursor.value.evening;
          }
          cursor.continue();
        }
        setTotalAmount(amount);
        displayElements(db, filledData);
      };
    }
  };

  const displayElements = (database, filledData) => {
    let temp = [];
    for (let i = 0; i < days; i++) {
      const selectedDate = new Date(year, month, i + 1).toISOString();
      temp.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            <select
              className="inputAmt"
              value={filledData[selectedDate]?.morning || ""}
              onChange={async (e) => {
                updateOrAddData("morning", i + 1, e.target.value, database);
                getCompleteMilkData(database);
              }}
            >
              <option value=""></option>
              {milkAmount.map((amount) => {
                return (
                  <option value={amount} key={amount}>
                    {amount}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <select
              className="inputAmt"
              value={filledData[selectedDate]?.evening || ""}
              onChange={async (e) => {
                updateOrAddData("evening", i + 1, e.target.value, database);
                getCompleteMilkData(database);
              }}
            >
              <option value=""></option>
              {milkAmount.map((amount) => {
                return (
                  <option value={amount} key={amount}>
                    {amount}
                  </option>
                );
              })}
            </select>
          </td>
        </tr>
      );
    }
    setElements(temp);
  };

  return (
    <div>
      <div className="head-content">
        <div>₹ {totalAmount * price}</div>
        <div>{totalAmount} L</div>
        <div className="inputBox">
          <span>₹</span>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onFocus={(e) => {
              e.target.select();
            }}
            onChange={(e) => {
              const inputPrice = e.target.value;
              setPrice(inputPrice);
              updateMonthData(db, "price", e.target.value);
            }}
          />
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Morning</th>
            <th>Evening</th>
          </tr>
        </thead>
        <tbody>{elements}</tbody>
      </table>
      <input
        type="text"
        value={caption}
        placeholder="Write caption for the month..."
        className="inputField"
        onChange={(e) => {
          const inputPrice = e.target.value;
          setCaption(inputPrice);
          updateMonthData(db, "caption", e.target.value);
        }}
      />
    </div>
  );
};

export default DisplayCalendar;
