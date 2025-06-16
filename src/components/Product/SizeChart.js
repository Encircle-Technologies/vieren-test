import React, { useState, useRef, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { motion } from "framer-motion"
import Modal from "../Modal/Modal"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import LogoSmall from "../../images/logos/logo_modal_black.svg"
import CloseIcon from "../../images/icons/menu-close.svg"

import { useProductContent } from "../../hooks/useProductContent"
import { CheckboxElement } from "../Forms/RHF/CheckboxInput"

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  /* margin: 0 0 17px; */
  /* margin: ${({ hasCustomizations }) =>
    hasCustomizations ? "0 0 17px" : "0"}; */
  margin: 0;
  /* width: 100%; */

  @media (min-width: 800px) {
    margin: 0;
  }
`

const Prompt = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: ${({ theme }) => (theme === "dark" ? "var(--white)" : "var(--gray)")};
  cursor: pointer;
  display: flex;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  text-align: right;
  text-decoration: underline;
  margin: 0;
  padding: 0;
`

const ModalContainer = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  padding: 50px 25px 80px;
  height: 100vh;
  width: 100%;
  overflow-y: auto;

  @media (min-width: 800px) {
    padding: 40px 50px;
    height: auto;
    width: 800px;
  }

  @media (min-width: 1024px) {
    width: 840px;
  }
`

const ContentContainer = styled(motion.div)`
  background-color: var(--white);
  box-sizing: border-box;
  padding: 50px 25px;

  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;

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
  margin: 0 0 60px;
  /* max-width: 485px; */
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

const Subheading = styled.p`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 1px;
  margin: 0;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 16px;
    line-height: 26px;
  }
`

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;

  & > div:nth-child(2) {
    margin-bottom: 50px;
  }

  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
  }
`

const Title = styled.h4`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 0.9px;
  margin: 20px 0 10px;
  text-transform: uppercase;

  @media (min-width: 800px) {
    line-height: 27px;
    letter-spacing: 0.82px;
  }
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

const Fieldset = styled.fieldset`
  border: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 30px;
  margin: 0 0 30px;
  padding: 0;
`

const Legend = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0;

  @media (min-width: 800px) {
    font-size: 22px;
    line-height: 27px;
    letter-spacing: 1px;
  }
`

const Table = styled.table`
  border-collapse: collapse;
  table-layout: fixed;

  margin: 0 0 60px;
  width: 100%;
`

const TableRow = styled.tr`
  &:last-of-type td {
    border-bottom: none;
  }
`

const TableCell = styled.td`
  border-bottom: 1px solid #dddddd;

  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 13px;
  line-height: 24px;
  letter-spacing: 0.81px;
  padding: 9px 0;
`

const TableHeading = styled(TableCell)`
  color: #767676;
  font-size: 11px;
  line-height: 30px;
  letter-spacing: 0.61px;

  padding: 0;
  text-transform: uppercase;
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

