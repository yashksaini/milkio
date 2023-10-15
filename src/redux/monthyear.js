import { createSlice } from "@reduxjs/toolkit";
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const days = new Date(currentYear, currentMonth + 1, 0).getDate();
export const monthYearSlice = createSlice({
  name: "monthYear",
  initialState: {
    month: currentMonth,
    year: currentYear,
    days: days,
  },
  reducers: {
    changeTheMonth: (state, action) => {
      state.month = action.payload;
      state.days = new Date(
        state.year,
        parseInt(state.month) + parseInt(1),
        0
      ).getDate();
    },
    changeTheYear: (state, action) => {
      state.year = action.payload;
      state.days = new Date(
        state.year,
        parseInt(state.month) + parseInt(1),
        0
      ).getDate();
    },
  },
});

export const { changeTheMonth, changeTheYear } = monthYearSlice.actions;
export default monthYearSlice.reducer;
