import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { Container } from "./Container"

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 800px) {
    column-count: 2;
    column-fill: balance;
    column-gap: 50px;
  }
`

const ListItem = styled.li`
  break-inside: avoid;
  margin: 0 0 20px;
  padding: 0 0 0 33%;

  @media (min-width: 800px) {
    padding: 0;
  }
`

const Title = styled.h6`
  color: ${({ colour }) => colour.mobile || `var(--black)`};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 30px;
  letter-spacing: 0.61px;
  margin: 0;
  text-transform: uppercase;

  @media (min-width: 800px) {
    color: ${({ colour }) => colour.desktop || `var(--black)`};
    font-size: 11px;
    line-height: 30px;
    letter-spacing: 0.61px;
  }
`

const Description = styled.p`
  color: ${({ colour }) => colour.mobile || `var(--gray)`};
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
  margin: 0;

  @media (min-width: 800px) {
    color: ${({ colour }) => colour.desktop || `var(--gray)`};
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 1px;
  }
`

export default function Specification({ data }) {
  const { margin, marginRepeater, padding, paddingRepeater, list } = data

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      <List>
        {list?.map(item => (
          <ListItem key={item.title.content}>
            <Title
              colour={item.title.colour}
              dangerouslySetInnerHTML={{ __html: item.title.content }}
            />
            <Description
              colour={item.description.colour}
              dangerouslySetInnerHTML={{ __html: item.description.content }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export const newFragments = graphql`
  fragment PreOrderSpecFields on WpPreorder_Content_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }

  fragment NewAccordionSpecFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewBannerSpecFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewBannerCarouselSpecFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewCarouselSpecFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewColumnsSpecFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewFiveColumnSpecFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewFlexCarouselThumbSpecFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
  fragment NewFlexCarouselContentSpecFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Specification {
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
      title {
        colour {
          desktop
          mobile
        }
        content
      }
      description {
        colour {
          desktop
          mobile
        }
        content
      }
    }
  }
`
