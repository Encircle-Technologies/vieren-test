import React, { useState, useEffect } from "react"
import { useLocation } from "@reach/router"
import { parse } from "query-string"
import { useCurrency } from "../../hooks/useCurrency"
import styled from "styled-components"
import { LinkAsButton } from "../Elements/Link"
import Modal from "../Modal/Modal"
import Geography from "../Modal/Geography"

const Container = styled.div`
  position: relative;
  margin: 0 0 0 1ch;
`

const NavContainer = styled.div`
  display: flex;
  position: relative;
  margin: 0 0 15px;
  @media (min-width: 800px) {
    margin: 0 32px 0 0;
  }
`

const FlagContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.5ch 0 0;
`

const CanFlag = styled(require("../../images/icons/can-flag.svg"))`
  height: 10px;
  width: auto;
`

const UsFlag = styled(require("../../images/icons/us-flag.svg"))`
  height: 10px;
  width: auto;
`

const Dropdown = styled.div`
  border: 1px solid #dedede;
  display: block;
  min-width: 70px;
  position: relative;

  &::before {
    background: transparent;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;

    pointer-events: none;
  }
  &::after {
    content: "";
    display: block;
    border: 1px solid #000000;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg) translateY(-50%);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 38%;
    bottom: 0;
    right: 15px;

    pointer-events: none;
  }
`

const Select = styled.select`
  appearance: none;
  background: transparent;
  border: none;
  border-radius: 0;
  width: 100%;

  color: var(--black);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.78px;
  padding: 6px;
`

const Toggle = styled(LinkAsButton)``

const Menu = styled.div`
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  position: absolute;
  bottom: -72px;
  left: 50%;
  transform: translateX(-50%);
  &::before {
    position: absolute;
    top: -7px;
    left: 50%;
    background-color: #f2f2f2;
    content: "";
    display: block;
    height: 15px;
    width: 15px;
    transform: translateX(-50%) rotate(45deg);
  }
`

const Option = styled(LinkAsButton)`
  margin: 0 0 8px;
  &:last-child {
    margin: 0;
  }
`

export function Currency() {
  const { currencies, selected, setSelected, ready } = useCurrency()

  return (
    <Container>
      <Dropdown>
        <Select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          aria-label="Select currency"
          disabled={!ready}
        >
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </Dropdown>
    </Container>
  )
}

export function NavCurrency({ light }) {
  const [isOpen, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { currencies, selected, setSelected, ready } = useCurrency()
  const location = useLocation()
  const queryVars = parse(location.search)

  const outsideClickListener = event => {
    if (event.target.closest("#navcurrencytoggle") === null) {
      setOpen(false)
    }
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const showModalOn =
    location.pathname.includes("/shop/") ||
    location.pathname.includes("/watches/") ||
    location.pathname.includes("/accessories/")

  useEffect(() => {
    const localStorageValue = window?.localStorage.getItem("currency")

    const geolocate = () =>
      fetch("/.netlify/functions/geolocate")
        .then(response => response.json())
        .then(({ country }) => {
          if (
            country?.isoCode === "CA" &&
            location.pathname.includes("login") === false
          ) {
            setModalOpen(true)
          }
        })
        .catch(err => console.error(err))

    if (
      localStorageValue === null &&
      selected !== "CAD" &&
      !queryVars.defaultCurrency &&
      showModalOn
    ) {
      setTimeout(geolocate, 2000)
    }

    return () => clearTimeout(geolocate)
  }, [location.pathname])

  useEffect(() => {
    if (isOpen) {
      document && document.addEventListener("click", outsideClickListener)
    } else {
      document && document.removeEventListener("click", outsideClickListener)
    }

    return () =>
      document && document.removeEventListener("click", outsideClickListener)
  }, [isOpen])

  if (!isLoaded) {
    return (
      <NavContainer style={{ margin: 0 }}>
        <Toggle
          id="navcurrencytoggle"
          light={light}
          aria-label="Select Currency"
          disabled={true}
        >
          ...
        </Toggle>
      </NavContainer>
    )
  }

  return (
    <>
      <NavContainer style={{ margin: 0 }}>
        <Toggle
          id="navcurrencytoggle"
          light={light}
          onClick={() => setOpen(!isOpen)}
          aria-label="Select Currency"
          disabled={!ready}
        >
          {`$${selected}`}
        </Toggle>
        {isOpen && (
          <Menu>
            {currencies.map((currency, index) => (
              <Option
                light
                key={index}
                value={currency}
                onClick={e => {
                  setSelected(e.target.value)
                  setOpen(!isOpen)
                }}
              >
                {`$${currency}`}
              </Option>
            ))}
          </Menu>
        )}
      </NavContainer>
      {modalOpen && (
        <Modal close={() => setModalOpen(false)}>
          <Geography close={() => setModalOpen(false)} />
        </Modal>
      )}
    </>
  )
}

export function FooterCurrency({ light }) {
  const [isOpen, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { currencies, selected, setSelected, ready } = useCurrency()

  const outsideClickListener = event => {
    if (event.target.closest("#currencytoggle") === null) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document && document.addEventListener("click", outsideClickListener)
    } else {
      document && document.removeEventListener("click", outsideClickListener)
    }

    return () =>
      document && document.removeEventListener("click", outsideClickListener)
  }, [isOpen])

  return (
    <>
      <NavContainer>
        <FlagContainer>
          {selected === "CAD" && <CanFlag />}
          {selected === "USD" && <UsFlag />}
        </FlagContainer>
        <Toggle
          id="currencytoggle"
          light={light}
          onClick={() => setOpen(!isOpen)}
          aria-label="Select Currency"
          disabled={!ready}
        >
          {selected}
        </Toggle>
        {isOpen && (
          <Menu>
            {currencies.map((currency, index) => (
              <Option
                light
                key={index}
                value={currency}
                onClick={e => {
                  setSelected(e.target.value)
                  setOpen(!isOpen)
                }}
              >
                {currency}
              </Option>
            ))}
          </Menu>
        )}
      </NavContainer>
    </>
  )
}
