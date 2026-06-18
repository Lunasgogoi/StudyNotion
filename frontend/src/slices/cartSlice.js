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

const getCartKey = (userId) => (userId ? `cart_${userId}` : "cart_guest")

const getStoredCart = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(getCartKey(userId))) || []
  } catch {
    return []
  }
}

const getCartTotal = (cart) =>
  cart.reduce((sum, course) => sum + (Number(course?.price) || 0), 0)

const saveCart = (userId, cart) => {
  localStorage.setItem(getCartKey(userId), JSON.stringify(cart))
}

const removeCart = (userId) => {
  localStorage.removeItem(getCartKey(userId))
}

const currentUserId = getUserId(getStoredUser())
const currentCart = getStoredCart(currentUserId)

const initialState = {
  userId: currentUserId,
  cart: currentCart,
  total: getCartTotal(currentCart),
  totalItems: currentCart.length,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const index = state.cart.findIndex((item) => item._id === course._id)

      // If the course is already in the cart, do not add it again
      if (index >= 0) {
        toast.error("Course is already in cart")
        return
      }

      // If course is not in cart, add it
      state.cart.push(course)
      state.totalItems = state.cart.length
      state.total = getCartTotal(state.cart)

      // Update local storage
      saveCart(state.userId, state.cart)
      
      toast.success("Course added to cart")
    },
    
    // 🔥 Here is the missing removeFromCart action! 🔥
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // Find the course, subtract its price, decrease the count, and remove it from the array
        state.cart.splice(index, 1)
        state.totalItems = state.cart.length
        state.total = getCartTotal(state.cart)

        // Update local storage
        saveCart(state.userId, state.cart)
        
        toast.success("Course removed from cart")
      }
    },

    loadCartForUser: (state, action) => {
      const userId = getUserId(action.payload)
      const cart = getStoredCart(userId)

      state.userId = userId
      state.cart = cart
      state.total = getCartTotal(cart)
      state.totalItems = cart.length
    },

    clearCartState: (state) => {
      state.userId = null
      state.cart = []
      state.total = 0
      state.totalItems = 0
    },
    
    resetCart: (state) => {
      removeCart(state.userId)
      state.cart = []
      state.total = 0
      state.totalItems = 0
    },
  },
})

export const { addToCart, removeFromCart, loadCartForUser, clearCartState, resetCart } = cartSlice.actions
export default cartSlice.reducer
