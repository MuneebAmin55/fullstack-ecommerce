import React, { useEffect } from "react";
import "./product.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct,fetchCatagoryImage } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import Footer from "./Footer";


function Products() {
  const dispatch = useDispatch();

  const { items,catagoryimage, loading, error } = useSelector((state) => state.products);



  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchCatagoryImage());
  }, [dispatch]);

  console.log(catagoryimage);




if (loading) return <div className="products-container status">Loading...</div>;
  if (error) return <div className="products-container status">{error}</div>;
  return (
<div className="products-container ">
  
<div id="carouselExample" className="carousel slide">
  <div className="carousel-inner imgeslider">

    {catagoryimage.map((c, index) => (
      <div
        className={`carousel-item ${index === 0 ? "active" : ""}`}
        key={c.id}
      >
        <img
          src={c.categoryimage}
          className="d-block w-100"
          alt="..."
        />
      </div>
    ))}

  </div>

  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExample"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon"></span>
  </button>

  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselExample"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon"></span>
  </button>
</div>
 
      <h1>Products</h1>
      <div className="products-grid">
        {items.map((p) => (
          <div className="product-card" key={p._id}>
            <div className="image-wrapper">
              {p.image && <img src={p.image} alt={p.productname} />}
            </div>
            <Link to={`/products/${p._id}`}>{p.productname}</Link>
            <p className="price">${p.price}</p>
            <div className="info">{p.productinfo}</div>
          </div>
        ))}
      </div>
       <Footer></Footer>
    </div>
   
  );
}

export default Products;
