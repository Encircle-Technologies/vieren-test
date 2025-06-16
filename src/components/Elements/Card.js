import React from "react"
import { Link, graphql } from "gatsby"
// import useIsLoaded from "../../hooks/useIsLoaded"
import { useCachedProductData } from "../../hooks/useProductData"
import styled from "styled-components"
import { Container } from "./Container"
import { BackgroundImage } from "./Image"
import { BackgroundVideo } from "./Video"
import StaticImage from "./StaticImage"
import {
  Card as StoriesCard,
  FeaturedCard as StoriesFeaturedCard,
} from "../Stories/Card"

const Content = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const ImgLink = styled(Link)`
  cursor: pointer;
  height: 100%;
  width: 100%;
`

const ImgWrapper = styled.div`
  margin: 0 0 20px;
  overflow: hidden;

  position: relative;
`

const HoverImage = styled(BackgroundImage)`
  display: none !important;

  ${ImgLink}:hover & {
    display: block !important;
  }
  height: auto;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`

const CardImgZoom = styled(BackgroundImage)`
  transition: transform 1s;

  &:hover {
    transform: scale3d(1.2, 1.2, 1.2);
  }
`

const Headline = styled.h3`
  color: ${({ theme }) => (theme === "dark" ? `var(--white)` : `var(--black)`)};
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: ${({ small }) => (small ? "15px" : "20px")};
  line-height: ${({ small }) => (small ? "20px" : "25px")};
  letter-spacing: ${({ small }) => (small ? "0.75px" : "1px")};
  margin: 0;
  text-align: center;
  text-transform: uppercase;

  @media (min-width: 800px) {
    font-size: 22px;
    line-height: 27px;
  }
`

const Description = styled.p`
  color: ${({ theme }) => (theme === "dark" ? `var(--white)` : `var(--gray)`)};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  margin: 0;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 16px;
    line-height: 26px;
  }
`

const Price = styled.span`
  color: ${({ theme }) => (theme === "dark" ? `#ffffff` : `var(--gray)`)};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 27px;
  letter-spacing: 0.67px;
