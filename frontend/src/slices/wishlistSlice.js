import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  wishlist: localStorage.getItem("wishlist")
    ? JSON.parse(localStorage.getItem("wishlist"))
    : [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const course = action.payload
      const index = state.wishlist.findIndex((item) => item._id === course._id)

      // If already in wishlist, show an error toast
      if (index >= 0) {
        toast.error("Course is already in your wishlist")
        return
      }

      state.wishlist.push(course)
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist))
      toast.success("Added to wishlist")
    },
    removeFromWishlist: (state, action) => {
      const courseId = action.payload
      const index = state.wishlist.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        state.wishlist.splice(index, 1)
        localStorage.setItem("wishlist", JSON.stringify(state.wishlist))
        toast.success("Removed from wishlist")
      }
    },
    resetWishlist: (state) => {
      state.wishlist = []
      localStorage.removeItem("wishlist")
    },

  },
})

export const { addToWishlist, removeFromWishlist, resetWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer