import React from "react"
import { useCurrency } from "../../hooks/useCurrency" //@ts-ignore
import { CheckoutData, useCheckoutData } from "../../hooks/useCheckoutData"
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { addressValidationSchema } from "../../utils/forms/validationSchema"

import Email from "./Email"
import Shipping from "./Shipping"

import { InlineInputGroup } from "../Forms/RHF/InputGroup"
import { ButtonAsButton } from "../Elements/Button"

type ContactAndShippingData = {
  email: CheckoutData["email"]
  firstName: CheckoutData["firstName"]
  lastName: CheckoutData["lastName"]
  marketingOptIn: CheckoutData["marketingOptIn"]
  shipping: CheckoutData["shipping"]
  shippingMethod: CheckoutData["shippingMethod"]
  giftMessage: CheckoutData["giftMessage"]
}

const contactAndShippingValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email address"),
  firstName: Yup.string()
    .required("First name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(/[^0-9]/, "Must contain at least one alphabetical character"),
  marketingOptIn: Yup.boolean().required(),
  shipping: addressValidationSchema,
  shippingMethod: Yup.string().required(
    "Taxes and duties have not yet been calculated. Please check the shipping address."
  ),
  giftMessage: Yup.string().nullable(),
})

interface ContactAndShippingFormProps {
  initialState?: ContactAndShippingData
}

const ContactAndShippingForm = ({
  initialState,
}: ContactAndShippingFormProps) => {
  const { dispatch } = useCheckoutData()
  const setFirstPageData = (data: ContactAndShippingData) =>
    dispatch({ type: "shipping", payload: data })
  const { selected: selectedCurrency } = useCurrency()
  const methods = useForm<ContactAndShippingData>({
    mode: "onChange",
    // reValidateMode: "onChange",
    defaultValues: initialState || {
      email: "",
      firstName: "",
      lastName: "",
      marketingOptIn: true,
      shipping: {
        firstName: "",
        lastName: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postcode: "",
        country: selectedCurrency === "USD" ? "US" : "CA",
        phone: "", // shipping phone doesnt exist on account
        overwrite: true,
      },
      shippingMethod: "",
      giftMessage: "",
    },
    resolver: yupResolver(contactAndShippingValidationSchema),
  })

  const onSubmit = async (values: ContactAndShippingData) => {
    try {
      setFirstPageData(values)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Email />
        <Shipping />
        <InlineInputGroup>
          <ButtonAsButton
            type="submit"
            flex
            disabled={methods.formState.isSubmitting}
          >
            Continue to Payment
            {/* {customerLoading ? "Loading..." : "Continue To Payment"} */}
          </ButtonAsButton>
        </InlineInputGroup>
      </form>
    </FormProvider>
  )
}

const PaymentAndBillingForm = () => {}

export { ContactAndShippingForm }
