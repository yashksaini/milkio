import { configureStore } from "@reduxjs/toolkit";
import monthYearReducer from "./monthyear";
export default configureStore({
  reducer: {
    monthYear: monthYearReducer,
  },
});
