import React from "react"
import styled from "styled-components"

const Container = styled.div`
  background-color: #f2f2f4;
  padding: 50px 40px;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 30px;
`

const SectionTitle = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0 0 5px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 22px;
    line-height: 27px;
  }
`

const DateText = styled.span`
  color: var(--gray);
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 23px;
`

const Row = styled.div`
  display: grid;
  gap: 30px;
  margin: 0 0 30px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }

  &:last-child {
    margin: 0;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const Title = styled.span`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;
`

const Data = styled.span`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  margin: 0;
`

export default function Customer({ shipping, billing }) {
  return (
    <Container>
      <Header>
        <SectionTitle>Customer Information</SectionTitle>
        <DateText>
          {billing.firstName} {billing.lastName}
        </DateText>
      </Header>

      <Row>
        <Info>
          <Title>Email</Title>
          <Data>{billing.email}</Data>
        </Info>
        <Info>
          <Title>Phone Number</Title>
          <Data>{billing.phone}</Data>
        </Info>
      </Row>
      <Row>
        <Info>
          <Title>Shipping Address</Title>
          <Data>{`${shipping.firstName} ${shipping.lastName}`}</Data>
          <Data>{`${shipping.company || ""}`}</Data>
          <Data>{`${shipping.address1} ${shipping.address2 || ""}`}</Data>
          <Data>{`${shipping.city}, ${shipping.state}`}</Data>
          <Data>{`${shipping.postcode} ${shipping.country}`}</Data>
        </Info>
        <Info>
          <Title>Billing Address</Title>
          <Data>{`${billing.firstName} ${billing.lastName}`}</Data>
          <Data>{`${billing.company || ""}`}</Data>
          <Data>{`${billing.address1} ${billing.address2 || ""}`}</Data>
          <Data>{`${billing.city}, ${billing.state}`}</Data>
          <Data>{`${billing.postcode} ${billing.country}`}</Data>
        </Info>
      </Row>
    </Container>
  )
}
