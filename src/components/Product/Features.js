import React, { useState } from "react"
import styled from "styled-components"
import { motion, AnimatePresence, useCycle } from "framer-motion"
import { H2 } from "../Elements/H2"
import { P } from "../Elements/P"
import CloseIcon from "../../images/icons/menu-close.svg"
// import CloseIcon from "../../images/icons/gallery-close.svg"

const Container = styled.div`
  display: flex;
  justify-content: ${({ count }) => (count <= 1 ? "center" : "space-between")};
`

const Feature = styled.button`
  background: none;
  border: none;
  border-radius: 0;
  color: var(--black);
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  margin: 0;
  padding: 0;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.61px;
  }

  position: relative;

  &::after {
    border-bottom: 1px solid var(--black);
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:focus {
    outline: none;
  }

  &:hover::after {
    width: 100%;
  }
`

const Overlay = styled(motion.div)`
  position: absolute;
  top: -1px;
  left: -1px;
  width: 101%;
  height: 101%;

  background: var(--white);
  box-sizing: border-box;
  display: flex;
  flex-direction: Column;
  justify-content: center;
  align-items: flex-start;
`

const MenuToggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;

  position: absolute;
  top: calc(1 / 24 * 100vw);
  right: 0;

  @media (min-width: 1024px) {
    top: 0;
  }
`

const Close = styled(CloseIcon)`
  fill: var(--black);
  height: 20px;
  width: 20px;

  g {
    fill: var(--black);
  }
`

const OverlayTitle = styled(H2)`
  line-height: 48px;
  letter-spacing: 0.5px;
`

const OverlayDescription = styled(P)``

const overlay = {
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
  closed: { opacity: 0 },
}

const text = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
}

export default function Features({ features = [], fixed = false }) {
  const [open, toggleOpen] = useCycle(false, true)
  const [feature, setFeature] = useState(null)

  if (fixed) return null

  return (
    <>
      <Container count={features?.length}>
        {features
          .sort((a, b) => b.name.localeCompare(a.name))
          .map(feat => (
            <Feature
              key={feat.name}
              onClick={() => {
                setFeature(feat)
                toggleOpen()
              }}
            >
              {feat.name}
            </Feature>
          ))}
      </Container>
      <AnimatePresence>
        {open && (
          <Overlay
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlay}
          >
            <MenuToggle onClick={() => toggleOpen()}>
              <Close />
            </MenuToggle>
            <OverlayTitle variants={text}>{feature.name}</OverlayTitle>
            <OverlayDescription
              dangerouslySetInnerHTML={{ __html: feature.description }}
              variants={text}
            />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  )
}
