import React, { useRef, useState, useEffect } from "react"
import { graphql } from "gatsby"
import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import useMediaQuery from "../../hooks/useMediaQuery"
import styled from "styled-components"
import { Container } from "./Container"

const QuoteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 40px;
  min-height: 112px;

  @media (min-width: 800px) {
    min-height: 68px;
  }
`

const Quote = styled.h2`
  color: var(--gray);
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 34px;
  letter-spacing: 0.31px;
  margin: 0;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 30px;
    letter-spacing: 0.39px;
    line-height: 39px;
  }
`

const List = styled.ul`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  @media (min-width: 800px) {
    padding: 0 100px;
  }
`

const Item = styled.li`
  cursor: pointer;
  flex-basis: 33%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 800px) {
    flex-basis: 20%;
  }
`

const NavButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;

  &:active,
  &:focus {
    outline: none;
  }
`

const Logo = styled.img`
  display: block;
  filter: ${({ active }) => (active ? "none" : "opacity(40%)")};

  height: auto;
  max-height: 22px;
  width: auto;
  max-width: 100%;

  @media (min-width: 800px) {
    max-height: 30px;
  }
`

function Dot({ active, image, stop, onClick }) {
  const logoRef = useRef(null)

  useEffect(() => {
    document.addEventListener("focusin", () => {
      if (document.activeElement === logoRef.current) {
        stop()
      }
    })
  }, [stop])

  return (
    <NavButton
      type="button"
      ref={logoRef}
      onClick={() => onClick()}
      aria-label="Navigate to quote"
    >
      <Logo
        active={active}
        src={`${image}?format=auto&height=30`}
        alt="Logo"
        loading="lazy"
      />
    </NavButton>
  )
}

export default function Quotes({ data }) {
  const { list, margin, marginRepeater, padding, paddingRepeater } = data
  const [isLoaded, setIsLoaded] = useState(false)
  const [selected, setSelected] = useState(0)
  const [ref, inView] = useInView({
    threshold: 0,
  })
  const isDesktop = useMediaQuery("(min-width: 800px)")

  const mobileList = list.filter(item => item.showOnMobile === true)

  const responsiveList = isDesktop ? list : mobileList

  const autoplay = () => {
    if (
      (isDesktop && selected < list.length - 1) ||
      (!isDesktop && selected < mobileList.length - 1)
    ) {
      setSelected(prevState => prevState + 1)
    } else {
      setSelected(0)
    }
  }

  const { play, stop } = useRecursiveTimeout(autoplay, 5000)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (inView) {
      play()
    } else {
      stop()
    }
  }, [play, stop, inView])

  useEffect(() => {
    setSelected(0)
  }, [isDesktop])

  if (isLoaded) {
    return (
      <Container
        margin={margin}
        $margin={marginRepeater}
        padding={padding}
        $padding={paddingRepeater}
        ref={ref}
      >
        <QuoteContainer>
          <Quote
            dangerouslySetInnerHTML={{
              __html: responsiveList[selected]?.text,
            }}
          />
        </QuoteContainer>
        <List>
          {responsiveList?.map((item, idx) => (
            <Item key={idx}>
              <Dot
                active={selected === idx}
                image={item.logo.mediaItemUrl}
                stop={stop}
                onClick={() => setSelected(idx)}
              />
            </Item>
          ))}
        </List>
      </Container>
    )
  }

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
      ref={ref}
    >
      <QuoteContainer>
        <Quote
          dangerouslySetInnerHTML={{
            __html: null,
          }}
        />
      </QuoteContainer>
      <List></List>
    </Container>
  )
}

export const fragment = graphql`
  fragment QuoteImageFields on WpMediaItem {
    altText
    mediaItemUrl
    mediaDetails {
      height
      width
    }
  }
`

export const newFragments = graphql`
  fragment PreOrderQuotesFields on WpPreorder_Content_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }

  fragment NewAccordionQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }

  fragment NewBannerQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
  fragment NewBannerCarouselQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }

  fragment NewCarouselQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
  fragment NewColumnsQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
  fragment NewFiveColumnQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
  fragment NewFlexCarouselThumbQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
  fragment NewFlexCarouselContentQuotesFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Quotes {
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
    list {
      showOnMobile
      text
      logo {
        ...QuoteImageFields
      }
    }
  }
`
