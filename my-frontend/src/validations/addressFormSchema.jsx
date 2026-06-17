import * as yup from "yup";

export const addressFormSchema = yup.object().shape({
  full_name: yup
    .string()
    .required("Full name is required")
    .min(3, "Minimum 3 characters"),

  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^03[0-9]{9}$/, "Enter valid Pakistani number (03XXXXXXXXX)"),

  province: yup
    .string()
    .required("Province is required"),

  city: yup
    .string()
    .required("City is required"),

  address_line: yup
    .string()
    .required("Address is required")
    .min(10, "Address too short"),
});

