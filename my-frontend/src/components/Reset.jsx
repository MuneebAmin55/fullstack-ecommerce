import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { resetPassword } from "../features/auth/authSlice";

function Reset() {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    dispatch(
      resetPassword({
        uid,
        token,
        password: data.password,
      })
    );
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="password"
          placeholder="New Password"
          {...register("password")}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default Reset;