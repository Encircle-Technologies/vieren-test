import React from "react"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { motion } from "framer-motion"
import LogoSmall from "../../images/logos/logo_modal_black.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

const Container = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 50px 25px 80px;
  position: relative;
  width: 100vw;

  @media (min-width: 800px) {
    padding: 40px 100px 80px;
    width: 700px;
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
  cursor: pointer;
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

const Heading = styled.h2`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 1px;
  margin: 0;
`

const Subheading = styled.p`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 34px;
  letter-spacing: 0.5px;
  margin: 0 0 28px;
  text-align: center;
`

const CanFlag = styled(require("../../images/icons/can-flag.svg"))`
  height: 33px;
  width: auto;
  margin: 0 0 20px;
`

const Button = styled.button`
  background-color: transparent;
  border: 1px solid #767676;
  border-radius: 0;
  color: var(--gray);
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.4px;
  min-height: 35px;
  min-width: 300px;
  padding: 0;
  margin: 0 0 50px;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.5;
  }
`

const TextButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: #3e3b3a;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 2.5;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`

const Arrow = styled(require("../../images/icons/arrow.svg"))`
  height: 12px;
  width: auto;
  margin: 0 0 0 3ch;
`

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

export default function Geography({ close = () => {} }) {
  const { setSelected, ready } = useCurrency()

  return (
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
        <LogoSmall style={{ height: "25px", marginBottom: "40px" }} />
      </Header>
      <Heading>Hello There</Heading>
      <Subheading>Looks like you're in Canada</Subheading>
      <CanFlag />
      <Button
        type="button"
        onClick={() => {
          setSelected("CAD")
          close()
        }}
        disabled={!ready}
      >
        Shop Canadian Store
      </Button>
      <TextButton
        type="button"
        onClick={() => {
          setSelected("USD")
          close()
        }}
      >
        Continue to the US Store
        <Arrow />
      </TextButton>
    </Container>
  )
}
