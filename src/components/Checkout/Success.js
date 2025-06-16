import React, { useEffect } from "react"
import { Link } from "gatsby"
import { useMutation } from "@apollo/client"
import { v4 as uuidv4 } from "uuid"
import EMPTY_CART from "./Success.mutation.graphql"
import { useCurrency } from "../../hooks/useCurrency"
import { trackPurchase } from "../../utils/analytics/gtag"
import { trackDirectPurchase } from "../../utils/analytics/klaviyo"
import styled from "styled-components"
import Order from "../Order/Order"

const Body = styled.div`
  margin: 0 auto;
  max-width: 600px;
  padding: 50px 0 100px;
  @media (min-width: 768px) {
    padding: 60px 0;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 23px;
`

const Bar = styled.div`
  border-bottom: 1px solid #bbbbbb;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-weight: normal;
  font-style: normal;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 1px;
  margin: 0 0 10px;
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

const PrintLink = styled(Link)`
  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 21px;
  letter-spacing: 0.61px;
  margin: 0 0 10px;
  text-decoration: underline;
`

export default function Success({ data }) {
  const { result, customer, order } = data
  const { selected: selectedCurrency } = useCurrency()

  const [emptyCart] = useMutation(EMPTY_CART, {
    variables: {
      input: {
        clientMutationId: uuidv4(),
      },
    },
  })

  useEffect(() => {
    if (result === "success") {
      try {
        // track the purchase
        !(window.google_tag_manager && window.google_tag_manager.dataLayer)
          ? trackDirectPurchase(
              order.billing.email,
              order,
              selectedCurrency
            ).catch(e => console.error(e))
          : trackPurchase(order, selectedCurrency)
        // empty the cart if checkout was successful
        emptyCart().catch(e => console.error(e))

        // sendOrder(order, selectedCurrency).then(res =>
        //   console.log(`[DEBUG - Success] send order to mailchimp`, res)
        // )
      } catch (e) {
        console.error(e)
      }
    }
  }, [result, order, emptyCart, selectedCurrency])

  const orderDate = new Date(order.date).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Body>
      <Header>
        <Title>Order Summary</Title>
        <DateText>{orderDate}</DateText>
      </Header>

      <Bar id="order-header">
        <DateText>{`#${order.orderNumber}`}</DateText>
        <PrintLink to="../print" state={{ result, customer, order }}>
          Print
        </PrintLink>
      </Bar>
      <Order data={order} />
    </Body>
  )
}
