import React, { useState, useEffect, useCallback } from "react"
import { graphql } from "gatsby"
import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import useEmblaCarousel from "embla-carousel-react"
import styled from "styled-components"
import { motion, useCycle, AnimatePresence } from "framer-motion"
import CloseIcon from "../../images/icons/gallery-close.svg"

// NEW
import { BackgroundImage } from "../Elements/Image"
import { BackgroundVideo } from "../Elements/Video"
import useMediaQuery from "../../hooks/useMediaQuery"

const ImgButton = styled.div`
  .gatsby-image-wrapper img {
    cursor: url("/images/crosshair.svg"), crosshair;
  }

  width: 100%;

  position: absolute;
  top: 0;
  left: 0;
`

const Viewport = styled.div`
  overflow: hidden;
  position: relative;

  margin: -1px 0;

  @media (min-width: 1024px) {
    margin: 0 -1px;
  }
`

const Track = styled.div`
  display: flex;
  user-select: none;
  touch-action: pan-y;
  backface-visibility: hidden;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Slide = styled.div`
  /* min-width: 100vw; */
  flex: 0 0 100%;
  min-width: 0;
  position: relative;
`

const Placeholder = styled.div`
  display: block;
  position: relative;
`

const Dots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;

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

const CrossButton = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  height: 40px;
  width: 40px;

  position: absolute;
  bottom: 20px;
  right: calc(1 / 24 * 100vw);

  &::before,
  &::after {
    background: #979797;
    content: "";
    display: block;

    position: absolute;
    left: 10px;
    top: 20px;

    height: 1px;
    width: 20px;
    z-index: 2;
  }

  &::after {
    transform: rotate(90deg);
  }
`

const Lightbox = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  background: var(--white);
  overflow-y: scroll;

  z-index: 100;
`

const MenuToggle = styled.button`
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;

  position: fixed;
  top: calc(1 / 24 * 100vw);
  right: calc(1 / 24 * 100vw);
`

const Close = styled(CloseIcon)`
  fill: var(--black);

  g {
    fill: var(--black);
  }
