import React, { useEffect } from "react";
import "./ProductDetail.css";

import { useParams ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import {  addToCart } from "../features/cart/cartSlice";
import Footer from "./Footer";
import { toast } from "react-toastify";
function ProductDetail() {
  const { _id } = useParams();
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { singleItem, loading, error } = useSelector(
    (state) => state.products
  );


const handleOnClick = () => {
  if (!isAuthenticated) {
    navigate("/login");
    return;
  }
  
  dispatch(addToCart({ product_id: _id }))
    .unwrap()
    .then(() => {
      toast.success(
        <div >
          <strong>🛒 Added to cart</strong>
          <div>
            <button
              onClick={() => navigate("/cartitems")}
              style={{
                marginTop: "5px",
                background: "#101056",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              View Cart
            </button>
          </div>
        </div>,
        {
    position: "top-center", // ✅ must be here
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    newestOnTop: true,
    style: { zIndex: 9999 },
  }
      );
    })
    .catch(() => {
      toast.error("❌ Failed to add product");
    })
    ;
};


  useEffect(() => {
    dispatch(fetchProductById(_id));
  }, [dispatch, _id]);




  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!singleItem) return <div>No product found</div>;
  return (
    <>

    
<div className="product-detail-container ">
    {loading && <div className="status">Loading...</div>}
    {error && <div className="status">{error}</div>}
    {!singleItem && <div className="status">No product found</div>}

    {singleItem && (
      <>
        <div className="product-detail-image">
          {singleItem.image && (
            <img
              src={singleItem.image}
              alt={singleItem.productname}
            />
          )}
        </div>

        <div className="product-detail-info">
          <h1>{singleItem.productname}</h1>
          <p>
            <strong>Price:</strong> ${singleItem.price}  
          </p>
          <p> <strong>stock:</strong>{singleItem.stockcount}</p>
         
          <p>{singleItem.productinfo}</p>
          
          <button type="button" className="checkout-btn"
          
           onClick={handleOnClick} >add to cart</button>
        </div>
      </>
    )}
           

  </div> 
  <Footer></Footer>
  </>
  );
}

export default ProductDetail;
