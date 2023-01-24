import { createSlice } from "@reduxjs/toolkit";
// import Loginreducer from "counterSlice";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
  },

  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export const get_auth = (state) => {
  return state.auth;
};

export default authSlice.reducer;
