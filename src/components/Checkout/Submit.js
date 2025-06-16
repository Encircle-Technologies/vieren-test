import React from "react"
import styled from "styled-components"
import { ButtonAsButton } from "../Elements/Button"
import { LinkAsLink } from "../Elements/Link"
// Formik -> RHF Refactor
import { useFormContext } from "react-hook-form"
import { InlineInputGroup } from "../Forms/RHF/InputGroup"
import { Error } from "../Forms/RHF/Elements"

const Container = styled.div`
  /* background-color: #fafafa; */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 calc(-1 / 24 * 100vw) 100px;
  padding: 0;

  @media (min-width: 768px) {
    margin: 0 0 100px;
  }
`

const Disclaimer = styled.span`
  color: #4d4d4d;
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  text-align: center;

  margin: 20px 0;
`

export default function Submit({ card, setCard, checkoutError }) {
  const {
    formState: { isSubmitting, errors, touchedFields },
    setFocus,
  } = useFormContext()

  return (
    <Container>
      <InlineInputGroup>
        <ButtonAsButton
          type="submit"
          flex
          disabled={isSubmitting}
          onClick={e => {
            if (errors.cardholderName) {
              setFocus("cardholderName")
            }

            if (
              !card.number.complete ||
              !card.expiry.complete ||
              !card.cvc.complete
            ) {
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
            }
          }}
        >
          {isSubmitting ? `Placing Order...` : `Place Order`}
        </ButtonAsButton>
        <Disclaimer>
          {"By placing an order you are agreeing to VIEREN's "}
          <LinkAsLink as="a" light href="/terms" target="_blank">
            Terms & Conditions
          </LinkAsLink>
          {" and "}
          <LinkAsLink as="a" light href="/privacy" target="_blank">
            Privacy Policy
          </LinkAsLink>
        </Disclaimer>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {checkoutError && <Error>{checkoutError}</Error>}
        </div>
      </InlineInputGroup>
    </Container>
  )
}
