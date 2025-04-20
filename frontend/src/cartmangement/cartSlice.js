import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],        
  totalQuantity: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find(item => item.product._id === product._id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product, quantity: 1 })
      }
      state.totalQuantity += 1
    },
    removeFromCart(state, action) {
      const id = action.payload
      const idx = state.items.findIndex(item => item.product._id === id)
      if (idx !== -1) {
        state.totalQuantity -= state.items[idx].quantity
        state.items.splice(idx, 1)
      }
    },
    clearCart(state) {
      state.items = []
      state.totalQuantity = 0
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