`

const lightbox = {
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
  closed: { opacity: 0 },
}

const AUTOPLAY_INTERVAL = 3000

export function Carousel({ gallery, mediaGallery, handleClick }) {
  const [ref, inView] = useInView()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    loop: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const autoplay = useCallback(() => {
    if (!emblaApi) return
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext()
    } else {
      emblaApi.scrollTo(0)
    }
  }, [emblaApi])

  const { play, stop } = useRecursiveTimeout(autoplay, AUTOPLAY_INTERVAL)

  const scrollTo = useCallback(index => emblaApi && emblaApi.scrollTo(index), [
    emblaApi,
  ])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
  }, [emblaApi, setScrollSnaps, onSelect])

  useEffect(() => {
    if (inView) {
      play()
    }
  }, [play, inView])

  const isMediaGallery =
    mediaGallery && Array.isArray(mediaGallery) && mediaGallery.length > 0

  return (
    <Viewport ref={emblaRef}>
      <Track ref={ref}>
        {isMediaGallery &&
          mediaGallery?.map((media, index) => {
            return (
              <Slide key={index}>
                {media.kind === "image" && (
                  <BackgroundImage
                    source={{
                      mobile: media.image.mobile,
                      desktop: media.image.desktop,
                    }}
                    query={"(min-width: 1024px)"}
                    loading={index < 1 ? "eager" : "lazy"}
                  />
                )}
                {media.kind === "video" && (
                  <BackgroundVideo
                    source={media.video}
                    query={"(min-width: 1024px)"}
                  />
                )}
              </Slide>
            )
          })}
        {!isMediaGallery &&
          gallery?.map(({ media }, index) => {
            const imageSources = {
              mobile: media.mobile,
              desktop: media.desktop,
            }
            // const isMobileImage = media.mobile.mediaType === "image"
            const isDesktopImage = media.desktop?.mediaType === "image"
            // const isMobileVideo =
            //   media.mobile.mediaType === "file" &&
            //   media.mobile.mimeType.includes("video")
            const isDesktopVideo =
              media.desktop?.mediaType === "file" &&
              media.desktop?.mimeType.includes("video")
            return (
              <Slide key={index}>
                {isDesktopImage && (
                  <BackgroundImage
                    source={imageSources}
                    query={"(min-width: 1024px)"}
                    loading={index < 1 ? "eager" : "lazy"}
                  />
                )}
                {isDesktopVideo && (
                  <BackgroundVideo
                    source={{
                      media: { mobile: media.mobile, desktop: media.desktop },
                      poster: { mobile: null, desktop: null },
                      options: ["autoPlay", "muted", "loop"],
                    }}
                    query={"(min-width: 1024px)"}
                  />
                )}
              </Slide>
            )
          })}
      </Track>
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
      {/* <CrossButton onClick={() => handleClick()} /> */}
    </Viewport>
  )
}

export default function Gallery({ gallery, mediaGallery }) {
  const [open, toggleOpen] = useCycle(false, true)
  const isDesktop = useMediaQuery("(min-width: 1024px)", false)

  const isMediaGallery =
    mediaGallery && Array.isArray(mediaGallery) && mediaGallery.length > 0

  const placeholderHeight = isMediaGallery
    ? mediaGallery?.reduce(
        (acc, curr) => ({
          mobile: curr.image.mobile
            ? acc.mobile +
              curr.image.mobile?.mediaDetails?.height /
                curr.image.mobile?.mediaDetails?.width
            : curr.image.desktop
            ? acc.mobile +
              curr.image.desktop?.mediaDetails?.height /
                curr.image.desktop?.mediaDetails?.width
            : curr.video.poster.mobile
            ? acc.mobile +
              curr.video.poster.mobile.mediaDetails?.height /
                curr.video.poster.mobile.mediaDetails?.width
            : curr.video.poster.desktop
            ? acc.mobile +
              curr.video.poster.desktop.mediaDetails?.height /
                curr.video.poster.desktop.mediaDetails?.width
            : acc.mobile,
          desktop: curr.image.desktop
            ? acc.desktop +
              curr.image.desktop?.mediaDetails?.height /
                curr.image.desktop?.mediaDetails?.width
            : curr.video.poster.desktop
            ? acc.desktop +
              curr.video.poster.desktop.mediaDetails?.height /
                curr.video.poster.desktop.mediaDetails?.width
            : acc.desktop,
        }),
        { mobile: 0, desktop: 0 }
      )
    : gallery?.reduce(
        (acc, curr) => ({
          mobile:
            acc.mobile + curr.media.mobile
              ? curr.media.mobile?.mediaDetails?.height /
                curr.media.mobile?.mediaDetails?.width
              : curr.media.desktop?.mediaDetails?.height /
                curr.media.desktop?.mediaDetails?.width,
          desktop:
            acc.desktop +
            curr.media.desktop?.mediaDetails?.height /
              curr.media.desktop?.mediaDetails?.width,
        }),
        { mobile: 0, desktop: 0 }
      )

  const mobileImagePlaceholder =
    // Uses the new mechanism and is an image
    isMediaGallery &&
    mediaGallery[0].kind === "image" &&
    mediaGallery[0].image.mobile
      ? mediaGallery[0].image.mobile?.mediaDetails?.height /
        mediaGallery[0].image.mobile?.mediaDetails?.width
      : isMediaGallery &&
        mediaGallery[0].kind === "image" &&
        mediaGallery[0].image.desktop
      ? mediaGallery[0].image.desktop?.mediaDetails?.height /
        mediaGallery[0].image.desktop?.mediaDetails?.width
      : // uses the new mechanism and is a video
      isMediaGallery && mediaGallery[0].kind === "video"
      ? mediaGallery[0].video.poster.mobile.mediaDetails?.height /
        mediaGallery[0].video.poster.mobile.mediaDetails?.width
      : // uses the old mechanism with mixed media
        gallery[0].media.mobile.mediaDetails?.height /
        gallery[0].media.mobile.mediaDetails?.width

  const desktopImagePlaceholder =
    // Uses the new mechanism and is an image
    isMediaGallery &&
    mediaGallery[0].kind === "image" &&
    mediaGallery[0].image.desktop
      ? mediaGallery[0].image.desktop?.mediaDetails?.height /
        mediaGallery[0].image.desktop?.mediaDetails?.width
      : // uses the new mechanism and is a video
      isMediaGallery && mediaGallery[0].kind === "video"
      ? mediaGallery[0].video.poster.mobile.mediaDetails?.height /
        mediaGallery[0].video.poster.mobile.mediaDetails?.width
      : // uses the old mechanism with mixed media
        gallery[0].media.mobile.mediaDetails?.height /
        gallery[0].media.mobile.mediaDetails?.width

  return (
    <>
      <Placeholder>
        <Carousel
          gallery={gallery}
          mediaGallery={mediaGallery}
          handleClick={toggleOpen}
        />
      </Placeholder>
      <AnimatePresence>
        {open && (
          <Lightbox
            initial="closed"
            animate="open"
            exit="closed"
            variants={lightbox}
          >
            {isMediaGallery &&
              mediaGallery?.map((media, index) => {
                return (
                  <div key={index}>
                    {media.kind === "image" && (
                      <BackgroundImage
                        source={media.image}
                        query={"(min-width: 1024px)"}
                      />
                    )}
                    {media.kind === "video" && (
                      <BackgroundVideo
                        source={media.video}
                        query={"(min-width: 1024px)"}
                      />
                    )}
                  </div>
                )
              })}
            <MenuToggle onClick={() => toggleOpen()}>
              <Close />
            </MenuToggle>
          </Lightbox>
        )}
      </AnimatePresence>
    </>
  )
}

export const mediaFragment = graphql`
  fragment MobileMixedMediaFields on WpMediaItem {
    altText
    mimeType
    mediaType
    mediaDetails {
      height
      width
    }
    mediaItemUrl
  }

  fragment MixedMediaFields on WpMediaItem {
    altText
    mimeType
    mediaType
    mediaDetails {
      height
      width
    }
    mediaItemUrl
  }
`
