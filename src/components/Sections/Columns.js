import React from "react"
import { graphql } from "gatsby"
import { getElements } from "../../utils/layout/elements"
import Section from "../Layout/Section"
import { Container, Column, Content } from "../Layout/Columns"
import Slider from "../Elements/Slider"
import { Desktop, Mobile } from "../Elements/Responsive"
import Popup from "./Popup"

export default function Columns({ data, aboveFold }) {
  if (data.layout.popup) {
    return (
      <Popup>
        <ColumnContent data={data} aboveFold={true} />
      </Popup>
    )
  }

  return <ColumnContent data={data} aboveFold={aboveFold} />
}

function ColumnContent({ data, aboveFold }) {
  const {
    __typename,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    layout,
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
      aboveFold={aboveFold}
      isPopup={data.layout.popup}
    >
      <Mobile>
        {layout.collapseTo === "carousel" && (
          <Slider>
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
        {(layout.collapseTo === "rows" || layout.collapseTo === "2xrows") && (
          <Container
            kind={background.kind}
            gap={layout.gap}
            bleed={layout.bleed}
            template={layout.template}
            stackingOrder={layout.stackingOrder}
            collapseTo={layout.collapseTo}
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
                    small: layout.collapseTo === "2xrows",
                  })}
                </Content>
              </Column>
            ))}
          </Container>
        )}
      </Mobile>
      <Desktop>
        <Container
          kind={background.kind}
          gap={layout.gap}
          bleed={layout.bleed}
          template={layout.template}
          stackingOrder={layout.stackingOrder}
          collapseTo={layout.collapseTo}
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
  fragment NewColumnsFields on WpTemplate_2021Default_Acf2021_Layouts_Columns {
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
    layout {
      popup
      bleed
      stackingOrder
      template
      gap
      collapseTo
    }
    columns {
      options {
        alignContent
      }
      elements {
        __typename
        ...NewColumnsButtonFields
        ...NewColumnsCardFields
        ...NewColumnsDividerFields
        ...NewColumnsGalleryFields
        ...NewColumnsImageFields
        ...NewColumnsPreformattedTextFields
        ...NewColumnsQuotesFields
        ...NewColumnsSpecFields
        ...NewColumnsTextFields
        ...NewColumnsVideoFields
        ...NewColumnsFormFields
        ...NewColumnsCountdownFields
      }
    }
  }
`
