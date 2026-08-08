import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress,
  updateAddress,
} from "../features/checkout/checkoutSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressFormSchema } from "../validations/addressFormSchema";
import "./SignUp.css";

function AddressForm({ address = null, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.address);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addressFormSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      province: "",
      city: "",
      address_line: "",
    },
  });

  useEffect(() => {
    if (address) {
      reset({
        full_name: address.full_name || "",
        phone_number: address.phone_number || "",
        province: address.province || "",
        city: address.city || "",
        address_line: address.address_line || "",
      });
    } else {
      reset({
        full_name: "",
        phone_number: "",
        province: "",
        city: "",
        address_line: "",
      });
    }
  }, [address, reset]);

  const onSubmit = async (data) => {
    try {
      if (address) {
        await dispatch(
          updateAddress({
            id: address.id,
            data,
          })
        ).unwrap();
      } else {
        await dispatch(createAddress(data)).unwrap();
      }

      reset();

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup-container">
      <h2>{address ? "Edit Address" : "Add Address"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          type="text"
          placeholder="Full Name"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="error-message">{errors.full_name.message}</p>
        )}

        <input
          type="text"
          placeholder="Phone Number"
          {...register("phone_number")}
        />
        {errors.phone_number && (
          <p className="error-message">{errors.phone_number.message}</p>
        )}

        <input
          type="text"
          placeholder="Province"
          {...register("province")}
        />
        {errors.province && (
          <p className="error-message">{errors.province.message}</p>
        )}

        <input
          type="text"
          placeholder="City"
          {...register("city")}
        />
        {errors.city && (
          <p className="error-message">{errors.city.message}</p>
        )}

        <textarea
          placeholder="Address"
          rows="3"
          {...register("address_line")}
        />
        {errors.address_line && (
          <p className="error-message">{errors.address_line.message}</p>
        )}

        {error && (
          <div className="error-message">
            {typeof error === "string" ? (
              <p>{error}</p>
            ) : (
              Object.values(error)
                .flat()
                .map((msg, index) => <p key={index}>{msg}</p>)
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button type="submit" disabled={loading}>
            {loading
              ? "Loading..."
              : address
              ? "Update Address"
              : "Save Address"}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default AddressForm;