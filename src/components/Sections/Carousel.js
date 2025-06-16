import React from "react"
import { graphql } from "gatsby"
import { getElements } from "../../utils/layout/elements"
import Section from "../Layout/Section"
import Slider from "../Elements/Slider"

export default function Carousel({ data }) {
  const {
    __typename,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    theme,
    slides,
  } = data

  return (
    <Section
      anchor={anchor}
      background={background}
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      <Slider theme={theme}>
        {slides?.map((slide, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              height: "100%",
              width: "100%",
            }}
          >
            {getElements({
              type: `${__typename}_slides`,
              elements: slide.elements,
            })}
          </div>
        ))}
      </Slider>
    </Section>
  )
}

export const fragment = graphql`
  fragment NewCarouselFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel {
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
    theme
    slides {
      elements {
        __typename
        ...NewCarouselButtonFields
        ...NewCarouselCardFields
        ...NewCarouselDividerFields
        ...NewCarouselGalleryFields
        ...NewCarouselImageFields
        ...NewCarouselPreformattedTextFields
        ...NewCarouselQuotesFields
        ...NewCarouselSpecFields
        ...NewCarouselTextFields
        ...NewCarouselVideoFields
        ...NewCarouselFormFields
        ...NewCarouselCountdownFields
      }
    }
  }
`
