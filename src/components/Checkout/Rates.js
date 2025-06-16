import React from "react"
import { useQuery, NetworkStatus } from "@apollo/client"
import { useCurrency } from "../../hooks/useCurrency"
import useUpdateShippingMethod from "../../hooks/useUpdateShippingMethod"
import styled from "styled-components"
import { ImgSkeleton, TextSkeleton } from "../Elements/Skeleton"

import GET_CART_FOR_CHECKOUT from "./Checkout.query.graphql"
import { useFormContext } from "react-hook-form"

const Methods = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;

  /* @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  } */
`

const Method = styled.li``

const Label = styled.label`
  cursor: pointer;
  display: flex;
`

const LabelText = styled.span`
  color: #575757;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.88px;
`

const Radio = styled.div`
  flex: 0 0 14px;

  border: 1px solid #979797;
  margin: 0 1ch 0 0;
  height: 14px;
  width: 14px;

  position: relative;

  &::after {
    background: var(--black);
    content: "";
    display: none;

    position: absolute;
    height: 10px;
    width: 10px;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  input[type="radio"]:checked ~ &::after {
    display: block;
  }
`

const Cost = styled.span`
  font-weight: 700;
  margin-left: 1ch;
`

const InlineButton = styled.button`
  background: transparent;
  border: none;
  border-radius: none;
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.88px;
  padding: 0 0.5ch;
`

function Rate({ rate, chosenRates, submitting }) {
  const { selected: selectedCurrency } = useCurrency()

  const [updateShippingMethod, { loading, error }] = useUpdateShippingMethod()

  if (loading)
    return (
      <Method>
        <Label>
          <ImgSkeleton
            style={{
              flex: "0 0 14px",
              height: "14px",
              width: "14px",
              marginRight: "1ch",
            }}
          />
          <LabelText>
            <TextSkeleton count={3} />
          </LabelText>
        </Label>
      </Method>
    )

  return (
    <Method>
      <Label htmlFor={rate.id}>
        <input
          style={{ display: "none" }}
          type="radio"
          id={rate.id}
          name="shippingMethod"
          value={rate.id}
          checked={rate.id === chosenRates[0]}
          disabled={loading}
          onChange={e =>
            updateShippingMethod({
              variables: {
                input: {
                  shippingMethods: e.target.value,
                },
              },
            })
          }
        />
        <Radio />
        <LabelText>
          {rate.label}
          <Cost>{rate.cost && `$${rate.cost} ${selectedCurrency}`}</Cost>
        </LabelText>
      </Label>
    </Method>
  )
}

export default function Rates() {
  const {
    setValue,
    formState: { isSubmitting },
  } = useFormContext()
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_CART_FOR_CHECKOUT,
    {
      // fetchPolicy: "cache-and-network",
      // fetchPolicy: "cache-first", https://github.com/apollographql/apollo-client/issues/6636
      // more info here: https://github.com/apollographql/react-apollo/issues/4000
      notifyOnNetworkStatusChange: true,

      onCompleted: ({ cart }) => {
        // chosen shipping method now returns as an array of strings
        setValue("shippingMethod", cart.chosenShippingMethods)
      },
    }
  )

  const refetching = networkStatus === NetworkStatus.refetch

  if (loading || refetching)
    return (
      <Methods>
        <Method>
          <Label>
            <ImgSkeleton
              style={{ height: "14px", width: "14px", marginRight: "1ch" }}
            />
            <LabelText>
              <TextSkeleton count={3} />
            </LabelText>
          </Label>
        </Method>
        <Method>
          <Label>
            <ImgSkeleton
              style={{ height: "14px", width: "14px", marginRight: "1ch" }}
            />
            <LabelText>
              <TextSkeleton count={3} />
            </LabelText>
          </Label>
        </Method>
      </Methods>
    )

  if (error)
    return (
      <Methods>
        <Method>
          <Label>
            Error retrieving shipping rates. Please refresh the page or contact
            support.
          </Label>
        </Method>
      </Methods>
    )

  // pluck the first object in the array
  const {
    cart: {
      availableShippingMethods: [method, ...rest],
      chosenShippingMethods,
    },
  } = data

  if (!method || !method?.rates)
    return (
      <Label>
        <LabelText>
          No Shipping Rates available yet. Please enter a valid shipping
          address. Having trouble? Try{" "}
          <InlineButton type="button" onClick={() => refetch()}>
            refreshing all available shipping rates.
          </InlineButton>
        </LabelText>
      </Label>
    )

  if (!!rest.length) {
    console.log(
      "[Warning] Unexpected result: multiple shipping methods detected"
    )
  }

  return (
    <>
      {method.rates ? (
        <Methods>
          {method.rates.map(rate => (
            <Rate
              key={rate.id}
              rate={rate}
              chosenRates={chosenShippingMethods}
              submitting={isSubmitting}
            />
          ))}
        </Methods>
      ) : (
        <Label>
          <LabelText>
            No Shipping Rates available yet. Please enter a valid shipping
            address. Having trouble? Try{" "}
            <InlineButton type="button" onClick={() => refetch()}>
              refreshing all available shipping rates.
            </InlineButton>
          </LabelText>
        </Label>
      )}
    </>
  )
}
