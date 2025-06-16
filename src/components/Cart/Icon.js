import React from "react"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import { useCart } from "../../hooks/useCart"
import styled from "styled-components"
import CartIcon from "../../images/icons/cart.svg"

const Button = styled.button`
  background: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  display: block;
  margin: 0;
  padding: 0;

  position: relative;

  height: 15px;
  width: 12px;
`

const ResponsiveCartIcon = styled(({ light, empty, ...rest }) => (
  <CartIcon {...rest} />
))`
  color: ${({ light }) => (light ? "black" : "white")};

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  rect {
    fill: ${({ empty }) => empty && "none"};
  }
`

const ItemCount = styled.span`
  color: ${({ light }) => (light ? "var(--white)" : "var(--black)")};
  font-family: "Lato", san-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 18px;
  letter-spacing: 0.45px;

  position: absolute;
  top: 62%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`

export default function Icon({ light }) {
  const { dispatchLayout } = useLayout()
  const { data, loading, error } = useCart({ fetchPolicy: "cache-first" })

  if (!data)
    return (
      <Button aria-label="View Cart">
        <ResponsiveCartIcon light={light} empty={true} />
      </Button>
    )
  if (loading || error)
    return (
      <Button aria-label="View Cart">
        <ResponsiveCartIcon light={light} empty={false} />
        <ItemCount>{loading ? "..." : "#"}</ItemCount>
      </Button>
    )

  const {
    cart: {
      isEmpty,
      contents: { itemCount },
    },
  } = data

  return (
    <Button
      onClick={() => {
        dispatchLayout({ type: LAYOUT_STATE.cart, payload: true })
        typeof window !== "undefined" && window.scrollTo(0, 0)
      }}
      aria-label="View Cart"
    >
      <ResponsiveCartIcon light={light} empty={isEmpty} />
      {!isEmpty && <ItemCount light={light}>{itemCount}</ItemCount>}
    </Button>
  )
}
