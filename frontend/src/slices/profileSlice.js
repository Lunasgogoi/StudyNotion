import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    profileData: null,
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

const initialState = {
  // Safely check if "user" exists and is NOT the string "undefined"
  user: localStorage.getItem("user") && localStorage.getItem("user") !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
};


export const { setUser, setProfileData, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
