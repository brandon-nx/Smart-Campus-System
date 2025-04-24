import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    type: "",
    isAuthenticated: null,
    verified: null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.type = action.payload.type;
      state.verified = action.payload.verified;
    },

    logout(state) {
      state.email = "";
      state.type = "";
      state.isAuthenticated = false;
      state.verified = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
