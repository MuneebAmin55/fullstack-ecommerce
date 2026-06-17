
import { NavLink } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { sigUpUser } from "../features/auth/authSlice";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/loginSchema";

function SignUp() {
  const dispatch = useDispatch();
  const {registered, loading, error } = useSelector((state) => state.auth);

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(loginSchema),
    });

  const onSubmit = (data) => {
    const { username, email, password } = data; 
    const payload = { username, email, password };
    dispatch(sigUpUser(payload));
    reset();
  };
  
   if (registered) {
  return <Navigate to="/login" replace />;
}
  return (
    <div className="signup-container">
      <div className="chech-head">
         <h3 >SignUp</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          name="username"
          placeholder="Username"
           {...register("username")}
        />
        {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
        <input
          type="email"
          name="email"
          placeholder="Email"
           {...register("email")}
        />
         {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
        <input
          type="password"
          name="password"
          placeholder="Password"
        {...register("password")}
        />
         {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
            <input
          type="password"
          name="confirmPassword"
          placeholder="confirmPassword"
        {...register("confirmPassword")}
        />
         {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
        <button type="submit" className="checkout-btn" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        
        
        {error?.username && (
  <p className="error-message">{error.username}</p>
)}
        
             <p> already have an account  <LinkContainer to="/Login">
                  <NavLink className="nav-link active" aria-current="page">
                    login
                  </NavLink>
                </LinkContainer></p> 
      </form>
    </div>
  );
}

export default SignUp;
