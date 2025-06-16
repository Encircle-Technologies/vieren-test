import React, { useState, useEffect, useCallback } from "react"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { motion } from "framer-motion"

const Background = styled(motion.div)`
  background-color: var(--black);
  cursor: pointer;

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1001;
  overflow-y: scroll;

  @media (min-width: 800px) {
    top: 10vw;
    left: 50%;
    bottom: unset;
    right: unset;
    max-height: calc(100vh - 10vw);
    transform: translate3d(-50%, -5vw, 0);
  }
`

const ScrollableContainer = styled.div``

const background = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
}

export default function Modal({ children, close = () => {} }) {
  const [root, setRoot] = useState()
  // const [mounted, setMounted] = useState(false)
  const { dispatchLayout } = useLayout()

  const handleClose = useCallback(() => {
    dispatchLayout({ type: LAYOUT_STATE.modal, payload: false })
  }, [dispatchLayout])

  useEffect(() => {
    setRoot(document.getElementById("modal-root"))
  }, [])

  useEffect(() => {
    const handleEscape = event => {
      if (event.code === "Escape") handleClose()
    }

    document.addEventListener("keydown", handleEscape)

    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleClose])

  if (root)
    return createPortal(
      <>
        <Background
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={background}
          onClick={handleClose}
        />
        <Container>{children}</Container>
      </>,
      root
    )

  return null
}
