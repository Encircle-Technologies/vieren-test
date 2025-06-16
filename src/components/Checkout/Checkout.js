import React, { useRef, useState, useEffect } from "react"
import { navigate } from "gatsby"
import { useCurrency } from "../../hooks/useCurrency"
import { useCartForCheckout } from "../../hooks/useCartForCheckout"
import usePayment from "../../hooks/usePayment"
import {
  trackBeginCheckout,
  trackAddShippingInfo,
  trackAddPaymentInfo,
  trackUpdatedEmail,
} from "../../utils/analytics/gtag"
import {
  trackDirectBeginCheckout,
  trackDirectAddShippingInfo,
  trackDirectAddPaymentInfo,
} from "../../utils/analytics/klaviyo"
import { useMutation } from "@apollo/client"
import CHECKOUT from "./Checkout.mutation.graphql"
import GET_CART_FOR_CHECKOUT from "./Checkout.query.graphql"
import UpdateCustomerMutation from "../Account/Customer.mutation.graphql"
import { checkoutValidationSchema } from "../../utils/forms/validationSchema"

import styled from "styled-components"

import { Body } from "./Body"
import { SectionTitle } from "./Elements"
import Email from "./Email"
import Shipping from "./Shipping"
import Billing from "./Billing"
import Payment from "./Payment"
import Summary from "./Summary"
import Submit from "./Submit"

