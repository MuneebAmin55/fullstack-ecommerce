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
import UserProfile from './components/UserProfile'
import MyOrders from './components/MyOrders';
import FilterProduct from "./components/FilterProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from './components/AboutUs';
import ForgotPassword from './components/ForgotPassword';
import Reset from './components/Reset';
function App() {
  return (
    <>
    <Router>
      <NavBar/>
       <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/filter" element={<FilterProduct />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/UserProfile" element={<UserProfile/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
        <Route path="/filter" element={<FilterProduct />} />
        <Route path="/products/:_id" element={<ProductDetail />} />
         <Route path="/address" element={<AddressForm />} />
        <Route path="/cartitems" element={<CartItems />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<Reset />} />
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
