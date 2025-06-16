import React, { useEffect } from "react"
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js"
import usePayment from "../../hooks/usePayment"
import styled from "styled-components"
import { SubsectionTitle } from "./Elements"
// import Info from "../Elements/Info"

// Formik -> React Hook Form Refactor
import { useFormContext } from "react-hook-form"
import {
  InlineInputGroup,
  InlineSplitInputGroup,
} from "../Forms/RHF/InputGroup"
import { InlineTextInput } from "../Forms/RHF/TextInput"
import { CheckboxInput } from "../Forms/RHF/CheckboxInput"
import { Error } from "../Forms/RHF/Elements"
import { useCartForCheckout } from "../../hooks/useCartForCheckout"

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 20px;
`

const Container = styled.section`
  margin: 50px 0 0;
`

const StripeInput = styled.div`
  border-bottom: ${({ error }) =>
    error ? "1px solid var(--red)" : "1px solid #bbbbbb"};
  padding: 5px 0 11px;
  position: relative;

  &::before,
  &::after {
    display: ${({ complete }) => (complete ? "block" : "none")};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &::before {
    background-color: var(--gray);
    border-radius: 50%;
    content: "";
    height: 11px;
    width: 11px;

    right: 4px;
  }

  &::after {
    color: var(--white);
    content: "✓";
    /* content: "✔"; */
    font-size: 8px;

    right: 6px;
  }
`

const style = {
  base: {
    iconColor: "#818181",
    color: "#000000",
    fontFamily: "Lato, sans-serif",
    fontWeight: "300",
    fontSize: "16px",
    fontSmoothing: "antialiased",
    letterSpacing: "1px",
    "::placeholder": {
      color: "#4d4d4d",
    },
  },
  invalid: {
    color: "#e02020",
  },
}

export default function Payment({
  amount,
  totalTaxes,
  currency,
  card,
  setCard,
}) {
  const {
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext()
  const { stripe, elements } = usePayment()
  const { data, loading, isRefetching, error } = useCartForCheckout()

  useEffect(() => {
    // create watchers for stripe fields, and update state accordingly
    if (stripe && elements) {
      const cardNumber = elements.getElement(CardNumberElement)
      const cardExpiry = elements.getElement(CardExpiryElement)
      const cardCvc = elements.getElement(CardCvcElement)

      cardNumber.on("change", e =>
        setCard(prevState => ({
          ...prevState,
          number: {
            element: cardNumber,
            complete: e.complete,
            ...(e.error && {
              error: {
                ...e.error,
                ...(e.error?.message && {
                  message: e.error?.message.slice(0, -1),
                }),
              },
            }),
          },
        }))
      )
      cardExpiry.on("change", e =>
        setCard(prevState => ({
          ...prevState,
          expiry: {
            element: cardExpiry,
            complete: e.complete,
            ...(e.error && {
              error: {
                ...e.error,
                ...(e.error?.message && {
                  message: e.error?.message.slice(0, -1),
                }),
              },
            }),
          },
        }))
      )
      cardCvc.on("change", e =>
        setCard(prevState => ({
          ...prevState,
          cvc: {
            element: cardCvc,
            complete: e.complete,
            ...(e.error && {
              error: {
                ...e.error,
                ...(e.error?.message && {
                  message: e.error?.message.slice(0, -1),
                }),
              },
            }),
          },
        }))
      )
    }

    return () =>
      setCard({
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
  }, [stripe, elements, setCard])

  const shippingMethodError = !!errors.shippingMethod

  return (
    <Container>
      <Header>
        <SubsectionTitle style={{ margin: 0 }}>Payment</SubsectionTitle>
      </Header>
      <>
        {shippingMethodError && (
          <Error>
            Please enter a valid shipping and billing address for tax and duties
            calculation
          </Error>
        )}
      </>

      <InlineInputGroup>
        <InlineTextInput
          light
          name="cardholderName"
          placeholder="Card holder name"
          aria-label="Required field: Enter the name of the cardholder"
          disabled={isSubmitting}
        />
      </InlineInputGroup>
      <InlineInputGroup>
        <StripeInput error={card.number.error} complete={card.number.complete}>
          <CardNumberElement
            options={{
              style,
              disabled: !!shippingMethodError || isSubmitting,
              placeholder: "Credit card number",
            }}
          />
        </StripeInput>
        {card.number.error && (
          <Error $inline>{card.number.error.message}</Error>
        )}
      </InlineInputGroup>
      <InlineSplitInputGroup>
        <InlineInputGroup>
          <StripeInput
            error={card.expiry.error}
            complete={card.expiry.complete}
          >
            <CardExpiryElement
              options={{
                style,
                disabled: !!shippingMethodError || isSubmitting,
              }}
            />
          </StripeInput>
          {card.expiry.error && (
            <Error $inline>{card.expiry.error.message}</Error>
          )}
        </InlineInputGroup>
        <InlineInputGroup>
          <StripeInput error={card.cvc.error} complete={card.cvc.complete}>
            <CardCvcElement
              options={{
                style,
                disabled: !!shippingMethodError || isSubmitting,
              }}
            />
            {/* <Info text={<p>Sample text</p>} /> */}
          </StripeInput>
          {card.cvc.error && <Error $inline>{card.cvc.error.message}</Error>}
        </InlineInputGroup>
      </InlineSplitInputGroup>
      <div>
        <CheckboxInput
          type="checkbox"
          name="billingSame"
          label="Bill to shipping address"
          value={true}
          disabled={isSubmitting}
        />
      </div>
    </Container>
  )
}
