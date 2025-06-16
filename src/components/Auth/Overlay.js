import React, { useState } from "react"
import { navigate, graphql, useStaticQuery } from "gatsby"
import { greeting } from "../../utils/time"
import styled from "styled-components"
import { motion } from "framer-motion"
import Login from "./Login"
import Register from "./Register"
import ForgotPassword from "./ForgotPassword"
import { BackgroundImage } from "../Elements/Image"
import { H2 } from "../Elements/H2"
import { LinkAsButton } from "../Elements/Link"
import LogoSmall from "../../images/logos/logo_black_small.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

const Background = styled(motion.div)`
  background-color: var(--black);
  opacity: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
`

const BgImage = styled(BackgroundImage)`
  height: 100vh;
  width: 100vw;
`

const Container = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  /* min-width: 50%; */

  padding: 50px 25px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;

  @media (min-width: 1024px) {
    top: 10%;
    /* left: 10%;
    right: 10%; */
    max-width: 740px;
    margin: 0 auto 80px;
    padding: 40px 130px 80px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;

  position: absolute;
  top: 20px;
  right: 20px;

  svg {
    display: block;
    height: 20px;
    width: 20px;

    g {
      fill: var(--black);
    }
  }
`

const Nav = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0 46px;
`

const NavButton = styled(LinkAsButton)`
  text-transform: uppercase;

  margin-right: 40px;

  &:last-child {
    margin-right: 0;
  }

  &::after {
    width: ${({ active }) => (active ? "100%" : "0")};
  }
`

const Greeting = styled(H2)`
  margin: 0 0 30px;
`

const methods = {
  LOGIN: "login",
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot_password",
  RESET_PASSWORD: "reset_password",
}

export default function Overlay({ type }) {
  // const { desktop, mobile } = useStaticQuery(graphql`
  //   query GET_OVERLAY_IMAGES {
  //     desktop: file(relativePath: { eq: "mock/vieren-stories-desktop.jpg" }) {
  //       childImageSharp {
  //         # gatsbyImageData(
  //         #   backgroundColor: "#dedede"
  //         #   layout: FULL_WIDTH
  //         #   breakpoints: [360, 720, 1080, 1366, 1920]
  //         #   # outputPixelDensities: [0.25, 0.5, 1, 2, 3]
  //         #   placeholder: NONE
  //         #   quality: 90
  //         # )
  //       }
  //     }
  //     mobile: file(relativePath: { eq: "mock/vieren-stories-mobile.jpg" }) {
  //       childImageSharp {
  //         # gatsbyImageData(
  //         #   backgroundColor: "#dedede"
  //         #   layout: FULL_WIDTH
  //         #   breakpoints: [360, 720, 1080, 1366, 1920]
  //         #   # outputPixelDensities: [0.25, 0.5, 1, 2, 3]
  //         #   placeholder: NONE
  //         #   quality: 90
  //         # )
  //       }
  //     }
  //   }
  // `)

  const [method, setMethod] = useState(type)

  return (
    <>
      <Background>
        <BgImage
          source={{
            desktop: {
              altText: "background",
              localFile: {
                childImageSharp: desktop.childImageSharp,
              },
            },
            mobile: {
              altText: "background",
              localFile: {
                childImageSharp: mobile.childImageSharp,
              },
            },
          }}
        />
      </Background>
      <Container>
        <CloseButton type="button" onClick={() => navigate("/")}>
          <CloseIcon />
        </CloseButton>
        <Header>
          <LogoSmall />
          <Nav>
            <NavButton
              light
              type="button"
              onClick={() => setMethod(methods.LOGIN)}
              active={method === methods.LOGIN}
            >
              Login
            </NavButton>
            <NavButton
              light
              type="button"
              onClick={() => setMethod(methods.REGISTER)}
              active={method === methods.REGISTER}
            >
              Register
            </NavButton>
          </Nav>
          <Greeting>{`Good ${greeting()}`}</Greeting>
        </Header>
        {method === methods.LOGIN && (
          <Login onForgotPassword={() => setMethod(methods.FORGOT_PASSWORD)} />
        )}
        {method === methods.REGISTER && <Register />}
        {method === methods.FORGOT_PASSWORD && <ForgotPassword />}
      </Container>
    </>
  )
}
