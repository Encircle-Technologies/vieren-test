import React, { useRef, useEffect } from "react"
import { graphql } from "gatsby"
import { trackLink } from "../../utils/analytics/segment"
import { Container } from "./Container"
import styled from "styled-components"

const Element = styled.span`
  color: ${({ colour }) => colour.mobile || `#000000`};
  font-family: ${({ font }) =>
    font.family ? `${font.family}, sans-serif` : "Lato, sans-serif"};
  font-weight: ${({ font }) => font.weight || `400`};
  font-size: ${({ font }) => font?.size?.mobile || `40px`};
  line-height: ${({ font }) => font?.lineHeight?.mobile || `1.25`};
  letter-spacing: ${({ font }) => font?.letterSpacing?.mobile || `0.44px`};
  margin: 0;
  text-align: ${({ align }) => align.mobile || `center`};

  @media (min-width: 800px) {
    color: ${({ colour }) => colour.desktop || `#000000`};
    font-size: ${({ font }) => font?.size?.desktop || `50px`};
    line-height: ${({ font }) => font?.lineHeight?.desktop || `1.2`};
    letter-spacing: ${({ font }) => font?.letterSpacing?.mobile || `0.56px`};
    text-align: ${({ align }) => align.desktop || `center`};
  }
`

export default function Text({ data }) {
  const {
    element,
    content,
    align,
    colour,
    font,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
  } = data

  const elRef = useRef(null)

  useEffect(() => {
    const contentLinkCollection = elRef.current.getElementsByTagName("a")

    let outboundLinkArray = []

    for (const link of contentLinkCollection) {
      if (!link.href.includes(process.env.GATSBY_SITE_URL)) {
        outboundLinkArray.push(link)
      }
    }

    if (outboundLinkArray.length > 0) {
      outboundLinkArray.forEach(link =>
        trackLink(link, "Outbound Link", { outboundUrl: link.href })
      )
    }
  }, [])

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      <Element
        ref={elRef}
        as={element}
        align={align}
        colour={colour}
        font={font}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  )
}

export const newFragments = graphql`
  fragment PreOrderTextFields on WpPreorder_Content_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }

  fragment NewAccordionTextFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewBannerTextFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewBannerCarouselTextFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewCarouselTextFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewColumnsTextFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewFiveColumnTextFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewFlexCarouselThumbTextFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
  fragment NewFlexCarouselContentTextFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Text {
    acfeFlexibleLayoutTitle
    element
    content
    align {
      desktop
      mobile
    }
    colour {
      desktop
      mobile
    }
    font {
      family
      weight
      size {
        desktop
        mobile
      }
      lineHeight {
        desktop
        mobile
      }
      letterSpacing {
        desktop
        mobile
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
  }
`
