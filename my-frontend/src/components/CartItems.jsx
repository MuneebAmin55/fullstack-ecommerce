import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./cartitems.css";
import "./checkout.css"
import { NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  cartItemAll,
  updateQty,
  deleteCartItem,
  setSelectedItems
} from "../features/cart/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import { toast } from "react-toastify";

function CartItems() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItem, loading, error } = useSelector((state) => state.cartItems);
  const [select, setselect] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(cartItemAll());
    }
  }, [dispatch, isAuthenticated]);

  const handleOnDelete = (id) => {
    dispatch(deleteCartItem(id))
      .unwrap()
      .then(() => {
        toast.success("Product deleted", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          newestOnTop: true,
          style: { zIndex: 9999 },
        });
      })
      .catch(() => {
        toast.error("❌ Failed to delete product");
      });
  };

  const handleChecked = (id) => {
    setselect((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const selectedItems = cartItem
    .filter(item => select.includes(item.id))
    .map(item => ({
      product: item.product._id,
      image: item.product.image,
      productname: item.product.productname,
      quantity: item.quantity,
      price: item.product.price
    }));

  const handleOrderClick = () => {
    console.log("selected", selectedItems);
    dispatch(setSelectedItems(selectedItems));
    navigate("/checkout");
  };

  const handleIncrement = (id, quantity) => {
    dispatch(
      updateQty({
        id: id,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = (id, quantity) => {
    dispatch(
      updateQty({
        id: id,
        quantity: quantity - 1,
      })
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!cartItem || cartItem.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <LinkContainer to="/Products">
          <NavLink className="nav-link active" aria-current="page">
            <button>Continue Shopping</button>
          </NavLink>
        </LinkContainer>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItem.reduce((total, item) => {
    if (select.includes(item.id)) {
      return total + item.quantity * item.product.price;
    }
    return total;
  }, 0);

  const subqty = cartItem.reduce((qty, item) => {
    if (select.includes(item.id)) {
      return qty + item.quantity;
    }
    return qty;
  }, 0);

  const shipPrice = 150;

  return (
    <div className="cart">
      <h1>Cart Items</h1>
      <div className="container">
        {/* LEFT SIDE - Order Summary */}
        <div className="checkout-right">
          <div className="chech-head">
            <h3>Order Summary</h3>
          </div>
          <div className="orderdetail">
            <div className="summary-row">
              <p>Subtotal ({subqty})</p>
              <span>Rs {subtotal}</span>
            </div>
            <div className="summary-row">
              <p>Shipping</p>
              <span>Rs {shipPrice}</span>
            </div>
            <div className="summary-row total">
              <p>Total</p>
              <span>Rs {subtotal + shipPrice}</span>
            </div>
            <button 
              className="checkout-btn" 
              disabled={selectedItems.length === 0} 
              onClick={handleOrderClick}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Cart Items Column */}
        <div className="cartcontainer">
          {/* Select All Option */}
          <div className="selectall">
            <input
              type="checkbox"
              id="selectAll"
              checked={select.length === cartItem.length && cartItem.length > 0}
              onChange={() => {
                if (select.length === cartItem.length) {
                  setselect([]);
                } else {
                  setselect(cartItem.map(item => item.id));
                }
              }}
            />
            <label htmlFor="selectAll">Select All Items ({cartItem.length})</label>
          </div>

          {/* Cart Items */}
          {cartItem.map((c) => (
            <div className="cartitems" key={c.id}>
              <input
                type="checkbox"
                className="cartcheck"
                id={`item-${c.id}`}
                checked={select.includes(c.id)}
                onChange={() => handleChecked(c.id)}
              />
              <div className="cartitemsdetail">
                <img
                  src={c.product?.image || "/placeholder.png"}
                  className="cartitemsimage"
                  alt={c.product?.productname || "Product"}
                />
                <div className="cartname">
                  <h6>{c.product?.productname}</h6>
                  <p>
                    Only{" "}
                    <span
                      style={{
                        color: c.quantity >= c.product?.stockcount ? "red" : "green",
                        fontWeight: "bold"
                      }}
                    >
                      {c.product?.stockcount}
                    </span>{" "}
                    items left in stock
                  </p>
                </div>
                <div className="cart-price">
                  <p>Price: Rs {c.product?.price}</p>
                  <p className="item-total">Total: Rs {c.quantity * c.product?.price}</p>
                </div>
                <div className="itemquantity">
                  <button
                    onClick={() => handleDecrement(c.id, c.quantity)}
                    disabled={c.quantity <= 1}
                  >
                    -
                  </button>
                  <p>{c.quantity}</p>
                  <button
                    onClick={() => handleIncrement(c.id, c.quantity)}
                    disabled={c.quantity >= c.product?.stockcount}
                  >
                    +
                  </button>
                </div>
                <div className="delete-icon" onClick={() => handleOnDelete(c.id)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartItems;