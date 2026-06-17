import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressForm from "./AddressForm";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import { fetchAddress } from "../features/checkout/checkoutSlice";
import {  addToOrder } from "../features/order/orderSlice";
import Footer from "./Footer";


function Checkout() {
  const dispatch = useDispatch();
 const navigate = useNavigate();
 
  const { selectedItems } = useSelector((state) => state.cartItems);
  const { address } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchAddress());
  }, [dispatch]);

  console.log(selectedItems);
  const subPrice = selectedItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  const totalQty = selectedItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  const shipPrice = 150;


const handleAddToOrder = () => {
  const orderData = {
    address: address[0].id,
    items: selectedItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }))
  };
  console.log(orderData)
  dispatch(addToOrder(orderData));
  navigate("/Cartitems");
};

  return (
  <>
  <div className="checkout-container mt-5">

    {/* LEFT SIDE */}
    <div className="checkout-left">

      <div className="box">
        {address && address.length > 0 ? (
          address.map((add) => (
            <div key={add.id}>
              <p>
                {add.full_name} <span>{add.phone_number}</span>
              </p>
              <p>{add.address_line}</p>
            </div>
          ))
        ) : (
          <AddressForm />
        )}
      </div>

      <div className="box">
        {selectedItems.map((item, id) => (
          <div key={item.id}>
            <div className="cartitems">
              <div className="cartitemsdetail">
                <img
                  src={item.image || "/placeholder.png"}
                  className="cartitemsimage"
                  alt={item.productname || "Product"}
                />

                <div className="cartname">
                  <h6>{item.productname}</h6>
                  <p>Qty: {item.quantity}</p>
                </div>

                <div>
                  <p>Rs {item.price}</p>
                </div>
              </div>
            </div>
            {id !== selectedItems.length - 1 && <hr />}
          </div>
        ))}
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="checkout-right">
      <div className="chech-head">
         <h3 >Order Summary</h3>
      </div>
     

      <div className="summary-row">
        <p>Subtotal ({totalQty})</p>
        <span>Rs {subPrice}</span>
      </div>

      <div className="summary-row">
        <p>Shipping</p>
        <span>Rs {shipPrice}</span>
      </div>

      <div className="summary-row total">
        <p>Total</p>
        <span>Rs {subPrice + shipPrice}</span>
      </div>

      <button onClick={handleAddToOrder} className="checkout-btn">
        Proceed to Pay
      </button>
    </div>
 

  </div>
   <Footer></Footer>
   </>
);

}
export default Checkout;
