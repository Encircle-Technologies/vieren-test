import React from "react"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import useAddToCart from "../../hooks/useAddToCart"
import { useCurrency } from "../../hooks/useCurrency"
import { trackAddToCart } from "../../utils/analytics/gtag"
import styled from "styled-components"
import { Container } from "./Container"
import Link, { LinkAsButton } from "./Link"
import Arrow from "../../images/icons/arrow.svg"

import { useProduct } from "../../hooks/useProductData"

export const ButtonAsButton = styled.button`
  background-color: ${({ background, disabled }) =>
    disabled ? `var(--gray)` : background?.colour || `var(--black)`};
  border: none;
  border-radius: 0;
  color: ${({ text }) => text?.colour || "var(--white)"};
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 45px;
  letter-spacing: 0.4px;
  min-height: 35px;
  min-width: 175px;
  padding: 0 2em;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.25s;
  width: ${({ flex }) => (flex ? "100%" : "auto")};

  &:hover {
    background-color: ${({ background }) => background?.hover || `var(--gray)`};
    color: ${({ text }) => text?.hoverColour || `var(--white)`};
  }
`

export const ButtonAsLink = styled(({ colour, hoverColour, flex, ...rest }) => (
  <Link {...rest} />
))`
  background-color: ${({ background, disabled }) =>
    disabled ? `var(--gray)` : background?.colour || `var(--black)`};
  border: none;
  border-radius: 0;
  box-sizing: border-box;
  color: ${({ text }) => text?.colour || "var(--white)"};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 45px;
  letter-spacing: 0.4px;
  min-height: 35px;
  min-width: 150px;
  padding: 0 2em;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.25s;
  width: ${({ flex }) => (flex ? "100%" : "auto")};

  &:hover {
    background-color: ${({ background }) => background?.hover || `var(--gray)`};
    color: ${({ text }) => text?.hoverColour || `var(--white)`};
  }
`

export const ArrowButton = styled(({ colour, hoverColour, ...rest }) => (
  <LinkAsButton {...rest} />
))`
  color: ${({ colour }) => colour || `var(--white)`};
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 0.75em 2em;

  display: flex;
  align-items: center;

  :hover {
    color: ${({ hoverColour }) => hoverColour || `#a6acaf !important`};
  }
`

export const ArrowLink = styled(({ colour, hoverColour, ...rest }) => (
  <Link {...rest} />
))`
  color: ${({ colour }) => colour || `var(--white)`};
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  display: flex;
  align-items: center;

  :hover {
    color: ${({ hoverColour }) => hoverColour || `#a6acaf !important`};
  }
`

export const ButtonContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: ${({ align }) => align.mobile || "center"};

  @media (min-width: 800px) {
    align-items: ${({ align }) => align.desktop || "center"};
  }
`

export function BuyButton({
  kind = null,
  type = "WpSimpleProduct",
  selected = {},
  selectedQty = 1,
  stockStatus = "IN_STOCK",
  stockQuantity = null,
  children,
}) {
  const { selected: selectedCurrency } = useCurrency()
  const [addToCart, { loading, error }] = useAddToCart({
    variables: {
      input: {
        productId: selected.productId,
        ...(selected.variationId && { variationId: selected.variationId }),
        quantity: selectedQty,
      },
    },
  })
  const { dispatchLayout } = useLayout()
  const { setVariation } = useProduct()

  const handleClick = async () => {
    if (type === "WpVariableProduct" && selected.variationId === 0) {
      const selectVariations = document.querySelector("#product-variations")

      selectVariations.scrollIntoView(false)
      selectVariations.focus()
    } else {
      const {
        data: {
          addToCart: {
            cartItem: {
              product: { node: product },
            },
          },
        },
      } = await addToCart()

      if (product) {
        trackAddToCart(
          { ...product, uri: window?.location?.pathname },
          1,
          selectedCurrency
        )
        setVariation(0, "") // Reset global state
      }

      dispatchLayout({ type: LAYOUT_STATE.cart, payload: true })
      typeof window !== "undefined" && window.scrollTo(0, 0)
    }
  }

  if (kind === "arrow")
    return (
      <>
        <ArrowButton
          type="button"
          disabled={
            loading ||
            selectedQty > stockQuantity ||
            stockStatus === "OUT_OF_STOCK"
          }
          onClick={() => handleClick()}
        >
          <span style={{ marginRight: "9px" }}>
            {loading
              ? "Adding..."
              : stockStatus === "IN_STOCK"
              ? children
              : stockStatus === "OUT_OF_STOCK"
              ? "Sold Out"
              : null}
          </span>
          <Arrow className="arrow" />
        </ArrowButton>
        {/* TODO: Add proper error boundary styling here */}
        {error && <span dangerouslySetInnerHTML={{ __html: error.message }} />}
      </>
    )

  if (kind === "text")
    return (
      <>
        <ButtonAsButton
          type="button"
          disabled={
            loading ||
            selectedQty > stockQuantity ||
            stockStatus === "OUT_OF_STOCK"
          }
          onClick={() => handleClick()}
        >
          {loading
            ? "Adding..."
            : stockStatus === "IN_STOCK"
            ? children
            : stockStatus === "OUT_OF_STOCK"
            ? "Sold Out"
            : null}
        </ButtonAsButton>
        {/* TODO: Add proper error boundary styling here */}
        {error && <span dangerouslySetInnerHTML={{ __html: error.message }} />}
      </>
    )
}
