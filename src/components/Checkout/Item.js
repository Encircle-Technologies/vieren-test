import React from "react"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { Name, Variation, Subtotal } from "../Cart/Item"
import { ImgSkeleton, TextSkeleton } from "../Elements/Skeleton"

const CheckoutItem = styled.li`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-auto-rows: max-content 1fr;
  grid-template-areas:
    "image name"
    "image subtotal";
  column-gap: 20px;
  margin: 0 0 30px;
`

export default function Item({ data = null, currency = null, isOrder = null }) {
  const { selected: selectedCurrency } = useCurrency()

  if (!data)
    return (
      <CheckoutItem>
        <div>
          <ImgSkeleton />
        </div>
        <div>
          <Name>
            <TextSkeleton />
          </Name>
          <Subtotal>
            <TextSkeleton />
          </Subtotal>
        </div>
      </CheckoutItem>
    )

  const { product, variation, subtotal, extraData, metaData } = data

  if (!product) {
    return (
      <div>Something went wrong with your cart item. Please try again.</div>
    )
  }

  const isPreorder =
    product.node?.productStatuses.nodes?.findIndex(
      status => status.name === "Pre-Order"
    ) > -1

  const customizedText = isOrder
    ? metaData?.reduce(
        (acc, curr) =>
          curr.key === "size"
            ? `${acc} ${curr.value}`
            : curr.key === "fit"
            ? `${
                curr.value === "exact"
                  ? `${acc}, Exact Fit`
                  : `${acc}, Loose Fit`
              }`
            : acc,
        "Customized:"
      )
    : extraData?.reduce(
        (acc, curr) =>
          curr.key === "size"
            ? `${acc} ${curr.value}`
            : curr.key === "fit"
            ? `${
                curr.value === "exact"
                  ? `${acc}, Exact Fit`
                  : `${acc}, Loose Fit`
              }`
            : acc,
        "Customized:"
      )

  const hasEngraving =
    extraData?.findIndex(
      data => data.key === "addEngraving" && data.value === "true"
    ) !== -1

  const engravingText = extraData?.reduce(
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

  return (
    <CheckoutItem>
      <div style={{ gridArea: "image", position: "relative" }}>
        <img
          style={{ height: "auto", width: "100%", maxWidth: "130px" }}
          src={product.node.image.mediaItemUrl}
          alt={product.node.image.altText}
        />
      </div>
      <div style={{ gridArea: "name" }}>
        <Name>
          <span>{product.node.name}</span>
        </Name>
        {isPreorder && <Variation>PRE-ORDER</Variation>}
        {product.node.__typename === "VariableProduct" && (
          <Variation>{variationDescription}</Variation>
        )}
        {metaData?.length > 1 && customizedText.length > 11 && (
          <Variation>{customizedText}</Variation>
        )}
        {extraData?.length > 1 && customizedText.length > 11 && (
          <Variation>{customizedText}</Variation>
        )}
        {hasEngraving && <Variation>{engravingText}</Variation>}
      </div>
      <Subtotal style={{ margin: "20px 0 0" }}>
        {isOrder
          ? `$${subtotal} ${currency}`
          : `${subtotal} ${selectedCurrency}`}
      </Subtotal>
    </CheckoutItem>
  )
}
