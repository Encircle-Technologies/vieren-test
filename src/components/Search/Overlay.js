import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import Bar from "./Bar"
import Logo from "../../images/logos/logo_black_small.svg"

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
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 0 55px;

  @media (min-width: 800px) {
    padding: 50px 0 60px;
  }
`

const ResponsiveLogo = styled(Logo)`
  height: 25px;
  width: auto;

  @media (min-width: 800px) {
    height: 30px;
  }
`

const ButtonWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 7px;

  @media (min-width: 800px) {
    top: 50px;
    right: calc(1 / 24 * 100vw);
  }

  @media (min-width: 1280px) {
  }
`

const Close = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;

  height: 44px;
  width: 44px;
  padding: 0;

  position: relative;

  &::before,
  &::after {
    background-color: var(--black);
    content: "";
    display: block;
    height: 2px;
    width: 23px;
    position: absolute;
    top: 50%;
    left: 50%;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(135deg);
  }
`

const Body = styled.div`
  padding: 0 0 70px;
  width: calc(100% - 3 / 24 * 100vw);

  @media (min-width: 1280px) {
    width: 60%;
  }
`

const background = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
}

const container = {
  hidden: { height: 0 },
  visible: {
    height: "auto",
    transition: {
      height: { stiffness: 1000, mass: 100, damping: 100, velocity: -100 },
      delayChildren: 0.5,
    },
  },
}

const button = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function Overlay({ close = () => {} }) {
  return (
    <>
      <Background
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={background}
        onClick={close}
      />
      <Container
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={container}
      >
        <Header>
          <ResponsiveLogo />
        </Header>
        <ButtonWrapper variants={button}>
          <Close onClick={() => close()} />
        </ButtonWrapper>
        <Body>
          <Bar />
        </Body>
      </Container>
    </>
  )
}
