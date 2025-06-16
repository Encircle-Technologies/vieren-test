import React from "react"
import { graphql } from "gatsby"

// Frequently used sections
import Banner from "../../components/Sections/Banner"
import Columns from "../../components/Sections/Columns"
import Accordion from "../../components/Sections/Accordion"
import BannerCarousel from "../../components/Sections/BannerCarousel"
import Carousel from "../../components/Sections/Carousel"
import CardCarousel from "../../components/Sections/CardCarousel"
import FiveColumn from "../../components/Sections/FiveColumn"
import FlexCarousel from "../../components/Sections/FlexCarousel"
import Social from "../../components/Sections/Social"
import CategoryFilter from "../../components/Sections/CategoryFilter"
import StoriesCategoryFeed from "../../components/Sections/StoriesCategoryFeed"
import StoriesFeaturedPost from "../../components/Sections/StoriesFeaturedPost"
import AnchorNavigation from "../../components/Sections/AnchorNavigation"

export const getLayouts = ({ pageId = null, layouts = null }) =>
  layouts?.map((section, index) => {
    switch (section.__typename) {
      case `WpTemplate_2021Default_Acf2021_Layouts_Accordion`:
        return <Accordion key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_Banner`:
        return <Banner key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel`:
        return (
          <BannerCarousel key={index} data={section} aboveFold={index < 1} />
        )
      case `WpTemplate_2021Default_Acf2021_Layouts_Carousel`:
        return <Carousel key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_CardCarousel`:
        return <CardCarousel key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_Columns`:
        return <Columns key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_FiveColumn`:
        return <FiveColumn key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel`:
        return <FlexCarousel key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_Social`:
        return <Social key={index} data={section} aboveFold={index < 1} />
      case `WpTemplate_2021Default_Acf2021_Layouts_StoriesCategoryFilter`:
        return (
          <CategoryFilter key={index} data={section} aboveFold={index < 1} />
        )
      case `WpTemplate_2021Default_Acf2021_Layouts_StoriesCategoryFeed`:
        return (
          <StoriesCategoryFeed
            key={index}
            skipPost={pageId}
            data={section}
            aboveFold={index < 1}
          />
        )
      case `WpTemplate_2021Default_Acf2021_Layouts_StoriesFeaturedPost`:
        return (
          <StoriesFeaturedPost
            key={index}
            data={section}
            aboveFold={index < 1}
          />
        )
      case `WpTemplate_2021Default_Acf2021_Layouts_AnchorNavigation`:
        return (
          <AnchorNavigation key={index} data={section} aboveFold={index < 1} />
        )
      default:
        throw new Error(`[Error] Unhandled layout type ${section.__typename}`)
    }
  })

export const fragment = graphql`
  fragment NewTemplateFields on WpTemplate_2021Default {
    ACF2021 {
      ...NewMetaFields
      ...NewRelatedFields
      headerStyle
      layouts {
        __typename
        ...AnchorNavigationFields
        ...NewAccordionFields
        ...NewBannerFields
        ...NewBannerCarouselFields
        ...NewCarouselFields
        ...NewCardCarouselFields
        ...NewColumnsFields
        ...NewFiveColumnFields
        ...NewFlexCarouselFields
        ...NewSocialFields
        ...NewStoriesCategoryFilterFields
        ...NewStoriesCategoryFeedFields
        ...NewStoriesFeaturedPostFields
      }
    }
  }
`
