import React, { useEffect } from "react";
import "./product.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { useSearchParams } from "react-router-dom";

function FilterProuct() {
  const dispatch = useDispatch();

  const { items, catagoryimage, loading, error } = useSelector(
    (state) => state.products,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(catagoryimage);

  useEffect(() => {
    const ordering = searchParams.get("ordering") || "";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    dispatch(
      fetchProduct({
        ordering: ordering || undefined,
        search: search || undefined,
        productcategory: category || undefined,
      }),
    );
  }, [searchParams, dispatch]);

  if (loading)
    return <div className="products-container status">Loading...</div>;
  if (error) return <div className="products-container status">{error}</div>;

  return (
    <div className="products-container ">
      <h1>Products</h1>
      <ul className="dropdown-toggle text-black" data-bs-toggle="dropdown">
        sort by
      </ul>
      <ul className="dropdown-menu">
        <li
          className="dropdown-item"
          onClick={() => {
            const params = Object.fromEntries([...searchParams]);
            setSearchParams({ ...params, ordering: "price" });
          }}
        >
          low to high
        </li>

        <li
          className="dropdown-item"
          onClick={() => {
            const params = Object.fromEntries([...searchParams]);
            setSearchParams({ ...params, ordering: "-price" });
          }}
        >
          high to low
        </li>
      </ul>
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

export default FilterProuct;
