import React, { useState, useEffect, useCallback } from "react"
import { graphql } from "gatsby"
import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"

import { useEmblaCarousel } from "embla-carousel/react"
import styled from "styled-components"
import Link from "../Elements/Link"
import Banner from "./Banner"

const Carousel = styled.div`
  /* padding: 30px calc(1 / 24 * 100vw); */
  padding: 0;

  /* Embla Carousel settings*/
  .viewport {
    box-sizing: border-box;
    overflow: hidden;
    /* padding: 0 calc(1 / 24 * 100vw); */
    position: relative;
    width: 100%;
  }

  .viewport.is-draggable {
    cursor: move;
    cursor: grab;
  }

  .viewport.is-dragging {
    cursor: grabbing;
  }
`

const Track = styled.div`
  display: flex;
  margin-left: var(--padding);
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Slide = styled.div`
  min-width: 100%;
  position: relative;
`

const Dots = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 20px;
  width: 100%;
`

const Dot = styled.button`
  background: transparent;
  border: none;
  border-radius: none;
  padding: 10px;
  position: relative;

  &::before {
    content: "";
    background: ${({ selected }) => (selected ? "var(--black)" : "#bbbbbb")};
    height: ${({ selected }) => (selected ? "9px" : "5px")};
    width: ${({ selected }) => (selected ? "9px" : "5px")};

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
`

const AUTOPLAY_INTERVAL = 5000

export default function BannerCarousel({ data, aboveFold }) {
  const [ref, inView] = useInView({
    threshold: 0,
  })
  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    containScroll: "trimSnaps",
    loop: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const autoplay = useCallback(() => {
    if (!embla) return
    if (embla.canScrollNext()) {
      embla.scrollNext()
    } else {
      embla.scrollTo(0)
    }
  }, [embla])

  const { play, stop } = useRecursiveTimeout(autoplay, AUTOPLAY_INTERVAL)

  const scrollTo = useCallback(index => embla && embla.scrollTo(index), [embla])

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on("select", onSelect)
    embla.on("pointerDown", stop)
  }, [embla, setScrollSnaps, onSelect, stop])

  useEffect(() => {
    if (inView) {
      play()
    } else {
      stop()
    }
  }, [play, stop, inView])

  return (
    <Carousel ref={ref}>
      <EmblaCarouselReact className="viewport">
        <Track>
          {data.banners.map((banner, index) => (
            <Slide key={index}>
              {banner.link.kind !== "none" ? (
                <Link
                  to={
                    banner?.link?.kind === "internal"
                      ? banner?.link?.internalLink?.uri
                      : banner?.link?.externalLink
                  }
                >
                  <Banner
                    data={{
                      ...banner,
                      __typename: `${data.__typename}_banners`,
                    }}
                    aboveFold={aboveFold}
                    style={{ height: "100%" }}
                  />
                </Link>
              ) : (
                <Banner
                  data={{
                    ...banner,
                    __typename: `${data.__typename}_banners`,
                  }}
                  aboveFold={aboveFold}
                />
              )}
            </Slide>
          ))}
        </Track>
        {scrollSnaps.length > 1 && (
          <Dots>
            {scrollSnaps.map((_, index) => (
              <Dot
                key={index}
                selected={index === selectedIndex}
                onClick={() => scrollTo(index)}
                aria-label={`Navigate to Banner ${index}`}
              />
            ))}
          </Dots>
        )}
      </EmblaCarouselReact>
    </Carousel>
  )
}

export const fragments = graphql`
  fragment NewBannerCarouselFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel {
    acfeFlexibleLayoutTitle
    banners {
      link {
        kind
        internalLink {
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
        externalLink
      }
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
      placement
      stacking
      elements {
        __typename
        ...NewBannerCarouselButtonFields
        ...NewBannerCarouselCardFields
        ...NewBannerCarouselDividerFields
        ...NewBannerCarouselGalleryFields
        ...NewBannerCarouselImageFields
        ...NewBannerCarouselPreformattedTextFields
        ...NewBannerCarouselQuotesFields
        ...NewBannerCarouselSpecFields
        ...NewBannerCarouselTextFields
        ...NewBannerCarouselVideoFields
        ...NewBannerCarouselFormFields
        ...NewBannerCarouselCountdownFields
      }
    }
  }
`
