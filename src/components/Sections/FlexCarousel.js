import React, { useState, useEffect, useCallback } from "react"
import { graphql } from "gatsby"
import { getElements } from "../../utils/layout/elements"
import Section from "../Layout/Section"
import styled from "styled-components"
import { useInView } from "react-intersection-observer"
import { useEmblaCarousel } from "embla-carousel/react"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import ChevronRight from "../../images/icons/chevron-right.svg"
import ChevronLeft from "../../images/icons/chevron-left.svg"

const Carousel = styled.div`
  overflow: hidden;

  --padding: calc(1 / 24 * 100%);
  margin: 0 var(--padding);

  @media (min-width: 800px) {
    --padding: calc(1 / 30 * 100%);
  }

  /* Embla Carousel settings*/
  .viewport {
    box-sizing: border-box;
    overflow: hidden;
    /* padding: 0 var(--padding); */
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
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Slide = styled.div`
  min-width: 100%;
  position: relative;
`

const Thumbnails = styled.nav`
  display: flex;
  margin: 40px 0 0 calc(-1 * var(--padding));

  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Thumbnail = styled.div`
  cursor: pointer;

  min-width: calc(14 * var(--padding));
  padding: 0 calc(50px - var(--padding)) 0 var(--padding);
  position: relative;

  &:last-child {
    padding: 0 0 0 var(--padding);
  }

  @media (min-width: 800px) {
    min-width: calc(6.5 * var(--padding));
  }
`

const ThumbnailContent = styled.div`
  padding: 20px 0 0;
  position: relative;

  &::after {
    border: ${({ selected }) =>
      selected ? `2px solid #000000` : `1px solid #dddddd`};
    content: "";
    display: block;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
`

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: var(--padding);
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 0;
  ${({ next, prev }) =>
    next
      ? `right: calc((-1 * var(--padding)) - 12px);`
      : prev
      ? `left: calc((-1 * var(--padding)) - 12px);`
      : null}
  /* transform: translate3d(0, 50%, 0); */
  z-index: 1000;

  @media (min-width: 800px) {
  }
`

const NextArrow = styled(ChevronRight)`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`

const PrevArrow = styled(ChevronLeft)`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`

export default function FlexCarousel({ data }) {
  const {
    __typename,
    anchor,
    background,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
    slides = null,
  } = data

  const [ref, inView] = useInView()

  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    skipSnaps: false,
    loop: true,
  })
  const [EmblaCarouselThumbs, emblaThumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    align: "start",
    loop: true,
  })

  const [paused, setPaused] = useState(false)
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollNext = useCallback(() => {
    if (!embla) return
    embla.scrollNext()
  }, [embla])

  const scrollPrev = useCallback(() => {
    if (!embla) return
    embla.scrollPrev()
  }, [embla])

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return
    setSelectedIndex(embla.selectedScrollSnap())
    emblaThumbs.scrollTo(embla.selectedScrollSnap())
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla, emblaThumbs, setSelectedIndex])

  const onThumbClick = useCallback(
    index => {
      if (!embla || !emblaThumbs) return
      if (emblaThumbs.clickAllowed()) embla.scrollTo(index)
    },
    [embla, emblaThumbs]
  )

  const onPointerDown = useCallback(() => {
    if (!embla) return
    setPaused(true)
  }, [embla])

  const autoplay = useCallback(() => {
    if (!embla) return
    if (embla.canScrollNext()) {
      embla.scrollNext()
    } else {
      embla.scrollTo(0)
    }
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on("select", onSelect)
    embla.on("pointerDown", onPointerDown)
  }, [embla, onSelect, onPointerDown])

  useEffect(() => {
    if (!emblaThumbs) return
    emblaThumbs.on("pointerDown", onPointerDown)
  }, [emblaThumbs, onPointerDown])

  const { play, stop } = useRecursiveTimeout(autoplay, 3000)

  useEffect(() => {
    if (inView && !paused) {
      play()
    } else {
      stop()
    }
  }, [play, stop, inView, paused])

  return (
    <Section
      anchor={anchor}
      background={background}
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
    >
      <Carousel ref={ref}>
        <EmblaCarouselReact className="viewport">
          <Track>
            {slides.map((slide, index) => (
              <Slide key={index}>
                {getElements({
                  type: `${__typename}_slides_Content`,
                  elements: slide.content.elements,
                })}
              </Slide>
            ))}
          </Track>
        </EmblaCarouselReact>
        <div style={{ position: "relative" }}>
          <EmblaCarouselThumbs className="viewport">
            <Thumbnails>
              {slides.map((slide, index) => (
                <Thumbnail
                  key={index}
                  onClick={() => onThumbClick(index)}
                  aria-label={`Navigate to Slide ${index + 1}`}
                >
                  <ThumbnailContent selected={index === selectedIndex}>
                    {getElements({
                      type: `${__typename}_slides_Thumbnail`,
                      elements: slide.thumbnail.elements,
                    })}
                  </ThumbnailContent>
                </Thumbnail>
              ))}
            </Thumbnails>
          </EmblaCarouselThumbs>
          {prevBtnEnabled && (
            <ArrowButton prev onClick={scrollPrev} aria-label="Previous Slide">
              <PrevArrow />
            </ArrowButton>
          )}
          {nextBtnEnabled && (
            <ArrowButton next onClick={scrollNext} aria-label="Next Slide">
              <NextArrow />
            </ArrowButton>
          )}
        </div>
      </Carousel>
    </Section>
  )
}

export const fragment = graphql`
  fragment NewFlexCarouselFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel {
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
    slides {
      thumbnail {
        elements {
          __typename
          ...NewFlexCarouselThumbButtonFields
          ...NewFlexCarouselThumbCardFields
          ...NewFlexCarouselThumbDividerFields
          ...NewFlexCarouselThumbGalleryFields
          ...NewFlexCarouselThumbImageFields
          ...NewFlexCarouselThumbPreformattedTextFields
          ...NewFlexCarouselThumbQuotesFields
          ...NewFlexCarouselThumbSpecFields
          ...NewFlexCarouselThumbTextFields
          ...NewFlexCarouselThumbVideoFields
          ...NewFlexCarouselThumbFormFields
          ...NewFlexCarouselThumbCountdownFields
        }
      }
      content {
        elements {
          __typename
          ...NewFlexCarouselContentButtonFields
          ...NewFlexCarouselContentCardFields
          ...NewFlexCarouselContentDividerFields
          ...NewFlexCarouselContentGalleryFields
          ...NewFlexCarouselContentImageFields
          ...NewFlexCarouselContentPreformattedTextFields
          ...NewFlexCarouselContentQuotesFields
          ...NewFlexCarouselContentSpecFields
          ...NewFlexCarouselContentTextFields
          ...NewFlexCarouselContentVideoFields
          ...NewFlexCarouselContentFormFields
          ...NewFlexCarouselContentCountdownFields
        }
      }
    }
  }
`
