import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  // If cart data exists in local storage, use it. Otherwise, start fresh.
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
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
      state.totalItems++
      state.total += course.price

      // Update local storage
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
      
      toast.success("Course added to cart")
    },
    
    // 🔥 Here is the missing removeFromCart action! 🔥
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // Find the course, subtract its price, decrease the count, and remove it from the array
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)

        // Update local storage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        
        toast.success("Course removed from cart")
      }
    },
    
    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      
      // Clear local storage
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions
export default cartSlice.reducer