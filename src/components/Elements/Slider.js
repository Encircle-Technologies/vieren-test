import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useEmblaCarousel } from "embla-carousel/react"
import { motion } from "framer-motion"
import ChevronRight from "../../images/icons/chevron-right.svg"
import ChevronLeft from "../../images/icons/chevron-left.svg"

const Container = styled.div`
  --padding: calc(1 / 24 * 100%);

  @media (min-width: 800px) {
    --padding: calc(1 / 30 * 100%);
  }

  /* Embla Carousel settings*/
  .viewport {
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 var(--padding);
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

const AltTrack = styled.div`
  display: flex;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Track = styled.div`
  display: flex;
  margin-left: calc(-1 * var(--padding));
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const AltSlide = styled.div`
  min-width: calc(12 * var(--padding));

  @media (min-width: 768px) {
  }
`

const Slide = styled.div`
  min-width: calc(18 * var(--padding));
  padding: 0 0 0 var(--padding);

  @media (min-width: 768px) {
    min-width: calc(23 * var(--padding) / 2);
  }

  @media (min-width: 1024px) {
    min-width: calc((28 * var(--padding) - (2 * var(--padding))) / 3);
  }
`

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: var(--padding);
  margin: 0;
  padding: 0;
  position: absolute;
  top: 50%;
  ${({ next, prev }) =>
    next ? `right: var(--padding);` : prev ? `left: 0;` : null}
  transform: translate3d(0, -50%, 0);
`

const NextArrow = styled(ChevronRight)`
  display: none;
  /* position: absolute; */
  /* top: 50%; */
  /* right: 16px; */

  /* transform: translate3d(0, -50%, 0); */

  @media (min-width: 768px) {
    display: block;
  }
`

const PrevArrow = styled(ChevronLeft)`
  display: none;
  /* position: absolute; */
  /* top: 50%; */
  /* left: 16px; */

  /* transform: translate3d(0, -50%, 0); */

  @media (min-width: 768px) {
    display: block;
  }
`

const ProgressBar = styled.div`
  height: 1px;
  background: ${({ theme }) => (theme === "dark" ? "var(--white)" : "#bbbbbb")};
  margin: 48px calc(2 * var(--padding)) 0 var(--padding);
  position: relative;
`

const ProgressTrack = styled(motion.div)`
  background: ${({ theme }) => (theme === "dark" ? `#767676` : `var(--black)`)};
  height: 2px;
  width: 0;

  position: absolute;
  bottom: 0;
`

const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 20px;
  width: 100%;

  padding: 10px 0;
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

export function AltSlider({ settings, children }) {
  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    ...settings,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

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
  }, [embla, setScrollSnaps, onSelect])

  return (
    <Container>
      <EmblaCarouselReact className="viewport">
        <AltTrack>
          {children &&
            children.map((child, index) => (
              <AltSlide key={index}>{child}</AltSlide>
            ))}
        </AltTrack>
        {scrollSnaps.length > 1 && (
          <Dots>
            {scrollSnaps.map((_, index) => (
              <Dot
                key={index}
                selected={index === selectedIndex}
                onClick={() => scrollTo(index)}
                aria-label={`Navigate to Image ${index}`}
              />
            ))}
          </Dots>
        )}
      </EmblaCarouselReact>
    </Container>
  )
}

export default function Slider({ theme, settings, children }) {
  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    ...settings,
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])

  const onSelect = useCallback(() => {
    if (!embla) return
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla])

  const onScroll = useCallback(() => {
    if (!embla) return

    const current = embla.selectedScrollSnap() + 1
    const total = embla.scrollSnapList().length

    const progress = Math.max(0, Math.min(1, current / total))
    // const progress = Math.max(0, Math.min(1, embla.scrollProgress()))

    setScrollProgress(progress * 100)
  }, [embla, setScrollProgress])

  useEffect(() => {
    if (!embla) return
    onSelect()
    onScroll()
    embla.on("select", onSelect)
    embla.on("scroll", onScroll)
  }, [embla, onSelect, onScroll])

  return (
    <Container>
      <EmblaCarouselReact className="viewport">
        <Track>
          {children &&
            children.map((child, index) => <Slide key={index}>{child}</Slide>)}
        </Track>
        {prevBtnEnabled && (
          <ArrowButton
            prev
            type="button"
            onClick={scrollPrev}
            aria-label="Previous"
          >
            <PrevArrow />
          </ArrowButton>
        )}
        {nextBtnEnabled && (
          <ArrowButton
            next
            type="button"
            onClick={scrollNext}
            aria-label="Next"
          >
            <NextArrow />
          </ArrowButton>
        )}
      </EmblaCarouselReact>
      <ProgressBar theme={theme}>
        <ProgressTrack
          animate={{
            width: `${scrollProgress}%`, // convert back to # slide
          }}
          theme={theme}
        />
      </ProgressBar>
    </Container>
  )
}
