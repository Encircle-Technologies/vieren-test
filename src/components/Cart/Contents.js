import React from "react"
// import { gql } from "@apollo/client"
import styled from "styled-components"
import { motion } from "framer-motion"
import Item from "./Item"

const ItemList = styled(motion.ul)`
  border-bottom: 1px solid #bbb;
  list-style: none;
  margin: 0;
  padding: 30px 0 0;
  /* margin: 0 0 30px; */
`

const Message = styled.span`
  color: var(--gray);
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin: 0 0 50px;
`

const list = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

export default function Contents({ cart = null, isRefetching = false }) {
  if (!cart || isRefetching)
    return (
      <ItemList variants={list}>
        <Item />
      </ItemList>
    )
  return (
    <ItemList variants={list}>
      {cart.isEmpty ? (
        <Message>You currently have no items in your shopping bag.</Message>
      ) : (
        cart.contents.nodes.map(item => <Item key={item.key} data={item} />)
      )}
    </ItemList>
  )
}
