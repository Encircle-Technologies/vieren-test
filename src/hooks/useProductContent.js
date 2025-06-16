import React, { createContext, useContext } from "react"

const ContentContext = createContext(null)

export const ContentProvider = ({ products, children }) => (
  <ContentContext.Provider value={useProvideContent(products)}>
    {children}
  </ContentContext.Provider>
)

export const PRODUCT_TYPES = {
  USD_SimpleProduct: "simple",
  USD_VariableProduct: "variable",
}

export const TAGS = {
  Customizable: "customizable",
  Leather: "leather",
  Metal: "metal",
  Black: "black",
  White: "white",
  Gold: "gold",
}

export const ATTRIBUTES = {
  Regular: "regular",
  Engraved: "engraved",
}

const useProvideContent = products => {
  const { usd } = products

  const type = PRODUCT_TYPES[usd?.product?.__typename]

  const isPreOrder =
    usd.product?.productStatuses?.nodes?.findIndex(
      status => status.name === "Pre-Order"
    ) > -1

  const isSpecialEdition =
    usd.product?.productStatuses?.nodes?.findIndex(
      status => status.name === "Special Edition"
    ) > -1

  const includesCustomizableTag = usd?.product?.productTags.nodes.filter(
    tag => tag.name === "Customizable"
  )
  const includesMetalTag = usd?.product?.productTags.nodes.filter(
    tag => tag.name === "Metal"
  )
  const includesLeatherTag = usd?.product?.productTags.nodes.filter(
    tag => tag.name === "Leather"
  )

  const includesBlackTag = usd?.product?.productTags?.nodes.filter(
    tag => tag.name === "Black"
  )
  const includesWhiteTag = usd?.product?.productTags?.nodes.filter(
    tag => tag.name === "White"
  )
  const includesGoldTag = usd?.product?.productTags?.nodes.filter(
    tag => tag.name === "Gold"
  )

  const isCustomizable =
    Array.isArray(includesCustomizableTag) && includesCustomizableTag.length > 0
  const isMetalWatch =
    Array.isArray(includesMetalTag) && includesMetalTag.length > 0

  const isBlackWatch =
    Array.isArray(includesBlackTag) && includesBlackTag.length > 0
  const isWhiteWatch =
    Array.isArray(includesWhiteTag) && includesWhiteTag.length > 0
  const isGoldWatch =
    Array.isArray(includesGoldTag) && includesGoldTag.length > 0
  // const isWhiteMetalWatch =
  //   Array.isArray(includesWhiteTag) && includesWhiteTag.length > 0
  // const isBlackMetalWatch =
  //   Array.isArray(includesBlackTag) && includesBlackTag.length > 0
  const isLeatherWatch =
    Array.isArray(includesLeatherTag) && includesLeatherTag.length > 0

  const kind = isMetalWatch ? "metal" : isLeatherWatch ? "leather" : "unknown"
  const colour = isGoldWatch
    ? "gold"
    : isWhiteWatch
    ? "white"
    : isBlackWatch
    ? "black"
    : "unknown"

  const regularVariations =
    kind !== "unknown" &&
    usd.product.variations.nodes.filter(variant => {
      const hasRegularAttribute =
        variant.attributes.nodes.findIndex(
          attribute =>
            attribute.name === "kind" && attribute.value === "Regular"
        ) !== -1

      return hasRegularAttribute
    })

  const engravedVariations =
    kind !== "unknown" &&
    usd.product.variations.nodes.filter(variant => {
      const hasRegularAttribute =
        variant.attributes.nodes.findIndex(
          attribute =>
            attribute.name === "kind" && attribute.value === "Engraved"
        ) !== -1

      return hasRegularAttribute
    })

  return {
    product: usd.product,
    type,
    kind,
    colour,
    isCustomizable,
    isPreOrder,
    isSpecialEdition,
    regularVariations,
    engravedVariations,
  }
}

export const useProductContent = () => useContext(ContentContext)
