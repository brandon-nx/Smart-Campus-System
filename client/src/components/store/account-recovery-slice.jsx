import { createSlice } from "@reduxjs/toolkit";

const accountRecoverySlice = createSlice({
  name: "accountRecovery",
  initialState: {
    email: "",
    otp: "",
  },
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },

    setInputOtp(state, action) {
      state.otp = action.payload;
    },

    clear(state) {
      state.email = "";
      state.otp = "";
    },
  },
});

export const accountRecoveryActions = accountRecoverySlice.actions;

export default accountRecoverySlice;
