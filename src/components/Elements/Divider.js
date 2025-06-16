import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { Container } from "./Container"

const Line = styled.hr`
  background-color: ${({ colour }) => colour.mobile || `#000000`};
  border: none;
  border-radius: 0;
  height: ${({ height }) => `${height}px` || `1px`};
  width: 100%;

  @media (min-width: 800px) {
    background-color: ${({ colour }) => colour.desktop || `#000000`};
  }
`

export default function Divider({ data }) {
  const {
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    colour,
    height,
  } = data

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      <Line colour={colour} height={height} />
    </Container>
  )
}

export const newFragments = graphql`
  fragment PreOrderDividerFields on WpPreorder_Content_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }

  fragment NewAccordionDividerFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewBannerDividerFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewBannerCarouselDividerFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewCarouselDividerFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewColumnsDividerFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewFiveColumnDividerFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewFlexCarouselThumbDividerFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
  fragment NewFlexCarouselContentDividerFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Divider {
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
    colour {
      desktop
      mobile
    }
    height
  }
`
