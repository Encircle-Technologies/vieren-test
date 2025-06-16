import React, { useRef, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { motion } from "framer-motion"
import LogoSmall from "../../images/logos/logo_modal_black.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

const ModalContainer = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  padding: 50px 25px;

  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  @media (min-width: 800px) {
    padding: 40px 50px;
    width: 800px;
  }

  @media (min-width: 1024px) {
    width: 840px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 50px;
  max-width: 485px;
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
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 1.2px;
  margin: 0;
  text-align: center;
  text-transform: uppercase;

  @media (min-width: 800px) {
    font-size: 30px;
    line-height: 35px;
    letter-spacing: 1.5px;
  }
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Legend = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 20px 0 0;
`

const Description = styled.p`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.88px;
  margin: 0;

  a {
    font-weight: inherit;
  }
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

function getScrollParent(node) {
  if (node == null) {
    return null
  }

  if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollParent(node.parentNode)
  }
}

export default function EngravingIdeasModal({ handleClose }) {
  const elRef = useRef(null)
  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    if (isBrowser && elRef.current) {
      elRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }, [isBrowser])

  return (
    <ModalContainer
      ref={elRef}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={container}
    >
      <CloseButton type="button" onClick={handleClose}>
        <CloseIcon />
      </CloseButton>
      <Header>
        <LogoSmall style={{ height: "25px", margin: "0 0 40px" }} />
        <Heading>Engraving Ideas</Heading>
      </Header>
      <ModalBody>
        <Box>
          <StaticImage
            src="../../images/mock/engraving-1.jpg"
            alt="Engrave with initials"
          />
          <Legend>Initials</Legend>
          <Description>Monogram watch with your name</Description>
        </Box>
        <Box>
          <StaticImage
            src="../../images/mock/engraving-2.jpg"
            alt="Engrave with dates"
          />
          <Legend>Dates</Legend>
          <Description>Mark watch with special days</Description>
        </Box>
        <Box>
          <StaticImage
            src="../../images/mock/engraving-3.jpg"
            alt="Engrave with message"
          />
          <Legend>Message</Legend>
          <Description>Engrave watch with a special message</Description>
        </Box>
        <Box>
          <StaticImage
            src="../../images/mock/engraving-4.jpg"
            alt="Request custom engraving"
          />
          <Legend>Special Requests</Legend>
          <Description>
            <a
              href="mailto:hello@vieren.co?subject=Request%Custom%Engraving"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Email us
            </a>{" "}
            for custom engraving
          </Description>
        </Box>
      </ModalBody>
    </ModalContainer>
  )
}
