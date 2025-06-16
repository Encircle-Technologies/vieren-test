import React, { Fragment } from "react"
import { StaticImage } from "gatsby-plugin-image"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { Title, Value } from "../Cart/Summary"
import Item from "./Item"
// import GiftMessage from "./GiftMessage"
import { TextSkeleton } from "../Elements/Skeleton"
import Info from "../Elements/Info"
import Lock from "../../images/icons/lock.svg"

const Container = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0 0 30px;
`

const ItemList = styled.ul`
  border-bottom: 1px solid #bbbbbb;
  list-style: none;
  margin: 0 0 30px;
  padding: 0;
`

const Content = styled.div`
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  border-bottom: 1px solid #bbbbbb;
`

export const CheckoutTitle = styled(Title)`
  color: #767676;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
`

export const CheckoutValue = styled(Value)`
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
`

export const Total = styled.span`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  letter-spacing: 0.89px;
  margin: 30px 0 0;
  text-transform: uppercase;
`

export const TotalValue = styled(Total)`
  color: var(--black);
  margin: 30px 0 0;
  text-align: right;
`

export const DutiesMsg = styled.span`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 1px;
  text-align: right;
  margin: 0 0 30px;
`

export const SecureCheckout = styled.span`
  color: #767676;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
  margin: 50px 0 14px;
  text-align: center;
  text-transform: uppercase;
`

export const CardBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`

export default function Summary({ cart = null, isRefetching = false }) {
  const { selected: selectedCurrency } = useCurrency()

  if (!cart || isRefetching)
    return (
      <Container>
        <ItemList>
          <Item />
        </ItemList>
        <Content>
          <CheckoutTitle>Subtotal</CheckoutTitle>
          <Info />
          <CheckoutValue>
            <TextSkeleton />
          </CheckoutValue>
          <CheckoutTitle>Prepaid Duties & Taxes</CheckoutTitle>
          <CheckoutValue>
            <TextSkeleton />
          </CheckoutValue>
          <CheckoutTitle>Sales Tax</CheckoutTitle>
          <Info />
          <CheckoutValue>
            <TextSkeleton />
          </CheckoutValue>
          <CheckoutTitle>Shipping</CheckoutTitle>
          <Info />
          <CheckoutValue>
            <TextSkeleton />
          </CheckoutValue>
          <Total>Total</Total>
          <div />
          <TotalValue>
            <TextSkeleton />
          </TotalValue>
        </Content>
      </Container>
    )

  const {
    contents: { nodes: items },
    appliedCoupons,
    subtotal,
    discountTotal,
    shippingTotal,
    // totalTax,
    totalTaxes,
    total,
  } = cart

  const hasSalesTax =
    Array.isArray(totalTaxes) &&
    !!totalTaxes.filter(item => item.label === "Sales Tax").length

  return (
    <Container>
      <ItemList>
        {items.map(item => (
          <Item key={item.key} data={item} />
        ))}
        {/* <GiftMessage /> */}
      </ItemList>
      <Content>
        <CheckoutTitle>Subtotal</CheckoutTitle>
        <Info text={<p>Total sum price of all items in the bag</p>} />
        <CheckoutValue>{`${subtotal} ${selectedCurrency}`}</CheckoutValue>
        {!!appliedCoupons && (
          <>
            <CheckoutTitle>Promotions</CheckoutTitle>
            <Info text={<p>Placeholder for promotions</p>} />
            <CheckoutValue>{`(${discountTotal} ${selectedCurrency})`}</CheckoutValue>
          </>
        )}
        {totalTaxes
          ?.sort((a, b) => a.label.localeCompare(b.label))
          .map(item => {
            return (
              <Fragment key={item.id}>
                <CheckoutTitle>{item.label}</CheckoutTitle>
                <Info
                  text={
                    item.label === "Sales Tax" ? (
                      <p>
                        Local sales tax calculated based on shipping address
                      </p>
                    ) : item.label === "Prepaid Taxes & Duty" ? (
                      <p>
                        Duties are prepaid to ensure your package arrives
                        without delay is calculated based on shipping country.
                      </p>
                    ) : null
                  }
                />
                <CheckoutValue>{`${item.amount} ${selectedCurrency}`}</CheckoutValue>
              </Fragment>
            )
          })}
        {!hasSalesTax && (
          <>
            <CheckoutTitle>Sales Tax</CheckoutTitle>
            <Info
              text={<p>Local sales tax calculated based on shipping address</p>}
            />
            <CheckoutValue
              style={{
                textTransform: hasSalesTax ? "uppercase" : "none",
              }}
            >
              Calculating...
            </CheckoutValue>
          </>
        )}
        <CheckoutTitle>Shipping</CheckoutTitle>
        <Info
          text={
            <p>Offering free shipping with all import duties prepaid</p>
          }
        />
        <CheckoutValue
          style={{
            textTransform: "uppercase",
          }}
        >
          {shippingTotal !== "$0"
            ? `${shippingTotal} ${selectedCurrency}`
            : `Free`}
        </CheckoutValue>
        <Total>Total</Total>
        <div />
        <TotalValue
          style={{ color: hasSalesTax ? "var(--black)" : "var(--gray)" }}
        >
          {`${total} ${selectedCurrency}`}
        </TotalValue>
        <div />
        <div />
        <DutiesMsg>Import duties included</DutiesMsg>
      </Content>
      <SecureCheckout>
        <Lock style={{ marginRight: "1ch" }} />
        SSL Secure Checkout
      </SecureCheckout>
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
