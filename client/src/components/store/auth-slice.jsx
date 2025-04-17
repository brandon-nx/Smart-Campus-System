import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    type: "",
    isAuthenticated: null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.type = action.payload.type;
    },

    logout(state) {
      state.email = "";
      state.type = "";
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
