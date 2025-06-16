import React from "react"
import { graphql } from "gatsby"
import { trackOutbound } from "../../utils/analytics/segment"
import { useCachedProductData, useProduct } from "../../hooks/useProductData"
import { ButtonAsLink, ArrowLink, ButtonContainer } from "./Button"
import Customize from "../Product/Customize"
import Buy from "../Product/Buy"
import Arrow from "../../images/icons/arrow.svg"

function CmsBuyButton({ productId, background, text, children }) {
  const {
    state: { selectedVariation },
  } = useProduct()
  const {
    type,
    stockStatus: cachedStockStatus,
    stockQuantity: cachedStockQuantity,
  } = useCachedProductData(productId)

  return (
    <Buy
      type={type}
      background={background}
      text={text}
      selected={{ productId, variationId: selectedVariation }}
      selectedQty={1}
      stockStatus={cachedStockStatus}
      stockQuantity={cachedStockQuantity}
      extraData={JSON.stringify({ dateAdded: new Date() })}
    >
      {children}
    </Buy>
  )
}

export default function CmsButton({ data }) {
  const {
    kind,
    background,
    align,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    text,
    action,
    page,
    anchor,
    productId,
    showCustomSizing,
    url,
  } = data

  const renderButton = ({ kind, action }) => {
    switch (true) {
      case action === `buy`:
        return (
          <>
            {showCustomSizing && <Customize />}
            <CmsBuyButton
              productId={productId}
              background={background}
              text={text}
            >
              {text.content}
            </CmsBuyButton>
          </>
        )
      case action === `link` && kind === `text`:
        return (
          <ButtonAsLink
            to={anchor ? `${page?.uri}#${anchor}` : page?.uri}
            background={background}
            text={text}
          >
            {text.content}
          </ButtonAsLink>
        )
      case action === `link` && kind === `arrow`:
        return (
          <ArrowLink
            to={anchor ? `${page?.uri}${anchor}` : page?.uri}
            colour={text.colour}
            hoverColour={background.hover}
          >
            {text.content && (
              <span style={{ marginRight: "9px" }}>{text.content}</span>
            )}
            <Arrow className="arrow" />
          </ArrowLink>
        )
      case action === `ahref` && kind === `text`:
        return (
          <ButtonAsLink
            to={url}
            background={background}
            text={text}
            // target="_blank"
            // rel="noreferrer noopener"
            // onClick={() => trackOutbound(url)}
          >
            {text.content}
          </ButtonAsLink>
        )
      case action === `ahref` && kind === `arrow`:
        return (
          <ArrowLink
            to={url}
            colour={text.colour}
            hoverColour={background.hover}
            // target="_blank"
            // rel="noreferrer noopener"
            // onClick={() => trackOutbound(url)}
          >
            {text.content && (
              <span style={{ marginRight: "9px" }}>{text.content}</span>
            )}
            <Arrow className="arrow" />
          </ArrowLink>
        )
      default:
        throw new Error(`[Error] Unhandled action type`)
    }
  }

  /**
   * Options: ["link", "ahref", "buy"]
   */
  return (
    <ButtonContainer
      align={align}
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      {renderButton({ kind, action })}
    </ButtonContainer>
  )
}

export const newFragments = graphql`
  fragment PreOrderButtonFields on WpPreorder_Content_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }

  fragment NewAccordionButtonFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewBannerButtonFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewBannerCarouselButtonFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewCarouselButtonFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewColumnsButtonFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewFiveColumnButtonFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewFlexCarouselThumbButtonFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
  fragment NewFlexCarouselContentButtonFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Button {
    acfeFlexibleLayoutTitle
    kind
    background {
      colour
      hover
    }
    align {
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
    text {
      colour
      hoverColour
      content
    }
    action
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
      ... on WpGift {
        uri
        status
      }
      ... on WpProductPage {
        uri
        status
      }
    }
    anchor
    showCustomSizing
    productId
    url
  }
`
