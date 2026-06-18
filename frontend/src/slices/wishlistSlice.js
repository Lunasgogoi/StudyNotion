import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const getUserId = (user) => user?._id || user?.id || user?.email || null

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const getWishlistKey = (userId) => (userId ? `wishlist_${userId}` : "wishlist_guest")

const getStoredWishlist = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(getWishlistKey(userId))) || []
  } catch {
    return []
  }
}

const saveWishlist = (userId, wishlist) => {
  localStorage.setItem(getWishlistKey(userId), JSON.stringify(wishlist))
}

const removeWishlist = (userId) => {
  localStorage.removeItem(getWishlistKey(userId))
}

const currentUserId = getUserId(getStoredUser())
const currentWishlist = getStoredWishlist(currentUserId)

const initialState = {
  userId: currentUserId,
  wishlist: currentWishlist,
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
      saveWishlist(state.userId, state.wishlist)
      toast.success("Added to wishlist")
    },
    removeFromWishlist: (state, action) => {
      const courseId = action.payload
      const index = state.wishlist.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        state.wishlist.splice(index, 1)
        saveWishlist(state.userId, state.wishlist)
        toast.success("Removed from wishlist")
      }
    },

    loadWishlistForUser: (state, action) => {
      const userId = getUserId(action.payload)
      const wishlist = getStoredWishlist(userId)

      state.userId = userId
      state.wishlist = wishlist
    },

    clearWishlistState: (state) => {
      state.userId = null
      state.wishlist = []
    },

    resetWishlist: (state) => {
      removeWishlist(state.userId)
      state.wishlist = []
    },

  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  loadWishlistForUser,
  clearWishlistState,
  resetWishlist,
} = wishlistSlice.actions
export default wishlistSlice.reducer
