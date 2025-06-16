import React from "react"
import { useCart } from "../../hooks/useCart"
import styled from "styled-components"
import { motion } from "framer-motion"
import Contents from "./Contents"
import Summary from "./Summary"

import Logo from "../../images/logos/logo_white_small.svg"

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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
`

const Header = styled(motion.div)`
  background-color: var(--gray);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
`

const Body = styled(motion.div)`
  background-color: var(--white);
  padding: 30px 25px 80px;

  @media (min-width: 1280px) {
    padding: 30px 80px 80px;
  }
`

const Menu = styled.div`
  border-bottom: 1px solid #bbbbbb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px;
`

const Title = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0;
  text-transform: uppercase;

  @media (min-width: 800px) {
    font-size: 22px;
    line-height: 27px;
  }
`

const Count = styled.span``

const Toggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  height: 25px;
  width: 25px;
  padding: 0;
  position: relative;

  &::before,
  &::after {
    background-color: var(--black);
    content: "";
    display: block;
    height: 2px;
    width: 25px;

    position: absolute;
    top: 50%;
    left: 50%;
  }

  &::before {
    transform: translateX(-50%) translateY(-3px) rotate(45deg);
  }
  &::after {
    transform: translateX(-50%) translateY(-3px) rotate(135deg);
  }
`

const background = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
}

const container = {
  hidden: { transition: { when: "afterChildren", staggerDirection: -1 } },
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const header = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const body = {
  hidden: {
    height: 0,
    transition: { when: "afterChildren", staggerDirection: -1 },
  },
  visible: {
    height: "auto",
    transition: {
      height: {
        stiffness: 1000,
        mass: 100,
        damping: 100,
        velocity: -100,
      },
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
}

export default function Overlay({ close }) {
  const { data, loading, error, isRefetching } = useCart()

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
        <Header variants={header}>
          <Logo style={{ height: "30px" }} />
        </Header>
        <Body variants={body}>
          <Menu>
            <Title>
              Your Bag
              <Count>{` (${
                error ? `#` : loading ? `...` : data?.cart.contents.itemCount
              })`}</Count>
            </Title>
            <Toggle onClick={close} />
          </Menu>
          <Contents cart={data?.cart} isRefetching={isRefetching} />
          <Summary
            cart={data?.cart}
            close={close}
            isRefetching={isRefetching}
          />
        </Body>
      </Container>
    </>
  )
}
