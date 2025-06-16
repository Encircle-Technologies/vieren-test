import React, { useRef, useState, useEffect } from "react"
import styled from "styled-components"

const Container = styled.div`
  position: relative;
`

const Button = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;

  position: relative;
  width: 30px;
  height: 30px;

  &::after {
    background-color: var(--gray);
    clip-path: circle(50% at center);
    color: var(--white);
    content: "?";
    display: flex;
    align-items: center;
    justify-content: center;
    height: 14px;
    width: 14px;

    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
`

const Dialog = styled.div`
  background-color: var(--black);
  color: var(--white);
  display: flex;
  flex-direction: column;
  padding: 12px 20px;

  position: absolute;
  width: 196px;
  top: 35px;
  left: -50px;
  /* transform: translateX(-50%); */
  z-index: 2;

  &::before {
    position: absolute;
    top: -7px;
    left: 58px;

    background-color: var(--black);
    content: "";
    display: block;
    height: 15px;
    width: 15px;
    transform: rotate(45deg);

    @media (min-width: 1024px) {
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  p,
  span {
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.61px;
  }

  @media (min-width: 1024px) {
    left: 50%;
    transform: translateX(-50%);
  }
`

export default function Info({ text }) {
  const [isOpen, setOpen] = useState(false)

  return (
    <Container className="info-toggle">
      <Button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        type="button"
        onClick={() => {
          setOpen(prevState => (prevState === false ? true : false))
        }}
      />
      {isOpen && <Dialog>{text}</Dialog>}
    </Container>
  )
}
