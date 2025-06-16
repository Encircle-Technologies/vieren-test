import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { Container } from "./Container"

const Content = styled.div`
  display: flex;
  justify-content: center;
`

const Unit = styled.div`
  min-width: 80px;
  position: relative;

  &::after {
    border-right: ${({ $colour }) =>
      $colour ? `1px solid ${$colour}` : `1px solid #838383`};
    content: "";
    display: block;

    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 0px;
  }

  &:last-child::after {
    display: none;
  }

  @media (min-width: 800px) {
    min-width: 110px;
  }
`

const Number = styled.span`
  color: ${({ $colour }) => $colour || "#fff"};
  display: block;
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 35px;
  letter-spacing: 1.1px;
  text-align: center;

  @media (min-width: 800px) {
    font-size: 38px;
    line-height: 43px;
    letter-spacing: 1.5px;
  }
`

const Caption = styled.span`
  color: ${({ $colour }) => $colour || "#fff"};
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.61px;
  text-align: center;

  @media (min-width: 800px) {
  }
`

export function getCountdown(date) {
  const currentDate = new Date().getTime()
  const endDate = new Date(date).getTime()

  const distance = endDate - currentDate

  if (distance > 0) {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    }
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }
}

export default function Countdown({ data }) {
  const {
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    endDate,
    textColour,
    dividerColour,
  } = data
  const [count, setCount] = useState(() => getCountdown(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedCount = getCountdown(data.endDate)

      setCount(updatedCount)
    }, [1000])

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Container
        margin={margin}
        $margin={marginRepeater}
        padding={padding}
        $padding={paddingRepeater}
      >
        <Content>
          <Unit $colour={dividerColour}>
            <Number $colour={textColour}>{count.days}</Number>
            <Caption $colour={textColour}>Days</Caption>
          </Unit>
          <Unit $colour={dividerColour}>
            <Number $colour={textColour}>{count.hours}</Number>
            <Caption $colour={textColour}>Hours</Caption>
          </Unit>
          <Unit $colour={dividerColour}>
            <Number $colour={textColour}>{count.minutes}</Number>
            <Caption $colour={textColour}>Minutes</Caption>
          </Unit>
          <Unit $colour={dividerColour}>
            <Number $colour={textColour}>{count.seconds}</Number>
            <Caption $colour={textColour}>Seconds</Caption>
          </Unit>
        </Content>
      </Container>
    </>
  )
}

export const newFragments = graphql`
  fragment PreOrderCountdownFields on WpPreorder_Content_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }

  fragment NewAccordionCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewBannerCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewBannerCarouselCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewCarouselCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewColumnsCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewFiveColumnCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewFlexCarouselThumbCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
  fragment NewFlexCarouselContentCountdownFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Countdown {
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
    textColour
    dividerColour
    endDate
  }
`
