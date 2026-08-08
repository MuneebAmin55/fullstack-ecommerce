// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./components/SignUp";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import Login from "./components/Login";
import CartItems from "./components/CartItems";
import ProductDetail from './components/ProductDetail';
import AddressForm from './components/AddressForm';
import Checkout from './components/Checkout';
import UserProfile from './components/UserProfile';
import MyOrders from './components/MyOrders';
import FilterProduct from "./components/FilterProduct";
import RequireAuth from './components/RequireAuth';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from './components/AboutUs';
import ForgotPassword from './components/ForgotPassword';
import Reset from './components/Reset';
function App() {
  return (
    <>
      <Router>
        <NavBar />
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/filter" element={<FilterProduct />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<Reset />} />
          <Route
            path="/userprofile"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/address"
            element={
              <RequireAuth>
                <AddressForm />
              </RequireAuth>
            }
          />
          <Route
            path="/cartitems"
            element={
              <RequireAuth>
                <CartItems />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route path="/products/:_id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
