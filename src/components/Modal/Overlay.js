import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { motion } from "framer-motion"
import styled from "styled-components"
import { Subscribe } from "../Forms"
import { H2 } from "../Elements/H2"
import { P } from "../Elements/P"
import { ButtonAsLink } from "../Elements/Button"
import LogoSmall from "../../images/logos/logo_black_small.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

const Background = styled(motion.div)`
  background-color: var(--black);

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
`

const Container = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 50px 25px 80px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1001;

  @media (min-width: 800px) {
    padding: 40px 15% 80px;
    top: 50%;
    left: 50%;
    width: unset;
    transform: translate3d(-50%, -50%, 0);
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 60px;
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

const Title = styled(H2)`
  min-width: 320px;
  text-align: center;

  @media (min-width: 800px) {
    min-width: 470px;
  }
`

const Description = styled(P)`
  margin: 0 0 30px;
  min-width: 320px;
  text-align: center;

  @media (min-width: 800px) {
    min-width: 470px;
  }
`

const background = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
}

const container = {
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren", staggerDirection: -1 },
  },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

function EmailCapture() {
  return (
    <>
      <Title>Power Your Time</Title>
      <Description>
        Start 2021 with momentum and be first in line for our upcoming leather
        launch next season!
      </Description>
      <Subscribe
        textColourMobile="#000000"
        textColourDesktop="#000000"
        disclaimer="By joining the list you agree to receive emails from VIEREN"
        button={{
          backgroundColour: "#4d4d4d",
          textColour: "#ffffff",
          text: "Join Our Community",
        }}
      />
    </>
  )
}

function GiftGuide({ close }) {
  const { desktopImage } = useStaticQuery(graphql`
    {
      desktopImage: file(
        relativePath: { eq: "mock/box-with-watch-v-3@3x.jpg" }
      ) {
        childImageSharp {
          gatsbyImageData(
            backgroundColor: "#dedede"
            layout: FULL_WIDTH
            breakpoints: [360, 720, 1080, 1366, 1920]
            placeholder: NONE
            quality: 90
          )
        }
      }
    }
  `)

  return (
    <>
      {/* <GiftImage fluid={desktopImg} /> */}
      <Title>Celebrate With Vieren</Title>
      <Description>
        This holiday season, give the gift of time and we’ll give back $100 to
        support local entrepreneurs and creatives.
      </Description>
      <ButtonAsLink
        to="/stories/holiday-gift-guide-2020"
        onClick={() => close()}
      >
        Explore Holiday Gift Guide
      </ButtonAsLink>
    </>
  )
}

export default function Overlay({ close, pathname, product }) {
  return (
    <>
      <Background
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={background}
        onClick={() => close()}
      />
      <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={container}
      >
        <CloseButton type="button" onClick={() => close()}>
          <CloseIcon />
        </CloseButton>
        <Header>
          <LogoSmall />
        </Header>
        {pathname.includes("/shop") ? (
          <GiftGuide close={close} />
        ) : (
          <EmailCapture />
        )}
      </Container>
    </>
  )
}
