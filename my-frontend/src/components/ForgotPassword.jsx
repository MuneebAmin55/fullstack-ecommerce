import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(
      forgotPassword(data.email)
    );

    if (forgotPassword.fulfilled.match(result)) {
      navigate("/reset-password", {
        state: {
          email: data.email,
        },
      });
    }
  };

  return (
    <div className="login-container">

    <div className="chech-head">
        <h3>Forgot Password</h3>
    </div>

    <form onSubmit={handleSubmit(onSubmit)}>

        <input
            type="email"
            placeholder="Enter Email"
            {...register("email", {
                required: "Email is required",
            })}
        />

        {errors.email && (
            <p className="error-message">
                {errors.email.message}
            </p>
        )}

        <button
            type="submit"
            className="checkout-btn"
            disabled={loading}
        >
            {loading ? "Sending..." : "Send OTP"}
        </button>

        {error && (
            <p className="error-message">
                {typeof error === "string" ? error : error.detail || JSON.stringify(error)}
            </p>
        )}
    </form>

</div>
  );
}

export default ForgotPassword;