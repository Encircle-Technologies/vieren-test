import React, { Fragment } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import Item from "./Item"
import Customer from "../Account/Customer"
import {
  CheckoutTitle,
  CheckoutValue,
  Total,
  TotalValue,
  DutiesMsg,
} from "../Checkout/Summary"
import Info from "../Elements/Info"

const Container = styled(motion.section)``

const Contents = styled.section`
  margin: 0 0 50px;
`

// NB: components below are dupe of Checkout/Summary
// candidate for refactoring
const ItemList = styled.ul`
  border-bottom: 1px solid #bbbbbb;
  list-style: none;
  margin: 0 0 30px;
  padding: 30px 0 0;
`

const SummaryContainer = styled.div`
  border-bottom: 1px solid #bbbbbb;
  display: grid;
  grid-template-columns: 1fr max-content;
  margin: 0 0 30px;
`

const SummaryInfo = styled.div`
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  /* gap: 0 50px; */
`

// const Total = styled.span`
//   color: var(--gray);
//   font-family: "Lato", sans-serif;
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 30px;
//   letter-spacing: 0.89px;
//   margin: 20px 0 0;
//   text-transform: uppercase;
// `

// const TotalValue = styled(Total)`
//   color: var(--black);
//   margin: 20px 0 0;
//   text-align: right;
// `

const order = {
  closed: {
    height: 0,
    transition: {
      delay: 0.5,
      height: { stiffness: 1000 },
      staggerChildren: 0.05,
      straggerDirection: -1,
    },
  },
  open: {
    height: "auto",
    transition: {
      height: { stiffness: 1000, mass: 100, damping: 100, velocity: -100 },
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
}

export default function Order({ data, toggle }) {
  const {
    orderNumber,
    status,
    date,
    lineItems: { nodes: items },
    subtotal,
    shippingTotal,
    // totalTax,
    taxLines: { nodes: totalTaxes },
    total,
    currency,
    shipping,
    billing,
    customerNote,
  } = data

  return (
    <Container
      id="order-body"
      initial="closed"
      animate="open"
      exit="closed"
      variants={order}
    >
      <Contents>
        <ItemList>
          {items.map(item => (
            <Item
              key={item.databaseId}
              // data={{
              //   ...item,
              //   product: { node: item.product },
              //   variation: { node: item.variation },
              // }} // shape of order item doesn't contain node
              data={item}
              currency={currency}
            />
          ))}
        </ItemList>
        <SummaryContainer>
          <div />
          <SummaryInfo>
            <CheckoutTitle>Subtotal</CheckoutTitle>
            <Info text={<p>Total sum price of all items in the bag</p>} />
            <CheckoutValue>{`${subtotal} ${currency}`}</CheckoutValue>
            {totalTaxes?.map((item, index) => (
              <Fragment key={index}>
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
                <CheckoutValue>{`$${item.taxTotal} ${currency}`}</CheckoutValue>
              </Fragment>
            ))}
            <CheckoutTitle>Shipping</CheckoutTitle>
            <Info
              text={
                <p>
                  Offering free shipping with all import duties prepaid
                </p>
              }
            />
            <CheckoutValue
              style={{
                textTransform: "uppercase",
              }}
            >
              {shippingTotal !== "$0"
                ? `${shippingTotal} ${currency}`
                : "Free"}
            </CheckoutValue>
            {/* <TitleBlock>
            <Title>Taxes & Duties</Title>
            <Info
              text={
                <p>
                  Total shipping fees with complimentary standard shipping and
                  all taxes and duties pre-paid to ensure your package arrives
                  without delays.
                </p>
              }
            />
          </TitleBlock> */}
            {/* <Value>{`${totalTax} ${currency}`}</Value> */}
            <Total>Total</Total>
            <div />
            <TotalValue>{`${total} ${currency}`}</TotalValue>
            <div />
            <div />
            <DutiesMsg>Import duties included</DutiesMsg>
          </SummaryInfo>
        </SummaryContainer>
        <div>
          <DutiesMsg
            style={{ whiteSpace: "pre-line", textTransform: "none" }}
            dangerouslySetInnerHTML={{ __html: customerNote }}
          />
        </div>
      </Contents>
      <Customer shipping={shipping} billing={billing} />
    </Container>
  )
}
