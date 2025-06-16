import React, { useState, useEffect, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import { useEmblaCarousel } from "embla-carousel/react"
import styled from "styled-components"
import { Container } from "./Container"
import { BackgroundImage } from "./Image"
import { BackgroundVideo } from "./Video"
import { Link } from "gatsby"

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

const Video = styled.video`
  background-color: #dedede;
  display: block;
  height: auto;
  width: 100%;
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

export default function MixedGallery({ data }) {
  const [ref, inView] = useInView({
    threshold: 0,
  })
  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    containScroll: "trimSnaps",
    loop: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const { marginRepeater, paddingRepeater, mGallery } = data

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

  // const scrollNext = useCallback(() => {
  //   if (!embla) return
  //   embla.scrollNext()
  //   stop()
  // }, [embla, stop])

  // const scrollPrev = useCallback(() => {
  //   if (!embla) return
  //   embla.scrollPrev()
  //   stop()
  // }, [embla, stop])

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
    <Container $margin={marginRepeater} $padding={paddingRepeater}>
      <Carousel ref={ref}>
        <EmblaCarouselReact className="viewport">
          <Track>
            {mGallery?.map((item, index) => {
              if (
                item.link.kind === "internal" &&
                item.link.internalLink?.uri
              ) {
                return (
                  <Slide key={index}>
                    <Link to={item.link.internalLink.uri}>
                      {item.kind === "image" && (
                        <BackgroundImage
                          source={item.image}
                          ignoreArtDirection={true}
                        />
                      )}
                      {item.kind === "video" && (
                        <BackgroundVideo source={item.video} />
                      )}
                    </Link>
                  </Slide>
                )
              }

              if (item.link.kind === "external") {
                return (
                  <Slide key={index}>
                    <a
                      href={item.link.externalLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {item.kind === "image" && (
                        <BackgroundImage
                          source={item.image}
                          ignoreArtDirection={true}
                        />
                      )}
                      {item.kind === "video" && (
                        <BackgroundVideo source={item.video} />
                      )}
                    </a>
                  </Slide>
                )
              }

              return (
                <Slide key={index}>
                  {item.kind === "image" && (
                    <BackgroundImage
                      source={item.image}
                      ignoreArtDirection={true}
                    />
                  )}
                  {item.kind === "video" && (
                    <BackgroundVideo source={item.video} />
                  )}
                </Slide>
              )
            })}
          </Track>
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
      </Carousel>
    </Container>
  )
}
