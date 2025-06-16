import React from "react"

import styled from "styled-components"
import { SubsectionTitle } from "./Elements"
import Rates from "./Rates"
import GiftMessage from "./GiftMessage"
import Address from "../Account/Address"

const Container = styled.section`
  margin: 60px 0 0;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const EditButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  text-decoration: underline;
`

export default function Shipping({ checkoutStep, setCheckoutStep }) {
  return (
    <Container>
      <Header>
        <SubsectionTitle>Shipping Address</SubsectionTitle>
        {checkoutStep === 2 && (
          <EditButton onClick={() => setCheckoutStep(1)}>Edit</EditButton>
        )}
      </Header>
      <Address edit={checkoutStep === 1} type={Address.types.SHIPPING} />
      {checkoutStep === 1 && <Rates />}
      {checkoutStep === 1 && <GiftMessage />}
    </Container>
  )
}
