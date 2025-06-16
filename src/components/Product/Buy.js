import React from "react"
import styled from "styled-components"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import useAddToCart from "../../hooks/useAddToCart"
import { useProduct } from "../../hooks/useProductData"
import { useCurrency } from "../../hooks/useCurrency"
import { trackAddToCart } from "../../utils/analytics/gtag"
import { ButtonAsButton } from "../Elements/Button"
import Subscribe from "../Forms/Subscribe"
import { Error } from "../Forms/RHF/Elements"

const BuyButton = styled(ButtonAsButton)`
  background-color: ${({ $theme, background, disabled }) => {
    if (!$theme) {
      return disabled
        ? `var(--gray)`
        : background?.colour
        ? background?.colour
        : `var(--black)`
    }
    return $theme === "dark" ? "#767676" : "var(--black)"
  }};
  font-size: 14px;
  letter-spacing: 0.47px;
  margin-top: 15px;
  min-height: 45px;
  width: ${({ main }) => (main ? "100%" : "auto")};

  ${({ fixed }) =>
    fixed &&
    `
    min-height: 50px;
    position: fixed;
    bottom: 0;
    left: var(--border);
    width: calc(100% - 2 * var(--border));
    z-index: 100;
  `}
`

function processError(message) {
  if (message.includes("You cannot add that amount to the cart")) {
    return "Not enough stock to perform this action"
  }

  if (message.includes("because the product is out of stock")) {
    return "Product appears to be out of stock"
  }

  return JSON.stringify(message, null, 2)
}

export default function Buy({
  theme,
  main = null,
  type = "simple",
  background,
  text,
  selected = {},
  selectedQty = null,
  stockStatus = "IN_STOCK",
  stockQuantity = null,
  extraData = "",
  children,
  callback,
  fixed = false,
  disabled,
  ...props
}) {
  const { selected: selectedCurrency } = useCurrency()
  const [addToCart, { loading, error }] = useAddToCart({
    variables: {
      input: {
        productId: selected.productId,
        ...(selected.variationId && { variationId: selected.variationId }),
        quantity: selectedQty,
        extraData,
      },
    },
  })
  const { setError, setVariation } = useProduct()
  const { dispatchLayout } = useLayout()

  const handleClick = async () => {
    if (type === "variable" && selected.variationId === 0) {
      const selectVariations = document.querySelector("#product-variations")

      selectVariations.scrollIntoView({ behaviour: "smooth", block: "center" })

      setError("Please select a size")
    } else {
      try {
        const {
          data: {
            addToCart: {
              // cart,
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
          setVariation(0, "")
        }

        if (callback) {
          callback()
        }

        dispatchLayout({ type: LAYOUT_STATE.cart, payload: true })
        typeof window !== "undefined" && window.scrollTo(0, 0)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <>
      {stockStatus === "OUT_OF_STOCK" ? (
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <Subscribe
            isPdp={true}
            disclaimer={{
              colour: {
                mobile: "#4d4d4d",
                desktop: "#4d4d4d",
              },
              text: "",
            }}
            button={{
              background: {
                colour: {
                  mobile: "var(--gray)",
                  desktop: "var(--gray)",
                },
                hoverColour: {
                  mobile: "var(--black)",
                  desktop: "var(--black)",
                },
              },
              text: {
                colour: {
                  mobile: "var(--white)",
                  desktop: "var(--white)",
                },
                hoverColour: {
                  mobile: "var(--white)",
                  desktop: "var(--white)",
                },
                content: "Notify Me",
              },
            }}
            tag={`Waitlist`}
          />
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <BuyButton
            flex
            $theme={theme || null}
            main={main}
            fixed={fixed}
            background={background}
            text={text}
            {...props}
            type="button"
            disabled={
              disabled ||
              loading ||
              selectedQty > stockQuantity ||
              stockStatus === "OUT_OF_STOCK"
              // || (type === "WpVariableProduct" && selected.variationId === 0)
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
          </BuyButton>
          {error && <Error $inline>{processError(error.message)}</Error>}
        </div>
      )}
    </>
  )
}
