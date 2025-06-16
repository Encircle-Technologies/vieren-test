import React, { useRef, useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import styled from "styled-components"
import Grid from "./Grid"
import { NavPrimary, NavSecondary, NavMobile, NavDrawer } from "./Navigation"
import SiteIdentity from "./SiteIdentity"
import SiteMessage from "./SiteMessage"
import CartOverlay from "../Cart/Overlay"
// import { Overlay as ModalOverlay } from "../Modal"
import VierenLogo from "../../images/logos/logo_white.svg"
import VierenLogoSticky from "../../images/logos/logo_white_small.svg"

import Headroom from "react-headroom"
import { AnimatePresence } from "framer-motion"

import { useLocation } from "@reach/router"

import SearchOverlay from "../Search/Overlay"
// const SearchOverlay = lazy(() => import("../Search/Overlay"))

const Container = styled.header`
  .headroom {
    z-index: 10 !important;
  }
  .headroom-wrapper {
    margin: 0 0 -101px;
    min-height: 101px;
    z-index: 99;

    @media (min-width: 800px) {
      margin: 0 0 -141px;
      min-height: 141px;
    }
  }
`

const HeaderWrapper = styled.div`
  /* Formatting */
  background: ${({ transparent }) =>
    transparent ? "none" : "rgba(0,0,0,0.7)"};
  padding: ${({ transparent }) => (transparent ? "20px 0" : "10px 0")};

  @media (min-width: 800px) {
    padding: 20px 0;
  }
`

const Content = styled.div`
  display: flex;
  align-items: ${({ transparent }) => (transparent ? "flex-start" : "center")};
  justify-content: space-between;

  min-height: ${({ transparent }) => (transparent ? "50px" : "25px")};
`

const ResponsiveLogo = styled(VierenLogo)`
  display: block;
  fill: ${({ $headerStyle }) =>
    $headerStyle === "light"
      ? "black"
      : $headerStyle === "dark"
      ? "white"
      : "white"};
  height: 50px;

  @media (min-width: 800px) {
    height: 75px;
  }
`
const ResponsiveLogoSticky = styled(VierenLogoSticky)`
  display: block;
  height: 25px;

  @media (min-width: 800px) {
    height: 35px;
  }
`

const Header = ({ headerStyle, product }) => {
  const location = useLocation()

  const pathRef = useRef("")
  const [isOpen, setOpen] = useState(false)
  const [messageClose, setMessageClose] = useState(false)
  const [active, setActive] = useState({ title: null, links: null })
  const { layoutState, dispatchLayout } = useLayout()

  const [topOfDocRef, transparent] = useInView({
    rootMargin: "100px 0px 100px 0px",
    threshold: 0,
    initialInView: true,
  })

  useEffect(() => {
    const topOfDocEl =
      typeof window !== "undefined" &&
      document.querySelector("#top-of-document")

    topOfDocEl && topOfDocRef(topOfDocEl)
  }, [topOfDocRef])

  useEffect(() => {
    if (
      location.pathname !== pathRef.current &&
      layoutState[LAYOUT_STATE.search]
    ) {
      dispatchLayout({ type: LAYOUT_STATE.search, payload: false })
      pathRef.current = location.pathname
    }
  }, [layoutState, dispatchLayout, location])

  const handleClick = item => {
    if (!isOpen) {
      setOpen(true)
    }

    return setActive(item)
  }

  return (
    <Container>
      {!messageClose && (
        <SiteMessage handleClose={() => setMessageClose(true)} />
      )}
      <Headroom pinStart={200}>
        <HeaderWrapper isOpen={isOpen} transparent={transparent}>
          <Grid>
            <Content>
              <NavMobile
                light={transparent && headerStyle === "light"}
                setOpen={setOpen}
              />
              <NavPrimary
                light={transparent && headerStyle === "light"}
                size="desktop"
                handleClick={handleClick}
              />
              <SiteIdentity
                transparent={transparent}
                width="122px"
                title="VIEREN"
              >
                {transparent ? (
                  <ResponsiveLogo $headerStyle={headerStyle} />
                ) : (
                  <ResponsiveLogoSticky />
                )}
              </SiteIdentity>
              <NavSecondary light={transparent && headerStyle === "light"} />
            </Content>
          </Grid>
        </HeaderWrapper>
        <div id="product-bar"></div>
      </Headroom>
      <AnimatePresence>
        {isOpen && (
          <NavDrawer
            setOpen={setOpen}
            handleClick={handleClick}
            active={active}
          />
        )}
        {layoutState[LAYOUT_STATE.cart] && (
          <CartOverlay
            key="cartModal"
            close={() =>
              dispatchLayout({ type: LAYOUT_STATE.cart, payload: false })
            }
          />
        )}
        {/* <Suspense fallback={null}> */}
        {layoutState[LAYOUT_STATE.search] && (
          <SearchOverlay
            key="searchModal"
            close={() =>
              dispatchLayout({ type: LAYOUT_STATE.search, payload: false })
            }
          />
        )}
        {/* </Suspense> */}
        {/* {layoutState[LAYOUT_STATE_modal] && (
          <ModalOverlay
            key="exitModal"
            close={() => setModalOpen(false)}
            pathname={pathname}
            product={product}
          />
        )} */}
      </AnimatePresence>
    </Container>
  )
}

export default Header
