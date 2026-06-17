import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useSearchParams } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  fetchProduct,
  fetchCategories,
} from "../features/products/productSlice";
import { fetchUser, logout } from "../features/auth/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import FilterProuct from "./FilterProduct";
import { useNavigate } from "react-router-dom";


function NavBar() {
  const { categories } = useSelector((state) => state.products);
  const { cartItem } = useSelector((state) => state.cartItems);
  const { isAuthenticated, checkedAuth, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  // ✅ NEW: URL params
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!checkedAuth && isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [checkedAuth, dispatch, isAuthenticated]);

  // ✅ NEW: Fetch products when URL changes
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    dispatch(
      fetchProduct({
        search: search || undefined,
        productcategory: category || undefined,
      }) 
    );
  }, [searchParams, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };

  // ✅ SEARCH → update URL
  const handleOnClick = (e) => {
    e.preventDefault();

    navigate(`/filter?search=${search}`);
    setSearch("");
  };
 
  const navigate = useNavigate();
  // ✅ CATEGORY → update URL
const handleOnClickcat = (category) => {
  if (category === "ALL") {
    navigate("/products");
  } else {
    navigate(`/filter?category=${category}`);
  }
};

  const uniquecategory = [
    ...new Set(categories.map((p) => p.productcategory)),
  ];

  return (
    <div className="nvbr">
      <Navbar className=" Navbar fixed-top navbar-expand-lg text-white">
        <div className="container-fluid">
          <LinkContainer to="/products">
            <NavLink className="navbar-brand  text-white">
              E-commerce
            </NavLink>
          </LinkContainer>

          <button
            className="navbar-toggler text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">

              <li className="nav-item">
                <LinkContainer to="/products">
                  <Nav.Link className="text-white">Home</Nav.Link>
                </LinkContainer>
              </li>

              <li className="  navdrop dropdown">
                {user ? (
                  <>
                    <Nav.Link
                      className="dropdown-toggle text-white"
                      data-bs-toggle="dropdown"
                    >
                      {user.username}
                    </Nav.Link>
                    <ul className="dropdown-menu">
                      <li>
                        <LinkContainer to="/UserProfile">
                          <Nav.Link className="dropdown-item">
                            My Profile
                          </Nav.Link>
                        </LinkContainer>
                      </li>
                      <li>
                        <LinkContainer to="/my-orders">
                          <Nav.Link className="dropdown-item">
                            My Orders
                          </Nav.Link>
                        </LinkContainer>
                      </li>
                      <li>
                        <Nav.Link
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </Nav.Link>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      className="dropdown-toggle text-white"
                      data-bs-toggle="dropdown"
                    >
                      Register
                    </Nav.Link>
                    <ul className="dropdown-menu">
                      <li>
                        <LinkContainer to="/SignUp">
                          <Nav.Link className="dropdown-item">
                            Signup
                          </Nav.Link>
                        </LinkContainer>
                      </li>
                      <li>
                        <LinkContainer to="/login">
                          <Nav.Link className="dropdown-item">
                            Login
                          </Nav.Link>
                        </LinkContainer>
                      </li>
                    </ul>
                  </>
                )}
              </li>
            </ul>

            {/* ✅ CATEGORY */}
            <div className="navcontent">
            <div className="dropdown catdropdown">
              <button
                className="btn dropdown-toggle text-white"
                data-bs-toggle="dropdown"
              >
                Categories
              </button>
              <ul className="dropdown-menu">
                <li>
                  <span
                    className="dropdown-item"
                    onClick={() => handleOnClickcat("ALL")}
                    style={{ cursor: "pointer" }}
                  >
                    All Products
                  </span>
                </li>

                {uniquecategory.map((p) => (
                  <li key={p}>
                    <span
                      className="dropdown-item"
                      onClick={() => handleOnClickcat(p)}
                      style={{ cursor: "pointer" }}
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ SEARCH */}
            <form className="d-flex" onSubmit={handleOnClick}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                value={search}
                onChange={handleOnChange}
              />
              <button className="btn-search-primary" type="submit">
                🔍
              </button>
            </form>
               </div>
            {/* ✅ CART */}
            <LinkContainer className="cartnbr" to="/cartitems">
              <NavLink className="nav-link text-white">
                <FontAwesomeIcon icon={faCartShopping} />
                {cartItem.length}
              </NavLink>
            </LinkContainer>
          
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default NavBar;