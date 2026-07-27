import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  resetPassword,
} from "../features/auth/authSlice";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Login.css";

function Reset() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";

  const { loading, success, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailFromState,
    },
  });

  const [timer, setTimer] = useState(60);

  // Redirect if user opens this page directly
  useEffect(() => {
    if (!emailFromState) {
      navigate("/forgot-password");
    }
  }, [emailFromState, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (success === "Password changed successfully.") {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [success, navigate]);

  const onSubmit = (data) => {
    dispatch(
      resetPassword({
        email: data.email,
        otp: data.otp,
        new_password: data.new_password,
      })
    );
  };

  const resendOTP = async () => {
    const result = await dispatch(
      forgotPassword(getValues("email"))
    );

    if (forgotPassword.fulfilled.match(result)) {
      setTimer(60);
    }
  };

  return (
    <div className="login-container">
      <div className="chech-head">
        <h3>Reset Password</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p className="error-message">
            {errors.email.message}
          </p>
        )}

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          {...register("otp", {
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "OTP must be 6 digits",
            },
            maxLength: {
              value: 6,
              message: "OTP must be 6 digits",
            },
          })}
        />

        {errors.otp && (
          <p className="error-message">
            {errors.otp.message}
          </p>
        )}

        {/* New Password */}
        <input
          type="password"
          placeholder="New Password"
          {...register("new_password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message:
                "Password must be at least 8 characters",
            },
          })}
        />

        {errors.new_password && (
          <p className="error-message">
            {errors.new_password.message}
          </p>
        )}

        {/* Confirm Password */}
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
          <p className="error-message">
            {errors.confirm_password.message}
          </p>
        )}

        <button
          type="submit"
          className="checkout-btn"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>
      </form>

      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          className="checkout-btn"
          disabled={timer > 0 || loading}
          onClick={resendOTP}
        >
          {timer > 0
            ? `Resend OTP (${timer}s)`
            : "Resend OTP"}
        </button>
      </div>

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      {error && (
        <p className="error-message">
          {typeof error === "string"
            ? error
            : error.detail || JSON.stringify(error)}
        </p>
      )}
    </div>
  );
}

export default Reset;