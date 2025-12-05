import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import productReducer from "./slices/productSlice"
import listingReducer from "./slices/listingSlice"
import categoryReducer from "./slices/categorySlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"
import messageReducer from "./slices/messageSlice"
import farmerReducer from "./slices/farmerSlice"
import userReducer from "./slices/userSlice"
import purchaseReducer from "./slices/purchaseSlice"
import inventoryReducer from "./slices/inventorySlice"
import notificationReducer from "./slices/notificationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    listings: listingReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
    messages: messageReducer,
    farmers: farmerReducer,
    users: userReducer,
    purchases: purchaseReducer,
    inventory: inventoryReducer,
    notifications: notificationReducer,
  },
})
