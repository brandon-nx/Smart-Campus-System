import { createSlice } from "@reduxjs/toolkit";

const accountRecoverySlice = createSlice({
  name: "accountRecovery",
  initialState: {
    email: "",
    inputOtp: "",
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },

    setInputOtp(state, action) {
      state.inputOtp = action.payload;
    },

    clear(state) {
      (state.email = ""), (state.inputOtp = "");
    },
  },
});

export const accountRecoveryActions = accountRecoverySlice.actions;

export default accountRecoverySlice;
