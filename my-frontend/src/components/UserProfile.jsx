import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/auth/authSlice";
import {
  fetchAddress,
  deleteAddress,
} from "../features/checkout/checkoutSlice";
import AddressForm from "./AddressForm";
import "./UserProfile.css";

function UserProfile() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { address } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchAddress());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  return (
    <div className="user-profile">
      {/* Personal Info */}
      <div className="profile-card">
        <div className="prof-head">
          <h3>Personal Info</h3>
        </div>

        {user && (
          <div className="profile-info">
            <p>
              <strong>Username:</strong> {user.username}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="address-card">
        <div className="prof-head">
          <h3>My Address</h3>

          {/* Show only if no address exists */}
          {(!address || address.length === 0) && (
            <button
              className="add-address-btn"
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
            >
              + Add Address
            </button>
          )}
        </div>

        {address && address.length > 0 ? (
          address.map((add) => (
            <div className="address-item" key={add.id}>
              <p className="name">
                {add.full_name}
                <span>{add.phone_number}</span>
              </p>

              <p className="address-line">{add.address_line}</p>

              <p>
                {add.city}, {add.province}
              </p>

              <div className="address-buttons">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingAddress(add);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(add.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-text">No address added.</p>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;