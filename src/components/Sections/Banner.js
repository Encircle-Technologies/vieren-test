import React from "react"
import { graphql } from "gatsby"
import { motion } from "framer-motion"
import { getElements } from "../../utils/layout/elements"
import styled from "styled-components"
import Section from "../Layout/Section"
import Grid from "../Layout/Grid"

const Container = styled.div`
  @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
`

const Elements = styled(motion.div)`
  grid-row: ${({ stacking }) => (stacking === "center" ? `1 / 3` : `2 / 3`)};
  margin: 40px auto;
  display: flex;
  flex-direction: Column;
  justify-content: center;

  & > *:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 800px) {
    grid-row: unset;
    grid-column: ${({ placement }) =>
      placement === "center"
        ? `1 / 3`
        : placement === "start"
        ? `1 / 2`
        : placement === "end"
        ? `2 / 3`
        : null};
    max-width: 35vw;
    width: 100%;
  }
`

export default function Banner({ data, aboveFold, ...props }) {
  const {
    __typename: type,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    placement,
    stacking,
    elements = [],
  } = data

  return (
    <Section
      anchor={anchor}
      background={background}
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
      aboveFold={aboveFold}
      stacking={stacking}
      {...props}
    >
      <Grid style={{ height: "100%", alignContent: "center" }}>
        <Container>
          <Elements
            // ref={ref}
            placement={placement}
            stacking={stacking}
            // initial="hidden"
            // animate={inView ? "visible" : "hidden"}
            // variant={container}
          >
            {getElements({ type, elements })}
          </Elements>
        </Container>
      </Grid>
    </Section>
  )
}

export const fragment = graphql`
  fragment NewBannerFields on WpTemplate_2021Default_Acf2021_Layouts_Banner {
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
    placement
    stacking
    elements {
      __typename
      ...NewBannerButtonFields
      ...NewBannerCardFields
      ...NewBannerDividerFields
      ...NewBannerGalleryFields
      ...NewBannerImageFields
      ...NewBannerPreformattedTextFields
      ...NewBannerQuotesFields
      ...NewBannerSpecFields
      ...NewBannerTextFields
      ...NewBannerVideoFields
      ...NewBannerFormFields
      ...NewBannerCountdownFields
    }
  }
`
