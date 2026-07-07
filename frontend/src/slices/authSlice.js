// src/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken || storedToken === "undefined") return null;

  try {
    return JSON.parse(storedToken);
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

const initialState = {
  // Check localStorage so the user stays logged in if they refresh the page
  token: getStoredToken(),
  signupData: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setToken(state, value) {
      state.token = value.payload;
    },
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setToken, setSignupData, setLoading } = authSlice.actions;
export default authSlice.reducer;
