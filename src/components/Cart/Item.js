import React from "react"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { motion } from "framer-motion"
import { ImgSkeleton, TextSkeleton } from "../Elements/Skeleton"
import Remove from "./Remove"

const CartItem = styled(motion.li)`
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  grid-template-rows: max-content 1fr;
  grid-template-areas:
    "image name"
    "image subtotal";
  column-gap: 20px;

  margin: 0 0 30px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 3fr 3fr 1fr;
    grid-template-rows: auto;
    grid-template-areas: "image name quantity subtotal";
  }
`

export const Name = styled.h3`
  grid-area: name;
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 0.89px;
  margin: 0;
  text-transform: uppercase;
`

export const Variation = styled.span`
  color: var(--gray);
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.61px;
  margin: 0;
`

export const Subtotal = styled.span`
  grid-area: subtotal;
  place-self: start end;

  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
  margin: 20px 0 0;
  text-transform: uppercase;

  @media (min-width: 800px) {
    margin: 0;
  }
`

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function Item({ data = null }) {
  const { selected: selectedCurrency } = useCurrency()

  if (!data)
    return (
      <CartItem variants={item}>
        <div style={{ gridArea: "image", position: "relative" }}>
          <ImgSkeleton />
        </div>
        <Name>
          <TextSkeleton />
        </Name>
        <Subtotal>
          <TextSkeleton />
        </Subtotal>
      </CartItem>
    )

  const { key, product, variation, quantity, subtotal, extraData } = data

  const customizedText = extraData.reduce(
    (acc, curr) =>
      curr.key === "size"
        ? `${acc} ${curr.value || ""}`
        : curr.key === "fit"
        ? `${
            curr.value === "exact"
              ? `${acc}, Exact Fit`
              : curr.value === "loose"
              ? `${acc}, Loose Fit`
              : ``
          }`
        : acc,
    "Customized:"
  )

  const hasEngraving =
    extraData.findIndex(
      data => data.key === "addEngraving" && data.value === "true"
    ) !== -1

  const engravingText = extraData.reduce(
    (acc, curr) =>
      curr.key === "engravingMessage" ? `${acc} ${curr.value}` : acc,
    `Engraving (+$${
      selectedCurrency === "USD" ? `150` : `200`
    } ${selectedCurrency}):`
  )

  const variationDescription =
    variation?.node.description === "Large"
      ? "Large: 165mm to 210mm"
      : variation?.node.description === "Small"
      ? "Small: 140mm to 190mm"
      : variation?.node.description

  if (!product) {
    return (
      <CartItem variants={item}>
        <div style={{ gridArea: "image", position: "relative" }}>
          <ImgSkeleton />
        </div>
        <Name>
          Error! Something went wrong with your cart item. Please remove this
          item and try again.
        </Name>
        <Subtotal style={{ position: "relative" }}>
          <Remove itemKey={key} />
        </Subtotal>
      </CartItem>
    )
  }

  const isPreorder =
    product.node?.productStatuses.nodes?.findIndex(
      status => status.name === "Pre-Order"
    ) > -1

  return (
    <CartItem variants={item}>
      <div style={{ gridArea: "image", position: "relative" }}>
        <img
          style={{ height: "auto", width: "100%" }}
          src={product.node?.image?.mediaItemUrl}
          alt={product.node?.image?.altText}
        />
        <Remove itemKey={key} />
      </div>
      <div>
        <Name>{product.node.name}</Name>
        {isPreorder && <Variation>PRE-ORDER</Variation>}
        {product.node?.__typename === "VariableProduct" && (
          <Variation>{variationDescription}</Variation>
        )}
        {extraData.length > 0 && customizedText.length > 11 && (
          <Variation>{customizedText}</Variation>
        )}
        {hasEngraving && <Variation>{engravingText}</Variation>}
      </div>
      <Subtotal>{`${subtotal} ${selectedCurrency}`}</Subtotal>
    </CartItem>
  )
}
