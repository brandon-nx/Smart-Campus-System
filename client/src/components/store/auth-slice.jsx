import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    isAuthenticated: false,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
    },

    logout(state) {
      state.email = "";
      state.isAuthenticated = false;
      state.token = "";
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;