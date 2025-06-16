import React from "react"
import { graphql } from "gatsby"
import Section from "../Layout/Section"
import { FeaturedCard } from "../Stories/Card"

export default function StoriesFeaturedPost({ data }) {
  const { anchor, background, marginRepeater, paddingRepeater, post } = data

  return (
    <Section
      anchor={anchor}
      background={background}
      $margin={marginRepeater}
      $padding={paddingRepeater}
    >
      <FeaturedCard post={post} external={true} direction="row" />
    </Section>
  )
}

export const fragment = graphql`
  fragment NewStoriesFeaturedPostFields on WpTemplate_2021Default_Acf2021_Layouts_StoriesFeaturedPost {
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
    post {
      ...PostSummaryFields
      ...GiftSummaryFields
    }
  }
`
