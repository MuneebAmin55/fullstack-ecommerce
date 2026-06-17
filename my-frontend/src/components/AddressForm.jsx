
import { NavLink } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createAddress } from "../features/checkout/checkoutSlice";
import "./SignUp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressFormSchema} from "../validations/addressFormSchema";

function AddressForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.address);

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: yupResolver(addressFormSchema),
    });

  const onSubmit = (data) => {
    console.log("Form submitted!", data);
    dispatch(createAddress(data));
    reset();
  };
  

  return (
    <div className="signup-container">
      <h2>address</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
        
          placeholder="Username"
           {...register("full_name")}
        />
        {errors.full_name && (
              <p className="error-message">{errors.full_name.message}</p>
            )}
        <input
          type="text"
     
          placeholder="phone number"
           {...register("phone_number")}
        />
         {errors.phone_number && (
              <p className="error-message">{errors.phone_number.message}</p>
            )}
        <input
          type="text"
     
          placeholder="province"
        {...register("province")}
        />
         {errors.province && (
              <p className="error-message">{errors.province.message}</p>
            )}
            <input
          type="text"
          
          placeholder="enter your city"
        {...register("city")}
        />
         {errors.city && (
              <p className="error-message">{errors.city.message}</p>
            )}
             <input
          type="text"
              placeholder="enter your address"
        {...register("address_line")}
        />
         {errors.address_line && (
              <p className="error-message">{errors.address_line.message}</p>
            )}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "save "}
        </button>
        
        
        {error?.full_name && (
  <p className="error-message">{error.full_name}</p>
)}
        
          
      </form>
    </div>
  );
}

export default AddressForm;
