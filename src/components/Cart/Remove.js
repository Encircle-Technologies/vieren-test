import React from "react"
import { v4 as uuidv4 } from "uuid"
import useDeleteFromCart from "../../hooks/useDeleteFromCart"
import styled from "styled-components"

const Container = styled.div`
  /* grid-area: remove;
  place-self: end start; */
  position: absolute;
  top: 0;
  right: 0;
`

const Button = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  color: #767676;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: right;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  padding: 10px;
  height: 44px;
  width: 44px;
`

const CloseIcon = styled.div`
  position: relative;
  height: 12px;
  width: 12px;

  &::before,
  &::after {
    background-color: #767676;
    content: "";
    display: block;
    height: 2px;
    width: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(135deg);
  }
`

export default function Remove({ itemKey }) {
  const [deleteCartItem, { loading, error }] = useDeleteFromCart({
    variables: {
      input: {
        clientMutationId: uuidv4(),
        items: [{ key: itemKey, quantity: 0 }],
      },
    },
  })

  return (
    <Container>
      <Button type="button" onClick={() => deleteCartItem()} disabled={loading}>
        <CloseIcon />
      </Button>
      {error && <span>{JSON.stringify(error, null, 2)}</span>}
    </Container>
  )
}
