import React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import useMediaQuery from "../../hooks/useMediaQuery"
import styled from "styled-components"
import { Container } from "./Container"

const StyledImage = styled(GatsbyImage)`
  & [aria-hidden="true"] {
    height: 0;
    padding-top: ${({ $aspectRatio }) =>
      $aspectRatio.mobile
        ? `${$aspectRatio.mobile * 100}% !important`
        : `${$aspectRatio.desktop * 100}% !important`};
  }

  display: block !important;

  ${({ query, $aspectRatio }) =>
    `@media ${query} {
      display: block !important;

      & [style="max-width: 800px; display: block;"],
      & [style="max-width:800px;display:block;"], 
      & [style="max-width:800px;display:block"] {
        max-width: unset !important;
      }

      & [aria-hidden="true"] {
        padding-top: ${$aspectRatio.desktop * 100}% !important;
      }
    }
  `}
`

export function BackgroundImage({
  source,
  query = "",
  ignoreArtDirection = false,
  aboveFold = false,
  ...props
}) {
  const aspectRatio = {
    mobile:
      source?.mobile?.mediaDetails.height / source?.mobile?.mediaDetails.width,
    desktop:
      source?.desktop?.mediaDetails.height /
      source?.desktop?.mediaDetails.width,
  }

  return (
    <HtmlContainer {...props}>
      <HtmlPlaceholder $aspectRatio={aspectRatio} />
      <picture>
        {source.mobile ? (
          <source
            media="(max-width:799px)"
            srcSet={`${source.mobile.mediaItemUrl}?format=auto&width=800`}
          />
        ) : (
          <source
            media="(max-width:799px)"
            srcSet={`${source.desktop.mediaItemUrl}?format=auto&width=800`}
          />
        )}
        <source
          media="(min-width: 800px)"
          srcSet={`${source.desktop.mediaItemUrl}?format=auto&width=1920`}
        />
        <img
          style={{
            width: "100%",
          }}
          src={`${source.desktop.mediaItemUrl}?format=auto`}
          alt={source.desktop.alt}
          loading={aboveFold ? "eager" : "lazy"}
        />
      </picture>
    </HtmlContainer>
  )
}

export function Image({ data, aboveFold = false, ignoreArtDirection = false }) {
  const { image, margin, marginRepeater, padding, paddingRepeater, link } = data

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      {link?.kind === "internal" && link?.page?.uri ? (
        <Link
          to={
            link.anchor ? `${link?.page?.uri}#${link.anchor}` : link?.page?.uri
          }
          style={{ display: "block" }}
        >
          <BackgroundImage
            source={image}
            aboveFold={aboveFold}
            ignoreArtDirection={ignoreArtDirection}
          />
        </Link>
      ) : link?.kind === "external" && link?.url ? (
        <a
          href={link.url}
          // target="_blank"
          // rel="noopener noreferrer"
          style={{ display: "block" }}
        >
          <BackgroundImage
            source={image}
            aboveFold={aboveFold}
            ignoreArtDirection={ignoreArtDirection}
          />
        </a>
      ) : (
        <BackgroundImage
          source={image}
          aboveFold={aboveFold}
          ignoreArtDirection={ignoreArtDirection}
        />
      )}
    </Container>
  )
}

const HtmlContainer = styled.div`
  position: relative;

  & img {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`

const HtmlPlaceholder = styled.div`
  /* background-color: ${({ $background }) =>
    $background?.mobile || "#ffffff"}; */
  height: 0;
  width: 100%;

  padding-top: ${({ $aspectRatio }) =>
    $aspectRatio.mobile
      ? `${$aspectRatio.mobile * 100}%`
      : `${$aspectRatio.desktop * 100}%`};

  @media (min-width: 800px) {
    /* background-color: ${({ $background }) =>
      $background?.desktop || "#ffffff"}; */
    padding-top: ${({ $aspectRatio }) =>
      $aspectRatio.desktop && `${$aspectRatio.desktop * 100}%`};
  }
`

export const imageFragment = graphql`
  fragment MobileImageFields on WpMediaItem {
    altText
    mediaItemUrl
    mediaDetails {
      height
      width
    }
  }

  fragment ImageFields on WpMediaItem {
    altText
    mediaItemUrl
    mediaDetails {
      height
      width
    }
    # localFile {
    #   publicURL
    #   childImageSharp {
    #     gatsbyImageData(
    #       backgroundColor: "#dedede"
    #       formats: [AUTO, WEBP]
    #       layout: FULL_WIDTH
    #       breakpoints: [360, 720, 1080, 1366, 1920]
    #       placeholder: NONE
    #       quality: 90
    #     )
    #   }
    # }
  }
`

export const newFragments = graphql`
  fragment PreOrderImageFields on WpPreorder_Content_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }

  fragment NewAccordionImageFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewBannerImageFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewBannerCarouselImageFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewCarouselImageFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewColumnsImageFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewFiveColumnImageFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewFlexCarouselThumbImageFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
  fragment NewFlexCarouselContentImageFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Image {
    acfeFlexibleLayoutTitle
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
    image {
      desktop {
        ...ImageFields
      }
      mobile {
        ...MobileImageFields
      }
    }
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      anchor
      url
    }
  }
`
