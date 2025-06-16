import React from "react"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import styled from "styled-components"
import Modal from "../Modal/Modal"
import CustomizeModal from "../Modal/CustomizeModal"

const CustomizeButton = styled.button`
  background-color: transparent;
  border: ${({ theme }) =>
    theme === "dark" ? "1px solid var(--white)" : "1px solid #767676"};
  border-radius: 0;
  color: ${({ theme }) => (theme === "dark" ? "#dddddd" : "#818181")};
  cursor: pointer;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 40px;
  letter-spacing: 0.4px;
  height: 40px;
  min-height: 35px;
  min-width: 175px;
  margin: 20px 0 0;
  padding: 0 2em;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  text-align: center;
  text-transform: uppercase;
  transition: background-color 0.25s;
  width: ${({ flex }) => (flex ? "100%" : "auto")};

  &:hover {
    background-color: ${({ background }) => background?.hover || `var(--gray)`};
    color: ${({ text }) => text?.hoverColour || `var(--white)`};
  }
`

export default function Customize({ theme, flex = false }) {
  const { layoutState, dispatchLayout } = useLayout()

  return (
    <>
      <CustomizeButton
        theme={theme}
        flex={flex}
        onClick={() =>
          dispatchLayout({ type: LAYOUT_STATE.modal, payload: "customize" })
        }
      >
        Customize Watch
      </CustomizeButton>
      {layoutState.modalOpen && layoutState.modalType === "customize" && (
        <Modal>
          <CustomizeModal />
        </Modal>
      )}
    </>
  )
}
