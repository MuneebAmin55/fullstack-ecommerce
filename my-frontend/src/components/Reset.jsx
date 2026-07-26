import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/auth/authSlice";

function Reset() {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(
      resetPassword({
        email: data.email,
        otp: data.otp,
        new_password: data.new_password,
      })
    );
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p>{errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="OTP"
          {...register("otp", {
            required: "OTP is required",
            minLength: 6,
            maxLength: 6,
          })}
        />

        {errors.otp && (
          <p>OTP must be 6 digits.</p>
        )}

        <input
          type="password"
          placeholder="New Password"
          {...register("new_password", {
            required: "Password is required",
            minLength: 8,
          })}
        />

        {errors.new_password && (
          <p>{errors.new_password.message}</p>
        )}

      <input
  type="password"
  placeholder="Confirm Password"
  {...register("confirm_password", {
    required: "Confirm Password is required",
    validate: (value) =>
      value === getValues("new_password") ||
      "Passwords do not match",
  })}
/>

{errors.confirm_password && (
  <p>{errors.confirm_password.message}</p>
)}

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {typeof error === "string"
            ? error
            : error.detail || JSON.stringify(error)}
        </p>
      )}
    </div>
  );
}

export default Reset;