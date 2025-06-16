import React, { useRef, useState, useEffect } from "react"
import { graphql } from "gatsby"
import { useLocation } from "@reach/router"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { getElements } from "../../utils/layout/elements"
import Grid from "../Layout/Grid"
import { H5 } from "../Elements/H5"
import { BackgroundImage } from "../Elements/Image"
import { BackgroundVideo } from "../Elements/Video"
import { margin, padding } from "../../styles/spacing"

export const Container = styled.section`
  position: relative;

  &::before,
  &::after {
    border-bottom: 1px solid #bbbbbb;
    content: "";
    display: block;
    position: absolute;
    left: ${({ fullWidth }) => (fullWidth ? `0` : `calc(1 / 24 * 100%)`)};
    height: 0;
    width: ${({ fullWidth }) => (fullWidth ? `100%` : `calc(22 / 24 * 100%)`)};
    z-index: 1;

    @media (min-width: 800px) {
      left: ${({ fullWidth }) => (fullWidth ? `0` : `calc(1 / 30 * 100%)`)};
      width: ${({ fullWidth }) =>
        fullWidth ? `100%` : `calc(28 / 30 * 100%)`};
    }
  }

  &::before {
    top: 0;
    /* display: none; */
  }

  &::after {
    bottom: 0;
    /* display: block; */
  }

  /* &:last-of-type::after {
    display: block;
  } */
`

export const Article = styled.article`
  background-color: ${({ backgroundColour }) =>
    backgroundColour?.mobile || `#ffffff`};

  ${margin}
  ${padding}

  @media (min-width: 800px) {
    background-color: ${({ backgroundColour }) =>
      backgroundColour?.desktop || `#ffffff`};
  }

  // selects the second accordion
  & + & ${Container}::before {
    display: none;
  }
`

export const Background = styled.div`
  display: block;
  height: auto;
  width: 100%;
  object-fit: cover;
  z-index: 0;
`

export const Button = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 9px 0 10px;

  position: relative;
  width: 100%;

  &:focus,
  &:active {
    outline: none;
  }

  &::before,
  &::after {
    border-bottom: ${({ colour }) =>
      colour?.mobile ? `2px solid ${colour?.mobile}` : `2px solid #767676`};
    content: "";
    display: block;
    height: 0;
    width: 12px;

    position: absolute;
    right: 0;
    top: 50%;
    transition: transform 0.25s;
  }

  &::before {
    transform: translate3d(0, -50%, 0);
  }

  &::after {
    transform: translate3d(0, -50%, 0) rotate(90deg);
  }

  &::after {
    ${({ $open }) => $open && `transform: rotate(0deg);`}
  }

  @media (min-width: 768px) {
    padding: 13px 0 14px;

    &::before,
    &::after {
      border-bottom: ${({ colour }) =>
        colour.mobile ? `2px solid ${colour?.desktop}` : `2px solid #767676`};
    }
  }
`

export const Title = styled(H5)`
  color: ${({ colour }) => colour?.mobile || `var(--gray)`};
  font-size: 12px;

  @media (min-width: 800px) {
    color: ${({ colour }) => colour?.desktop || `var(--gray)`};
    font-size: 12px;
  }
`

export const body = {
  open: {
    height: "auto",
    transition: {
      height: { stiffness: 1000, mass: 100, damping: 100, velocity: -100 },
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  closed: {
    height: 0,
    transition: {
      delay: 0.2,
      height: { stiffness: 1000 },
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
}

export const contents = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
}

export default function Accordion({ data }) {
  const {
    __typename: type,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    expanded,
    colour,
    title,
    elements,
  } = data
  const [open, setOpen] = useState(expanded)

  const sectionRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (location.hash === `#${anchor}`) {
      setOpen(
        true,
        setTimeout(() => sectionRef.current.scrollIntoView(), 500)
      )
    }
  }, [location, anchor])

  return (
    <Article
      id={anchor}
      backgroundColour={background.colour}
      margin={margin} // Deprecated old template
      $margin={marginRepeater}
      padding={padding} // Deprecated old template
      $padding={paddingRepeater}
      ref={sectionRef}
    >
      <Container>
        {background.kind !== "colour" && (
          <Background>
            {background.kind === `image` && (
              <BackgroundImage source={background.image} />
            )}
            {background.kind === `video` && (
              <BackgroundVideo source={background.video} />
            )}
          </Background>
        )}
        <Grid>
          <Button colour={colour} $open={open} onClick={() => setOpen(!open)}>
            <Title as="span" colour={colour}>
              {title}
            </Title>
          </Button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={body}
              >
                <motion.div variants={contents}>
                  {getElements({ type, elements })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Container>
    </Article>
  )
}

export const fragment = graphql`
  fragment NewAccordionFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion {
    acfeFlexibleLayoutTitle
    anchor
    background {
      kind
      colour {
        desktop
        mobile
      }
      image {
        desktop {
          ...ImageFields
        }
        mobile {
          ...MobileImageFields
        }
      }
      video {
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        options
      }
    }
    marginRepeater {
      desktop {
        direction
        unit
        value
      }
      mobile {
        direction
        unit
        value
      }
    }
    paddingRepeater {
      desktop {
        direction
        unit
        value
      }
      mobile {
        direction
        unit
        value
      }
    }
    colour {
      desktop
      mobile
    }
    title
    expanded
    elements {
      __typename
      ...NewAccordionButtonFields
      ...NewAccordionCardFields
      ...NewAccordionDividerFields
      ...NewAccordionGalleryFields
      ...NewAccordionImageFields
      ...NewAccordionPreformattedTextFields
      ...NewAccordionQuotesFields
      ...NewAccordionSpecFields
      ...NewAccordionTextFields
      ...NewAccordionVideoFields
      ...NewAccordionFormFields
      ...NewAccordionCountdownFields
    }
  }
`
