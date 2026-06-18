// src/reducer/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import courseReducer from "../slices/courseSlice";
import cartReducer from "../slices/cartSlice";
import wishlistReducer from "../slices/wishlistSlice";
import viewCourseReducer from "../slices/viewCourseSlices";


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  viewCourse: viewCourseReducer,
});

export default rootReducer;
