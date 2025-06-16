import React from "react"
import { graphql } from "gatsby"
import { getElements } from "../../utils/layout/elements"
import Section from "../Layout/Section"
import { Container, Column, Content } from "../Layout/Columns"
import Slider, { AltSlider } from "../Elements/Slider"
import { Desktop, Mobile } from "../Elements/Responsive"

export default function FiveColumn({ data }) {
  const {
    __typename,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    columnLayout,
    carouselLayout,
    columns = null,
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
      <Mobile>
        {carouselLayout.kind === "dots" && (
          <AltSlider settings={{ startIndex: carouselLayout.start - 1 }}>
            {columns?.map((column, index) => (
              <Column key={index}>
                <Content options={column.options}>
                  {getElements({
                    type: `${__typename}_columns`,
                    elements: column.elements,
                  })}
                </Content>
              </Column>
            ))}
          </AltSlider>
        )}
        {carouselLayout.kind === "progress" && (
          <Slider settings={{ startIndex: carouselLayout.start - 1 }}>
            {columns?.map((column, index) => (
              <Column key={index}>
                <Content options={column.options}>
                  {getElements({
                    type: `${__typename}_columns`,
                    elements: column.elements,
                  })}
                </Content>
              </Column>
            ))}
          </Slider>
        )}
      </Mobile>
      <Desktop>
        <Container
          kind={background.kind}
          bleed={columnLayout.bleed}
          gap={columnLayout.gap}
          template={"1fr 1fr 1fr 1fr 1fr"}
          stackingOrder={"normal"}
          collapseTo={"carousel"}
          sectionMargin={margin}
          $sectionMargin={marginRepeater}
          sectionPadding={padding}
          $sectionPadding={paddingRepeater}
        >
          {columns?.map((column, index) => (
            <Column key={index}>
              <Content options={column.options}>
                {getElements({
                  type: `${__typename}_columns`,
                  elements: column.elements,
                })}
              </Content>
            </Column>
          ))}
        </Container>
      </Desktop>
    </Section>
  )
}

export const fragment = graphql`
  fragment NewFiveColumnFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn {
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
    columnLayout {
      bleed
      gap
    }
    carouselLayout {
      kind
      start
    }
    columns {
      options {
        alignContent
      }
      elements {
        __typename
        ...NewFiveColumnButtonFields
        ...NewFiveColumnCardFields
        ...NewFiveColumnDividerFields
        ...NewFiveColumnGalleryFields
        ...NewFiveColumnImageFields
        ...NewFiveColumnPreformattedTextFields
        ...NewFiveColumnQuotesFields
        ...NewFiveColumnSpecFields
        ...NewFiveColumnTextFields
        ...NewFiveColumnVideoFields
        ...NewFiveColumnFormFields
        ...NewFiveColumnCountdownFields
      }
    }
  }
`
