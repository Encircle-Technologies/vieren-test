import React from "react"
import { graphql } from "gatsby"
import Section from "../Layout/Section"
import Slider from "../Elements/Slider"
import Card from "../Elements/Card"

export default function CardCarousel({ data }) {
  const {
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    slides,
    layout,
    theme,
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
        {slides?.map((card, index) => (
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
            <Card
              key={index}
              data={{
                card,
                layout,
                theme,
                margin: {
                  mobile: {
                    top: { value: 0, unit: "px" },
                    right: { value: 0, unit: "px" },
                    bottom: { value: 0, unit: "px" },
                    left: { value: 0, unit: "px" },
                  },
                  desktop: {
                    top: { value: 0, unit: "px" },
                    right: { value: 0, unit: "px" },
                    bottom: { value: 0, unit: "px" },
                    left: { value: 0, unit: "px" },
                  },
                },
                padding: {
                  mobile: {
                    top: { value: 0, unit: "px" },
                    right: { value: 0, unit: "px" },
                    bottom: { value: 0, unit: "px" },
                    left: { value: 0, unit: "px" },
                  },
                  desktop: {
                    top: { value: 0, unit: "px" },
                    right: { value: 0, unit: "px" },
                    bottom: { value: 0, unit: "px" },
                    left: { value: 0, unit: "px" },
                  },
                },
              }}
            />
          </div>
        ))}
      </Slider>
    </Section>
  )
}

export const fragment = graphql`
  fragment NewCardCarouselFields on WpTemplate_2021Default_Acf2021_Layouts_CardCarousel {
    acfeFlexibleLayoutTitle
    anchor
    theme
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
    slides {
      ...NewCardCarouselCardFields
    }
  }
`
