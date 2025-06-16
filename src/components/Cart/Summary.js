import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { motion } from "framer-motion"
import Coupon from "./Coupon"
import { TextSkeleton } from "../Elements/Skeleton"
import { ButtonAsLink } from "../Elements/Button"
import Info from "../Elements/Info"
import { FREE_SHIPPING_TEXT } from "../Product/FreeShipping"

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  margin: 0 0 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  @media (min-width: 1280px) {
    width: 30%;
  }
`

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

export const TitleBlock = styled.div`
  display: flex;
  align-items: center;
`

export const Title = styled.span`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

export const Value = styled(Title)`
  color: var(--black);
  text-align: right;
`

const DutiesMsg = styled.span`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 1px;
  text-align: right;
  margin: 0 0 30px;
`

const ShippingMsg = styled.span`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.63;
  letter-spacing: 1px;
  margin: 30px 0 20px;
  text-align: center;
`

const CardBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`

const summary = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function Summary({ cart = null, isRefetching = false, close }) {
  const { selected: selectedCurrency } = useCurrency()

  if (!cart || isRefetching)
    return (
      <Container variants={summary}>
        {/* <Coupon /> */}
        <Content>
          <TitleBlock>
            <Title>Subtotal</Title>
            <Info text={<p>Total sum price of all items in the bag</p>} />
          </TitleBlock>
          <Value>
            <TextSkeleton />
          </Value>
        </Content>
        <ShippingMsg>{FREE_SHIPPING_TEXT}</ShippingMsg>
        <ButtonAsLink flex disabled>
          Checkout
        </ButtonAsLink>
      </Container>
    )

  return (
    <Container variants={summary}>
      {/* <Coupon appliedCoupons={cart.appliedCoupons} /> */}
      <div style={{ marginBottom: "30px" }} />
      <Content>
        <TitleBlock>
          <Title>Subtotal</Title>
          <Info text={<p>Total sum price of all items in the bag</p>} />
        </TitleBlock>
        <Value>{`${cart.subtotal} ${selectedCurrency}`}</Value>
        {/* {cart.appliedCoupons && !!cart.appliedCoupons.length && (
          <>
            <TitleBlock>
              <Title>Promotions</Title>
            </TitleBlock>
            <Value>{`(${cart.discountTotal} ${selectedCurrency})`}</Value>
          </>
        )} */}
      </Content>
      <DutiesMsg>Import duties included</DutiesMsg>
      <ButtonAsLink
        flex
        to="/checkout"
        disabled={cart.isEmpty}
        onClick={() => close()}
      >
        Checkout
      </ButtonAsLink>
      <ShippingMsg>{FREE_SHIPPING_TEXT}</ShippingMsg>
      <CardBlock>
        <StaticImage
          src="../../images/logos/new/master.png"
          alt="MasterCard"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/visa.png"
          alt="Visa"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/amex.png"
          alt="American Express"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/jcb.png"
          alt="JCB"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/unionpay.png"
          alt="UnionPay"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/discover.png"
          alt="Discover Card"
          height={20}
        />
        <StaticImage
          src="../../images/logos/new/diners-club.png"
          alt="Diner's Club"
          height={20}
        />
      </CardBlock>
    </Container>
  )
}
