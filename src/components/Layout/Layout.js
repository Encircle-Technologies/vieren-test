import React from "react"
import { LayoutProvider } from "../../hooks/useLayout"
import styled from "styled-components"
import GlobalStyles from "../../styles/GlobalStyles"
import NormalizeStyles from "../../styles/NormalizeStyles"
import Header from "./Header"
import FooterBar from "../Sections/FooterBar"
import Footer from "./Footer"
import CookieBanner from "../CookieConsent/CookieConsent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Content = styled.main`
  background-color: ${process.env.NODE_ENV === "development"
    ? "var(--white)"
    : "transparent"};
  flex-grow: 1;
`

const Layout = ({ children, headerStyle, product }) => {
  return (
    <LayoutProvider>
      <NormalizeStyles />
      <GlobalStyles />
      <Container>
        <div id="top-of-document" />
        <Header headerStyle={headerStyle} product={product} />
        <Content>{children}</Content>
        <FooterBar />
        <Footer />
        <CookieBanner />
      </Container>
      <div id="modal-root" />
    </LayoutProvider>
  )
}

export default Layout
