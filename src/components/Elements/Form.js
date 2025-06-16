import React from "react"
import { graphql } from "gatsby"
import { Container } from "./Container"
import ContactForm from "../Forms/Contact"
import Subscribe from "../Forms/Subscribe"

function renderForm(form, data) {
  switch (form) {
    case "contact":
      return <ContactForm />
    case "emailSignup":
      return (
        <Subscribe
          disclaimer={data.disclaimer}
          button={data.button}
          tag={data.tag}
          successPage={data.successPage}
        />
      )
    default:
      throw new Error("[Error] Unhandled form type.")
  }
}

export default function Form({ data }) {
  return (
    <Container
      margin={data.margin}
      $margin={data?.marginRepeater}
      padding={{
        desktop: {
          top: { value: null, unit: "px" },
          right: { value: null, unit: "px" },
          bottom: { value: null, unit: "px" },
          left: { value: null, unit: "px" },
        },
        mobile: {
          top: { value: null, unit: "px" },
          right: { value: null, unit: "px" },
          bottom: { value: null, unit: "px" },
          left: { value: null, unit: "px" },
        },
      }}
      $padding={data?.paddingRepeater}
    >
      {renderForm(data.form, data)}
    </Container>
  )
}

export const newFragments = graphql`
  fragment PreOrderFormFields on WpPreorder_Content_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }

  fragment NewAccordionFormFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }

  fragment NewBannerFormFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }
  fragment NewBannerCarouselFormFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }

  fragment NewCarouselFormFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }

  fragment NewColumnsFormFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }
  fragment NewFiveColumnFormFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }
  fragment NewFlexCarouselThumbFormFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }
  fragment NewFlexCarouselContentFormFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Form {
    acfeFlexibleLayoutTitle
    anchor
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
    form
    button {
      text {
        content
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
      background {
        colour {
          desktop
          mobile
        }
        hoverColour {
          desktop
          mobile
        }
      }
    }
    disclaimer {
      text
      colour {
        desktop
        mobile
      }
    }
    tag
    successPage {
      ... on WpPage {
        uri
      }
      ... on WpPost {
        uri
      }
      ... on WpGift {
        uri
      }
      ... on WpProductPage {
        uri
      }
    }
  }
`
