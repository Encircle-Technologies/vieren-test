import * as Yup from "yup"

export const accountValidationSchema = Yup.object({
  createAccount: Yup.boolean().required(),
  username: Yup.string()
    .email("Invalid Email Address")
    .required("Email is required"),
  password: Yup.string().when("createAccount", {
    is: true,
    then: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain at least 8 Characters, One Uppercase, one Lowercase, one Number and one Special Case Character"
      )
      .required("Password is required"),
    otherwise: Yup.string().nullable(),
  }),
  verifyPassword: Yup.string().when("createAccount", {
    is: true,
    then: Yup.string()
      .oneOf([Yup.ref("password"), null])
      .required("Confirm password is required"),
    otherwise: Yup.string().nullable(),
  }),
})

// regex for at least one letter and one number
// /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

export const addressValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  company: Yup.string().nullable(),
  address1: Yup.string()
    .required("Address is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  address2: Yup.string().nullable(),
  city: Yup.string()
    .required("City is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  // add validation for just letters
  // Need additional validation here for Delivery Zone 1 and 2
  state: Yup.string().when("country", {
    is: "CA",
    then: schema => schema.required("Province is required"),
    otherwise: schema => schema.required("State is required"),
  }),
  postcode: Yup.string().when("country", {
    is: "CA",
    then: schema =>
      schema
        .required("Postal code is required")
        .matches(
          /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
          "Invalid postal code"
        ),
    otherwise: schema =>
      schema
        .required("Zip code is required")
        .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, "Invalid zip code"),
  }),
  country: Yup.string()
    // .matches(/(CA)/, "Shipping options only available in Canada.")
    .required("Country is required"), // validation for Canada only
  phone: Yup.string()
    .matches(
      /^(\(?\+?[0-9]*\)?)?[0-9_\- ()]*$/g,
      "Must be valid phone number, allowed characters: 0-9, +, -, (),"
    )
    .required("Phone number is required")
    .min(10, "Phone number must be 10-15 digits long")
    .max(15, "Phone number must be 10-15 digits long"),
  overwrite: Yup.boolean(),
})

export const checkoutValidationSchema = Yup.object({
  // account: accountValidationSchema,
  email: Yup.string()
    .email("Invalid Email Address")
    .required("Email is required"),
  firstName: Yup.string()
    .required("First name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  marketingOptIn: Yup.boolean().required(),
  billingSame: Yup.boolean().required(),
  billing: addressValidationSchema,
  shipping: addressValidationSchema,
  shippingMethod: Yup.string().required(
    "Taxes and duties have not yet been calculated. Please check the shipping address."
  ),
  cardholderName: Yup.string()
    .required("Cardholder name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  paymentMethod: Yup.string().required(
    "Payment gateway has not been selected."
  ),
  // metaData: Yup.array().of(
  //   Yup.object({
  //     key: Yup.string().required(),
  //     value: Yup.string().required(),
  //   })
  // ),
  // .required(),
  customerNote: Yup.string().nullable(),
  acceptTerms: Yup.boolean()
    .oneOf(
      [true],
      "You must accept the Terms & Conditions, and Privacy Policy to proceed with checkout."
    )
    .required(),
  giftMessage: Yup.string().nullable(),
})
