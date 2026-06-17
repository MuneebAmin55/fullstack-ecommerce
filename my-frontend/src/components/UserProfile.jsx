import React from "react";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { fetchUser } from "../features/auth/authSlice";
import {  useEffect } from "react";
import { fetchAddress } from "../features/checkout/checkoutSlice";
import "./UserProfile.css";



function UserProfile() {
      const { user } = useSelector((state) => state.auth);
      const { address } = useSelector((state) => state.address);
  const dispatch = useDispatch();

   useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchAddress());
  }, [dispatch]);

 
  return (
    <div className=" user-profile mt-5">
        <div className="profile-card mt-5">
            <div className="prof-head">
         <h3 >Persnol Info</h3>
      </div>
            {user&&
            <div  className="profile-info">
            <p>{user.username}</p>
            <p>{user.email}</p>
            </div>
            }
        </div>
         <div className="address-card">
          <div className="prof-head">
         <h3 >My address</h3>
      </div>
        {address && address.length > 0 ? (
          address.map((add) => (
            <div className="address-item" key={add.id}>
              <p className="name">
                {add.full_name} <span>{add.phone_number}</span>
              </p>
              <p className="address-line"> {add.address_line}</p>
            </div>
          ))
        ) : (
          <p  className="empty-text">add adress</p>
        )}
      </div>
    </div>
  )
}

export default UserProfile