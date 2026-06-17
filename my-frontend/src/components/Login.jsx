import React from "react";
import { NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { loginUser, logout } from "../features/auth/authSlice";

import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const { registered, error, loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted!", data);
    dispatch(loginUser(data));
    reset();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="login-container">
      {registered && <p>user created</p>}

      {!isAuthenticated ? (
        <>
          <div className="chech-head">
         <h3 >Login</h3>
      </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              required
              placeholder="Username"
              {...register("username")}
            />
          

            <input
              type="password"
              placeholder="Password"
              required
              {...register("password")}
            />
           
            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>

                  {error?.detail && (
  <p className="error-message">{error.detail}</p>
)}

            <p>
              dont have account
              <LinkContainer to="/SignUp">
                <NavLink className="nav-link active">create?</NavLink>
              </LinkContainer>
            </p>
            <p className="forgot-link">
  <NavLink to="/forgot-password">Forgot Password?</NavLink>
</p>
          </form>
        </>
      ) : (
        <>
          <h2 className="success-message">You are logged in ✅</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Login;