function MetalWatchContent({ unit, setUnit }) {
  const sizeValues = {
    in: [
      { in: '5.25"', mm: "133mm" },
      { in: '5.50"', mm: "140mm" },
      { in: '5.75"', mm: "146mm" },
      { in: '6.00"', mm: "152mm" },
      { in: '6.25"', mm: "159mm" },
      { in: '6.50"', mm: "165mm" },
      { in: '6.75"', mm: "171mm" },
      { in: '7.00"', mm: "178mm" },
      { in: '7.25"', mm: "184mm" },
      { in: '7.50"', mm: "190mm" },
      { in: '7.75"', mm: "197mm" },
      { in: '8.00"', mm: "203mm" },
      { in: '8.25"', mm: "210mm" },
    ],
    mm: [
      { mm: "135mm", in: '5.3"' },
      { mm: "140mm", in: '5.5"' },
      { mm: "145mm", in: '5.7"' },
      { mm: "150mm", in: '5.9"' },
      { mm: "155mm", in: '6.1"' },
      { mm: "160mm", in: '6.3"' },
      { mm: "165mm", in: '6.5"' },
      { mm: "170mm", in: '6.7"' },
      { mm: "175mm", in: '6.9"' },
      { mm: "180mm", in: '7.1"' },
      { mm: "185mm", in: '7.3"' },
      { mm: "190mm", in: '7.5"' },
      { mm: "195mm", in: '7.7"' },
      { mm: "200mm", in: '7.9"' },
      { mm: "205mm", in: '8.1"' },
      { mm: "210mm", in: '8.3"' },
    ],
  }

  return (
    <>
      <div>
        <Fieldset>
          <Legend>Bracelet Size:</Legend>
          <CheckboxElement
            type="radio"
            name="size"
            value="mm"
            label="mm"
            defaultChecked={unit === "mm"}
            onChange={e => setUnit(e.target.value)}
          />
          <CheckboxElement
            type="radio"
            name="size"
            value="in"
            label="inches"
            defaultChecked={unit === "in"}
            onChange={e => setUnit(e.target.value)}
          />
        </Fieldset>
        <Table>
          <thead>
            <tr>
              <TableHeading>
                {unit === "mm" ? "Millimetres" : "Inches"}
              </TableHeading>
              <TableHeading>
                {unit === "mm" ? "Inches" : "Millimetres"}
              </TableHeading>
            </tr>
          </thead>
          <tbody>
            {sizeValues[unit].map((size, index) => (
              <TableRow key={index}>
                <TableCell>{unit === "mm" ? size.mm : size.in}</TableCell>
                <TableCell>{unit === "mm" ? size.in : size.mm}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
      <div>
        <StaticImage
          alt="How to measure"
          src="../../images/mock/how-to-measure.jpg"
        />
        <Title>How to measure</Title>
        <Description style={{ marginBottom: "1em" }}>
          With your palm facing up, wrap a measuring tape snuggly (not tight)
          around your watch wrist above the wrist bone and record the number.
        </Description>
        <Description>
          <a
            href="mailto:hello@vieren.co?subject=Size%20Guide"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Email us
          </a>{" "}
          for custom fitting requests
        </Description>
      </div>
    </>
  )
}

function LeatherWatchContent({ unit, setUnit }) {
  const sizeValues = {
    small: {
      label: "Small",
      mm: {
        min: "140mm",
        max: "190mm",
      },
      in: { min: '5.5"', max: '7.5"' },
    },
    large: {
      label: "Large",
      mm: { min: "165mm", max: "210mm" },
      in: { min: '6.5"', max: '8.3"' },
    },
  }

  return (
    <>
      <div>
        <Fieldset>
          <Legend>Strap Size:</Legend>
          <CheckboxElement
            type="radio"
            name="size"
            value="mm"
            label="mm"
            defaultChecked={unit === "mm"}
            onChange={e => setUnit(e.target.value)}
          />
          <CheckboxElement
            type="radio"
            name="size"
            value="in"
            label="inches"
            defaultChecked={unit === "in"}
            onChange={e => setUnit(e.target.value)}
          />
        </Fieldset>
        <Table>
          <thead>
            <tr>
              <TableHeading>Size</TableHeading>
              <TableHeading align="center">Min</TableHeading>
              <TableHeading align="center">Max</TableHeading>
            </tr>
          </thead>
          <tbody>
            <TableRow>
              <TableCell>{sizeValues.small.label}</TableCell>
              <TableCell align="center">{sizeValues.small[unit].min}</TableCell>
              <TableCell align="center">{sizeValues.small[unit].max}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{sizeValues.large.label}</TableCell>
              <TableCell align="center">{sizeValues.large[unit].min}</TableCell>
              <TableCell align="center">{sizeValues.large[unit].max}</TableCell>
            </TableRow>
          </tbody>
        </Table>
      </div>
      <div>
        <StaticImage
          alt="How to measure"
          src="../../images/mock/how-to-measure.jpg"
        />
        <Title>How to measure</Title>
        <Description style={{ marginBottom: "1em" }}>
          With your palm facing up, wrap a measuring tape snuggly (not tight)
          around your watch wrist above the wrist bone and record the number.
        </Description>
        <Description>
          <a
            href="mailto:hello@vieren.co?subject=Size%20Guide"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Email us
          </a>{" "}
          for custom fitting requests
        </Description>
      </div>
    </>
  )
}

export function SizeGuideContentModal({ unit, setUnit, handleClose }) {
  const { kind } = useProductContent()
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
    <ContentContainer
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
        <Heading>Size Guide</Heading>
      </Header>
      <ModalBody>
        {kind === "leather" ? (
          <LeatherWatchContent unit={unit} setUnit={setUnit} />
        ) : kind === "metal" ? (
          <MetalWatchContent unit={unit} setUnit={setUnit} />
        ) : null}
      </ModalBody>
    </ContentContainer>
  )
}

function SizeGuideModal() {
  const [unit, setUnit] = useState("mm")
  const { dispatchLayout } = useLayout()
  const { kind } = useProductContent()

  return (
    <ModalContainer
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={container}
    >
      <CloseButton
        type="button"
        onClick={() =>
          dispatchLayout({ type: LAYOUT_STATE.modal, payload: false })
        }
      >
        <CloseIcon />
      </CloseButton>
      <Header>
        <LogoSmall style={{ height: "25px", margin: "0 0 40px" }} />
        <Heading>Size Guide</Heading>
      </Header>
      <ModalBody>
        {kind === "leather" ? (
          <LeatherWatchContent unit={unit} setUnit={setUnit} />
        ) : (
          <MetalWatchContent unit={unit} setUnit={setUnit} />
        )}
      </ModalBody>
    </ModalContainer>
  )
}

export default function SizeChart({ theme, hasCustomizations = true }) {
  const { layoutState, dispatchLayout } = useLayout()

  return (
    <Container hasCustomizations={hasCustomizations}>
      <Prompt
        theme={theme}
        type="button"
        onClick={() =>
          dispatchLayout({ type: LAYOUT_STATE.modal, payload: "sizeGuide" })
        }
      >
        Size Guide
      </Prompt>
      {layoutState.modalOpen && layoutState.modalType === "sizeGuide" && (
        <Modal>
          <SizeGuideModal />
        </Modal>
      )}
    </Container>
  )
}
