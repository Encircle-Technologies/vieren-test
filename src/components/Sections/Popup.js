import React, { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import { useInView } from "react-intersection-observer"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import CloseIcon from "../../images/icons/gallery-close.svg"

const Background = styled(motion.div)`
  background-color: var(--black);

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
`

const PopupWrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
`

const MenuToggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;

  position: absolute;
  top: calc(1 / 60 * 100vw);
  right: calc(1 / 30 * 100vw);
  z-index: 11;
`

const Close = styled(CloseIcon)`
  g {
    fill: var(--white);
    stroke: var(--white);
  }
`

const background = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
}

const wrapper = {
  closed: {
    y: "100%",
    transition: { ease: "easeInOut", duration: 1.2 },
  },
  open: {
    y: 0,
    transition: { ease: "easeInOut", duration: 1.2 },
  },
}

// let scrollPosition = 0

export default function Popup({ children }) {
  const [root, setRoot] = useState()
  // const [footerRef, footerInView] = useInView()
  const [sectionRef, sectionInView] = useInView()
  // const popupCount = useRef(0)
  // const [isOpen, setOpen] = useState(false)
  const { layoutState, dispatchLayout, modalCount } = useLayout()

  // const hasDocument = typeof document !== "undefined"

  const handleClose = useCallback(() => {
    dispatchLayout({ type: LAYOUT_STATE.modal, payload: false })
  }, [dispatchLayout])

  useEffect(() => {
    setRoot(document.getElementById("modal-root"))
  }, [])

  // useEffect(() => {
  //   const footerEl = hasDocument && document.querySelector("#main-footer")

  //   footerEl && footerRef(footerEl)
  // }, [footerRef, hasDocument])

  useEffect(() => {
    if (sectionInView && modalCount.current < 1) {
      dispatchLayout({ type: LAYOUT_STATE.modal, payload: "popup" })
      modalCount.current++
    }
  }, [sectionInView, dispatchLayout, modalCount])

  useEffect(() => {
    const handleEscape = event => {
      if (event.code === "Escape") handleClose()
    }

    document.addEventListener("keydown", handleEscape)

    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleClose])

  if (root)
    return (
      <>
        <div ref={sectionRef} />
        {createPortal(
          <AnimatePresence>
            {layoutState.modalOpen && layoutState.modalType === "popup" && (
              <>
                <Background
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={background}
                  onClick={() => handleClose()}
                />
                <PopupWrapper
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={wrapper}
                >
                  <MenuToggle
                    onClick={() => handleClose()}
                    aria-label="Close Popup"
                  >
                    <Close />
                  </MenuToggle>
                  {children}
                </PopupWrapper>
              </>
            )}
          </AnimatePresence>,
          root
        )}
      </>
    )

  return null
}