// Formik -> React Hook Forms Refactor
import { useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// May need to refactor out
import { InlineInputGroup } from "../Forms/RHF/InputGroup"
import { ButtonAsButton } from "../Elements/Button"

const FormContent = styled.div`
  grid-area: form;
  padding: 50px 25px 0;
  max-width: 600px;

  @media (min-width: 1024px) {
    padding: 50px 80px 0;
  }
`

const SubmitContent = styled(FormContent)`
  grid-area: submit;
  padding: 50px 25px 100px;

  @media (min-width: 1024px) {
    padding: 50px 80px 100px;
  }
`

const SummaryContent = styled.div`
  grid-area: summary;
  background-color: #fafafa;
  padding: 50px 25px 0;
  margin: 50px 0 0;

  @media (min-width: 1024px) {
    padding: 50px 80px 0;
    margin: 0;
  }
`

const customizationsToNotes = cart =>
  cart
    ? cart.contents.nodes.reduce((acc, curr, index) => {
        if (curr.extraData && curr.extraData.length > 1) {
          let message = acc

          const productName = curr.product.node.name
          const [sizeObj] = curr.extraData.filter(
            metadata => metadata.key === "size"
          )
          const [fitObj] = curr.extraData.filter(
            metadata => metadata.key === "fit"
          )
          const [addEngravingObj] = curr.extraData.filter(
            metadata => metadata.key === "addEngraving"
          )
          const [engravingMessageObj] = curr.extraData.filter(
            metadata => metadata.key === "engravingMessage"
          )
          console.log(`[DEBUG] customization objects...`)
          console.log(sizeObj, fitObj, addEngravingObj, engravingMessageObj)

          const hasCustomSize = sizeObj && fitObj ? true : false
          const hasEngraving =
            addEngravingObj && engravingMessageObj ? true : false
          console.log(
            `[DEBUG] hasCustomizeSize? ${hasCustomSize}, hasEngraving ${hasEngraving}`
          )

          if (hasCustomSize || hasEngraving) {
            message = message.concat(
              `${
                index > 0 ? "<br><br>" : ""
              }${productName.toUpperCase()} (Item #${index + 1})`
            )
          }

          if (hasCustomSize) {
            message = message.concat(
              `${index > 0 ? "<br>" : ""}Customized: ${sizeObj?.value}, ${
                fitObj?.value
              }`
            )
          }

          if (hasEngraving) {
            message = message.concat(
              `${index > 0 || hasCustomSize ? "<br>" : ""}Engraving: ${
                engravingMessageObj?.value
              }`
            )
          }

          return message
        }

        return acc
      }, "")
    : null

export default function Checkout({ email }) {
  const { selected: selectedCurrency } = useCurrency()
  const {
    data: cartData,
    loading: cartLoading,
    error: cartError,
  } = useCartForCheckout()
  const { createPaymentSource } = usePayment()

  // Local component state
  const checkoutStartCount = useRef(0)
  const paymentInfoCompleteCount = useRef(0)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [userEmail, setUserEmail] = useState("")
  const [card, setCard] = useState({
    number: {
      element: null,
      complete: null,
      error: null,
    },
    expiry: {
      element: null,
      complete: null,
      error: null,
    },
    cvc: {
      element: null,
      complete: null,
      error: null,
    },
  })
  const [checkoutError, setCheckoutError] = useState()

  const [submitCheckout] = useMutation(CHECKOUT)

  const defaultCheckoutValues = {
    email: email || "",
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
    billingSame: true,
    billing: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: selectedCurrency === "USD" ? "US" : "CA",
      phone: "",
      overwrite: true,
    },

    cardholderName: "",
    paymentMethod: "stripe",
    // metaData: [],
    customerNote: "",
    acceptTerms: true,
    giftMessage: "",
  }

  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: defaultCheckoutValues,
    resolver: yupResolver(checkoutValidationSchema),
  })

  const shipping = methods.watch("shipping")
  const [updateCustomer, { loading: customerLoading }] = useMutation(
    UpdateCustomerMutation,
    {
      variables: {
        input: {
          shipping,
        },
      },
      refetchQueries: [{ query: GET_CART_FOR_CHECKOUT }],
      awaitRefetchQueries: true,
    }
  )

  const onSubmit = async formData => {
    console.log(`[DEBUG] submitting checkout with form data: `, formData)
    // Get the current session id (to delete the abandoned cart)
    // const session = getWooSession()
    // Get the results of the attempted checkout
    try {
      const { result, customer, order } = await handleCheckout(formData)

      if (result === "success") {
        // process.env.NODE_ENV === "development" &&
        //   console.log("[DEBUG] attempting to delete session, ", session)
        // const res = await deleteAbandonedCart(session)
        // process.env.NODE_ENV === "development" &&
        //   console.log("[DEBUG] result of session deletion, ", res)

        navigate("/checkout/success", {
          state: { result, customer, order },
        })
      } else if (result === "fail") {
        setCheckoutError(
          `Transaction failed. Please contact orders@vieren.co with order #${order.orderNumber}`
        )
      } else {
        setCheckoutError("Checkout failed.")
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (
      !cartLoading &&
      cartData &&
      !!Object.keys(cartData).length &&
      checkoutStartCount.current === 0
    ) {
      checkoutStartCount.current++

      !(window.google_tag_manager && window.google_tag_manager.dataLayer)
        ? trackDirectBeginCheckout(
            userEmail,
            cartData,
            selectedCurrency
          ).catch(e => console.error(e))
        : trackBeginCheckout(cartData, selectedCurrency)
      // Initialize the customer note
      process.env.NODE_ENV === "development" &&
        console.log(`[DEBUG] setting customer note with...`, cartData?.cart)
      methods.setValue("customerNote", customizationsToNotes(cartData?.cart))
    }
  }, [cartData, cartLoading, selectedCurrency])

  useEffect(() => {
    const shouldCreateAbandonedCart =
      userEmail && cartData?.cart && selectedCurrency
    process.env.NODE_ENV === "development" &&
      console.log(
        `[DEBUG - Checkout] filled, userEmail, cart, selectedCurrency`,
        userEmail,
        cartData?.cart,
        selectedCurrency
      )

    if (shouldCreateAbandonedCart) {
      process.env.NODE_ENV === "development" &&
        console.log(
          `[DEBUG - Checkout] conditions to create abandoned cart triggered`
        )

      if (!(window.google_tag_manager && window.google_tag_manager.dataLayer)) {
        trackDirectBeginCheckout(
          userEmail,
          cartData,
          selectedCurrency
        ).catch(e => console.error(e))
      } else {
        trackUpdatedEmail(userEmail)
        trackBeginCheckout(cartData, selectedCurrency)
      }
    }
  }, [userEmail, cartData, selectedCurrency])

  useEffect(() => {
    if (
      card.number.complete &&
      card.expiry.complete &&
      card.cvc.complete &&
      paymentInfoCompleteCount.current === 0
    ) {
      paymentInfoCompleteCount.current++

      !(window.google_tag_manager && window.google_tag_manager.dataLayer)
        ? trackDirectAddPaymentInfo(userEmail).catch(e => console.error(e))
        : trackAddPaymentInfo()
    }
  }, [card])

  const handleCheckout = async values => {
    const {
      email,
      shipping,
      billing,
      shippingMethod,
      cardholderName,
      paymentMethod,
      customerNote,
      giftMessage,
    } = values

    // Clear any existing checkout errors
    setCheckoutError("")

    // exit if fields are incomplete
    if (!card.number.complete || !card.expiry.complete || !card.cvc.complete) {
      setCard(prevState => ({
        ...prevState,
        ...(!card.number.complete && {
          number: {
            ...prevState.number,
            error: {
              message: "Card number is required",
            },
          },
        }),
        ...(!card.expiry.complete && {
          expiry: {
            ...prevState.expiry,
            error: { message: "Card expiry is required" },
          },
        }),
        ...(!card.cvc.complete && {
          cvc: {
            ...prevState.cvc,
            error: { message: "Card CVC is required" },
          },
        }),
      }))
      return
    }
    // exit if card element is missing
    if (!card.number.element) {
      setCheckoutError("Could not find card element. Please contact support.")
      return
    }

    const hasSalesTax =
      Array.isArray(cartData?.cart.totalTaxes) &&
      !!cartData?.cart.totalTaxes.filter(item => item.label === "Sales Tax")
        .length

    if (!hasSalesTax) {
      setCheckoutError(
        "Sales tax has not been calculated yet. Please verify your shipping information. If you are using browser autocomplete, please ensure all fields are filled out correctly."
      )

      return
    }

    const { source, error: psError } = await createPaymentSource({
      element: card.number.element,
      billing: {
        ...billing,
        name: cardholderName,
      },
      amount: cartData?.cart.total,
      currency: selectedCurrency,
    })

    process.env.NODE_ENV === "development" &&
      console.log("[stripe] create payment source ", source, psError)

    if (!source || psError) {
      setCheckoutError("Unable to create payment source.")
      return
    }

    if (source) {
      let input = {
        shipping: {
          ...shipping,
          email,
        },
        billing: {
          ...billing,
          email,
        },
        shippingMethod,
        paymentMethod,
        metaData: [{ key: "_stripe_source_id", value: source.id }],
        customerNote:
          giftMessage !== ""
            ? customerNote.concat(`\n\nGIFT MESSAGE: ${giftMessage}`)
            : customerNote,
      }

      const {
        data: {
          checkout: { result, customer, order },
        },
      } = await submitCheckout({
        variables: {
          input,
        },
      })

      return { result, customer, order }
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Body>
          <FormContent>
            <SectionTitle>Checkout</SectionTitle>
            <Email
              checkoutStep={checkoutStep}
              setCheckoutStep={setCheckoutStep}
              setUserEmail={setUserEmail}
            />
            <Shipping
              checkoutStep={checkoutStep}
              setCheckoutStep={setCheckoutStep}
            />
            {checkoutStep === 2 && (
              <>
                {cartData && (
                  <Payment
                    amount={cartData?.cart?.total}
                    totalTaxes={cartData?.cart?.totalTaxes}
                    currency={selectedCurrency}
                    card={card}
                    setCard={setCard}
                  />
                )}
                <Billing />
              </>
            )}
          </FormContent>
          <SubmitContent>
            {checkoutStep === 1 ? (
              <>
                <InlineInputGroup>
                  <ButtonAsButton
                    flex
                    disabled={customerLoading}
                    onClick={async () => {
                      const billingSame = methods.watch("billingSame")

                      const isValid = await methods.trigger(
                        [
                          "email",
                          "firstName",
                          "lastName",
                          "marketingOptIn",
                          "shipping.firstName",
                          "shipping.lastName",
                          "shipping.address1",
                          "shipping.address2",
                          "shipping.city",
                          "shipping.state",
                          "shipping.postcode",
                          "shipping.country",
                          "shipping.phone",
                          "giftMessage",
                        ],
                        { shouldFocus: true }
                      )

                      if (isValid) {
                        const { data } = await updateCustomer()

                        if (data) {
                          if (billingSame) {
                            methods.setValue("billing", shipping)
                          }

                          methods.clearErrors()
                          setCheckoutStep(2)
                          typeof window !== "undefined" &&
                          !(
                            window.google_tag_manager &&
                            window.google_tag_manager.dataLayer
                          )
                            ? await trackDirectAddShippingInfo(userEmail)
                            : trackAddShippingInfo()
                          window?.scrollTo(0, 0)
                        }
                      }
                    }}
                  >
                    {customerLoading ? "Loading..." : "Continue To Payment"}
                  </ButtonAsButton>
                </InlineInputGroup>
              </>
            ) : (
              <Submit
                checkoutError={checkoutError}
                card={card}
                setCard={setCard}
              />
            )}
          </SubmitContent>
          <SummaryContent>
            <SectionTitle style={{ margin: "0 0 30px" }}>
              Order Summary
            </SectionTitle>
            {cartData && <Summary cart={cartData?.cart} />}
          </SummaryContent>
        </Body>
      </form>
    </FormProvider>
  )
}
