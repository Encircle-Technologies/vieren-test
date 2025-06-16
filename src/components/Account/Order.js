import React from "react"
import styled from "styled-components"
import { AnimatePresence } from "framer-motion"
import OrderContent from "../Order/Order"

const Row = styled.div``

const OrderButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  display: grid;
  grid-template-areas:
    "number date"
    "status ."
    "total .";
  grid-template-columns: repeat(2, 1fr);
  padding: 20px 0;
  position: relative;
  text-align: unset;
  width: 100%;

  &::after {
    border-bottom: 1px solid #bbbbbb;
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  @media (min-width: 768px) {
    grid-template-areas: "number date status total";
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 10px 0;
  }
`

const ColumnData = styled.span`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  margin: 0;
  text-transform: capitalize;
`

const Number = styled(ColumnData)`
  color: var(--black);
  font-weight: 400;
  grid-area: number;
`

const OrderDate = styled(ColumnData)`
  grid-area: date;

  place-self: start end;

  @media (min-width: 768px) {
    place-self: start;
  }
`

const Status = styled(ColumnData)`
  grid-area: status;
`

const Total = styled(ColumnData)`
  grid-area: total;

  @media (min-width: 768px) {
    place-self: start end;
  }
`

export default function Order({
  order,
  selected,
  setSelected,
  open,
  toggleOpen,
}) {
  return (
    <Row>
      {!open && (
        <OrderButton
          onClick={() => {
            setSelected(order.id)
            toggleOpen()
          }}
        >
          <Number
            style={{ color: "var(--black)", fontWeight: "400" }}
          >{`#${order.orderNumber}`}</Number>
          <OrderDate>
            {new Date(order.date).toLocaleString("default", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </OrderDate>
          <Status>{order.status}</Status>
          <Total>{`${order.total} ${order.currency}`}</Total>
        </OrderButton>
      )}
      <AnimatePresence>
        {selected === order.id && open && (
          <OrderContent data={order} toggle={toggleOpen} />
        )}
      </AnimatePresence>
    </Row>
  )
}
