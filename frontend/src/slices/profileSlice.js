import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser || storedUser === "undefined") return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: getStoredUser(),
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

export const { setUser, setProfileData, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
