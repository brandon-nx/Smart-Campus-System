import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    isAuthenticated: null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
    },

    logout(state) {
      state.email = "";
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
