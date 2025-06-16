import React, { useRef, useEffect } from "react"
import { graphql } from "gatsby"
import { trackLink } from "../../utils/analytics/segment"
import { Container } from "./Container"
import { H2 } from "./H2"
import H2Lato from "./H2Lato"
import { H3 } from "./H3"
import H3Lato from "./H3Lato"
import { H4 } from "./H4"
import H4Lato from "./H4Lato"
import { H5 } from "./H5"
import { P } from "./P"
import { Blockquote } from "./Blockquote"
import LargeText from "./LargeText"
import FinePrint from "./FinePrint"

const text = {
  visible: { opacity: 1, transition: { duration: 1 } },
  hidden: { opacity: 0 },
}

export default function PreformattedText({ data }) {
  const {
    element,
    content,
    align,
    colour,
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

  switch (element) {
    case `h1`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H2
            as="h1"
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h1lato`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H2Lato
            as="h1"
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h2`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H2
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h2lato`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H2Lato
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h3`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H3
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h3lato`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H3Lato
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h4`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H4
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h4lato`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H4Lato
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `h5`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <H5
            ref={elRef}
            as="span"
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `p`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <P
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `blockquote`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <Blockquote
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `largetext`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <LargeText
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    case `fineprint`:
      return (
        <Container
          margin={margin}
          $margin={marginRepeater}
          padding={padding}
          $padding={paddingRepeater}
        >
          <FinePrint
            ref={elRef}
            align={align}
            colour={colour}
            variants={text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      )
    default:
      throw new Error(
        `[Error] unhandled preformatted text element type ${element}`
      )
  }
}

export const newFragments = graphql`
  fragment PreOrderPreformattedTextFields on WpPreorder_Content_Elements_PreformattedText {
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

  fragment NewAccordionPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_PreformattedText {
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
  fragment NewBannerPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_PreformattedText {
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
  fragment NewBannerCarouselPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_PreformattedText {
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
  fragment NewCarouselPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_PreformattedText {
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
  fragment NewColumnsPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_PreformattedText {
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
  fragment NewFiveColumnPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_PreformattedText {
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
  fragment NewFlexCarouselThumbPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_PreformattedText {
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
  fragment NewFlexCarouselContentPreformattedTextFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_PreformattedText {
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
