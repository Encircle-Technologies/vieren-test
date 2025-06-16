import React, { useRef, useReducer, useEffect } from "react"
import useUpdateCart from "../../hooks/useUpdateCart"
import styled from "styled-components"
import { TextSkeleton } from "../Elements/Skeleton"
import { Error } from "../Forms/Inputs"

const Wrapper = styled.div`
  grid-area: quantity;
  place-self: start;
`

const Container = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    place-self: start center;
  }
`

const Label = styled.label`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  margin: 0 1ch 0 0;
  text-transform: uppercase;
`

const Button = styled.button`
  background: transparent;
  border: 0;
  border-radius: 0;
  color: #818181;
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  text-transform: uppercase;
  padding: 0;
  position: relative;
  height: 26px;
  width: 26px;

  ${({ decrease, increase }) => {
    if (decrease) {
      return `&::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        
        background-color: #818181;
        content: "";
        display: block;
        height: 2px;
        width: 11px;
        }`
    }
    if (increase) {
      return `
      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);

        background-color: #818181;
        content: "";
        display: block;
      }
      &::before {
        height: 2px;
        width: 11px;
        }
      &::after {
        height: 11px;
        width: 2px;
      }
      `
    }
  }}
`

const Input = styled.input`
  border: none;
  color: #818181;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  padding: 5px 10px;
  width: 2ch;

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    margin: 0;
  }
`

const Message = styled.span`
  color: black;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
`

function SelectedQtyReducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + 1
    case "decrement":
      return state - 1
    case "replace":
      return parseInt(action.input)
    default:
      throw new Error("[Error] Unhandled quantity action.")
  }
}

export default function Quantity({ itemKey = null, initialQuantity = 1 }) {
  const loadRef = useRef(false)
  const [selectedQty, dispatch] = useReducer(
    SelectedQtyReducer,
    initialQuantity
  )

  const [updateCartItemQuantity, { loading, error }] = useUpdateCart({
    variables: {
      input: {
        items: [{ key: itemKey, quantity: selectedQty }],
      },
    },
  })

  useEffect(() => {
    if (loadRef.current && itemKey) {
      updateCartItemQuantity()
    } else {
      loadRef.current = true
    }
  }, [selectedQty, updateCartItemQuantity])

  if (!itemKey)
    return (
      <Wrapper>
        <Container>
          <Label htmlFor="quantity">Qty:</Label>
          <Button decrease aria-label="Decrease Quantity" disabled />
          <Input as="output">
            <TextSkeleton />
          </Input>
          <Button increase aria-label="Increase Quantity" disabled />
        </Container>
      </Wrapper>
    )

  return (
    <Wrapper>
      <Container>
        <Label htmlFor="quantity">Qty:</Label>
        <Button
          decrease
          aria-label="Decrease Quantity"
          onClick={() => dispatch({ type: "decrement" })}
          disabled={selectedQty <= 1 || loading}
        />
        <Input
          type="number"
          name="quantity"
          value={selectedQty}
          min="1"
          onChange={e =>
            e.target.value > 0 &&
            dispatch({ type: "replace", input: e.target.value })
          }
        />
        <Button
          increase
          aria-label="Increase Quantity"
          onClick={() => dispatch({ type: "increment" })}
          disabled={loading}
        />
      </Container>
      {loading && <Message>Calculating...</Message>}
      {error && <Error>{JSON.stringify(error, null, 2)}</Error>}
    </Wrapper>
  )
}
