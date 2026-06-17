import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import cartitemsReducer from '../features/cart/cartSlice.jsx'
import orderitemsReducer from '../features/order/orderSlice.jsx'
import useraddressReducer  from '../features/checkout/checkoutSlice.jsx'

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cartItems:cartitemsReducer,
    orderItems:orderitemsReducer,
    address:useraddressReducer
  },
});