`

function ProductCard({ id, theme }) {
  // const isLoaded = useIsLoaded()

  const { price: cachedPrice, currency } = useCachedProductData(id)

  // if (!isLoaded) return <Price theme={theme}>...</Price>

  return (
    <Price theme={theme}>{`${cachedPrice || ``}${cachedPrice &&
      ` ${currency}`}`}</Price>
  )
}

export default function Card({ data, small = false }) {
  const {
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    card,
    replaceMedia,
    media,
    layout,
    theme,
  } = data

  const isProduct = card?.__typename === "WpProductPage"

  const pageTemplate = card?.template?.__typename

  const imageSources = replaceMedia
    ? media.image.image
    : pageTemplate === "WpDefaultTemplate"
    ? card?.template?.ACF?.related.image
    : card?.template?.ACF2021?.related.image

  const videoSources = replaceMedia
    ? media.video
    : pageTemplate === "WpDefaultTemplate"
    ? card?.template?.ACF?.related.video
    : card?.template?.ACF2021?.related.video

  const newHasHover = replaceMedia
    ? media?.kind === "image" && media?.image.hasHover
    : !replaceMedia &&
      card?.template?.ACF2021?.related.kind === "image" &&
      card?.template?.ACF2021?.related.hasHover

  const hoverImageSources = newHasHover
    ? {
        mobile: replaceMedia
          ? media?.image.hoverImage?.image?.mobile
          : card?.template?.ACF2021?.related.hoverImage?.image?.mobile,
        desktop: replaceMedia
          ? media?.image.hoverImage?.image?.desktop
          : card?.template?.ACF2021?.related.hoverImage?.image?.desktop,
      }
    : { mobile: null, desktop: null }

  if (layout === "stories") {
    return <StoriesCard post={data.card} external={true} />
  } else if (layout === "featured") {
    return (
      <StoriesFeaturedCard post={data.card} external={true} reverse={true} />
    )
  } else if (newHasHover)
    return (
      <Container
        margin={margin}
        $margin={marginRepeater}
        padding={padding}
        $padding={paddingRepeater}
      >
        <Content>
          <ImgLink
            to={card?.uri}
            style={{ position: "relative" }}
            aria-label="View Content"
          >
            <ImgWrapper>
              {/* {pageTemplate === "Template_2021Default" ? (
                <StaticImage
                  image={card.template.ACF2021.related.image}
                  hoverImage={card.template.ACF2021.related.hoverImage}
                />
              ) : ( */}
              <>
                <BackgroundImage source={imageSources} />
                <HoverImage source={hoverImageSources} loading="eager" />
              </>
              {/* )} */}
            </ImgWrapper>
          </ImgLink>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link to={card?.uri}>
              <Headline small={small} theme={theme}>
                {pageTemplate === "WpDefaultTemplate"
                  ? card?.template?.ACF?.related.headline
                  : card?.template?.ACF2021?.related.headline}
              </Headline>
            </Link>
            {isProduct ? (
              <ProductCard
                id={card?.ACFProduct?.linkedProductId}
                theme={theme}
              />
            ) : (
              <Description theme={theme}>
                {pageTemplate === "WpDefaultTemplate"
                  ? card?.template?.ACF?.related.description
                  : card?.template?.ACF2021?.related.description}
              </Description>
            )}
          </div>
        </Content>
      </Container>
    )
  else
    return (
      <Container
        margin={margin}
        $margin={marginRepeater}
        padding={padding}
        $padding={paddingRepeater}
      >
        <Content>
          <ImgLink to={card?.uri} aria-label="View Content">
            {(replaceMedia && media.kind === "image") ||
            (!replaceMedia && card?.template?.ACF?.related.kind === "image") ||
            (!replaceMedia &&
              card?.template?.ACF2021?.related.kind === "image") ? (
              <ImgWrapper>
                {/* {pageTemplate === "Template_2021Default" ? (
                  <StaticImage
                    image={card.template.ACF2021.related.image}
                    hoverImage={card.template.ACF2021.related.hoverImage}
                  />
                ) : ( */}
                <CardImgZoom source={imageSources} />
                {/* )} */}
              </ImgWrapper>
            ) : null}
            {(replaceMedia && media.kind === "video") ||
            (!replaceMedia && card?.template?.ACF?.related.kind === "video") ||
            (!replaceMedia &&
              card?.template?.ACF2021?.related.kind === "video") ? (
              <ImgWrapper>
                <BackgroundVideo source={videoSources} />
              </ImgWrapper>
            ) : null}
          </ImgLink>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link to={card?.uri}>
              <Headline small={small} theme={theme}>
                {pageTemplate === "WpDefaultTemplate" ||
                pageTemplate === "DefaultTemplate"
                  ? card?.template?.ACF?.related.headline
                  : card?.template?.ACF2021?.related.headline}
              </Headline>
            </Link>
            {isProduct ? (
              <ProductCard
                id={card?.ACFProduct?.linkedProductId}
                theme={theme}
              />
            ) : (
              <Description theme={theme}>
                {pageTemplate === "WpDefaultTemplate" ||
                pageTemplate === "DefaultTemplate"
                  ? card?.template?.ACF?.related.description
                  : card?.template?.ACF2021?.related.description}
              </Description>
            )}
          </div>
        </Content>
      </Container>
    )
}

export const fragment = graphql`
  fragment NewRelatedFields on WpTemplate_2021Default_Acf2021 {
    related {
      headline
      description
      kind
      image {
        desktop {
          ...ImageFields
        }
        mobile {
          ...MobileImageFields
        }
      }
      hasHover
      hoverImage {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
  }
`

export const newFragments = graphql`
  fragment PreOrderCardFields on WpPreorder_Content_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }

  fragment NewAccordionCardFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewBannerCardFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewBannerCarouselCardFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewCarouselCardFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewCardCarouselCardFields on WpTemplate_2021Default_Acf2021_Layouts_CardCarousel_Slides {
    __typename
    ... on WpPage {
      uri
      template {
        __typename
        ... on WpTemplate_2021Default {
          ACF2021 {
            ...NewRelatedFields
          }
        }
      }
    }
    ...PostSummaryFields
    ...GiftSummaryFields
    ... on WpProductPage {
      uri
      ACFProduct {
        linkedProductId
      }
      template {
        __typename
        ... on WpTemplate_2021Default {
          ACF2021 {
            ...NewRelatedFields
          }
        }
      }
    }
  }
  fragment NewColumnsCardFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewFiveColumnCardFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewFlexCarouselThumbCardFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
  fragment NewFlexCarouselContentCardFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Card {
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
    card {
      __typename
      ... on WpPage {
        uri
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
      ...PostSummaryFields
      ...GiftSummaryFields
      ... on WpProductPage {
        uri
        ACFProduct {
          linkedProductId
        }
        template {
          __typename
          ... on WpTemplate_2021Default {
            ACF2021 {
              ...NewRelatedFields
            }
          }
        }
      }
    }
    replaceMedia
    media {
      kind
      image {
        image {
          desktop {
            ...ImageFields
          }
          mobile {
            ...MobileImageFields
          }
        }
        hasHover
        hoverImage {
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
        }
      }
      video {
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        options
      }
    }
    layout
    theme
  }
`
