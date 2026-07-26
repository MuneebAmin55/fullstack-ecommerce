import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email));
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p style={{ color: "red" }}>
            {errors.email.message}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {success && (
        <>
          <p style={{ color: "green" }}>{success}</p>

          <Link to="/reset-password">
            Enter OTP
          </Link>
        </>
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

export default ForgotPassword;