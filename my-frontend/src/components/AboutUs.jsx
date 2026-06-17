import React from 'react'
import "./aboutus.css";
import {
  fetchCategories,
} from "../features/products/productSlice";
import  { useEffect } from "react";
import { NavLink} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
function AboutUs() {
    const { categories } = useSelector((state) => state.products);
    const dispatch = useDispatch();
  useEffect(() => {
        dispatch(fetchCategories());
      }, [dispatch]);

        const uniquecategory = [
    ...new Set(categories.map((p) => p.productcategory)),
  ];
  return (
<div className="about-container">

  <div className="about-header">
    <h2>Buying Made Simple. Everyday.</h2>
    <h6>
      Compare prices, order and buy mobile phones, electronics, appliances, and accessories online for hassle-free delivery to your home.
    </h6>
  </div>

  <div className="products-section">
    <h1>Products</h1>
    <div className="products-grid">
      {uniquecategory.map((p) => (
        <div className="product-card" key={p}>
          <span>{p}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="payment-section">
    <h1>Offering shoppers multiple payment options</h1>
    <div className="payment-options">
      <h2>Debit Card</h2>
      <h2>Bank Transfer</h2>
      <h2>Cash on Delivery</h2>
    </div>
  </div>

</div>
  )
}

export default AboutUs