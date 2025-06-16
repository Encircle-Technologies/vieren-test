import React, { useRef, useState, useEffect } from "react"
import ReactDOM from "react-dom"
import { graphql, Link } from "gatsby"
import styled from "styled-components"
import { useInView } from "react-intersection-observer"
import { Container } from "./Container"
import Youtube from "react-youtube"

import useMediaQuery from "../../hooks/useMediaQuery"

const Wrapper = styled.div``

const Content = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  /* margin: 0 0 30px; */

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const Placeholder = styled.div`
  background-color: transparent;
  display: block;
  padding-top: ${({ $aspectRatio }) => `${$aspectRatio * 100}%`};
  position: relative;
  width: 100%;
`

const MobilePlaceholder = styled(Placeholder)`
  ${({ query }) => `
    @media ${query} {
      display: none;
    }
  `}
`

const DesktopPlaceholder = styled(Placeholder)`
  display: none;
  ${({ query }) => `
    @media ${query} {
      display: block;
    }
  `}
`

const FallbackPoster = styled.div`
  background-color: #dedede;
  ${({ $poster }) => `background-image: url(${$poster}?format=auto);`}
  background-position: center;
  background-size: auto 100%;
  background-repeat: none;

  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

const Player = styled.video`
  /* Formatting */
  background-color: transparent;
  cursor: pointer;
  display: block; /* Required to elimininate 4px gap on bottom from inline element */
  /* object-fit: cover; */
  z-index: 0;
  /* Sizing */

  height: auto;
  width: 100%;

  position: absolute;
  top: 0;
  left: 0;
`

export function BackgroundVideo({ source, query = "", aboveFold = false }) {
  // Destructure source object
  const { media, poster, options } = source
  // Hooks
  const videoRef = useRef(undefined)
  const [isAutoplaying, setIsAutoplaying] = useState(false)
  const isDesktop = useMediaQuery(query || "(min-width: 800px)")
  // Media Utilities
  const hasMobileMedia = !!media?.mobile?.mediaItemUrl
  const mobileAspectRatio = hasMobileMedia
    ? media.mobile?.mediaDetails?.height / media.mobile?.mediaDetails?.width
    : media.desktop?.mediaDetails?.height / media.desktop?.mediaDetails?.width
  const desktopAspectRatio =
    media.desktop?.mediaDetails?.height / media.desktop?.mediaDetails?.width
  const mobileMedia = media.mobile?.mediaItemUrl
  const desktopMedia = media.desktop?.mediaItemUrl

  // Poster Utilities
  const hasMobilePoster = !!poster?.mobile?.mediaItemUrl
  const hasDesktopPoster = !!poster?.desktop?.mediaItemUrl
  const mobilePoster = hasMobilePoster ? poster?.mobile?.mediaItemUrl : null
  const desktopPoster = poster?.desktop?.mediaItemUrl

  useEffect(() => {
    const v = videoRef.current

    const handlePlaying = () => {
      process.env.NODE_ENV === "development" && console.log("video is playing")
      setIsAutoplaying(true)
    }

    if (!isDesktop) {
      v?.addEventListener("playing", handlePlaying)
    }

    return () => v?.removeEventListener("playing", handlePlaying)
  }, [isDesktop, setIsAutoplaying])

  useEffect(() => {
    const v = videoRef.current

    if (!isDesktop && videoRef.current && options?.muted) {
      v.defaultMuted = true
      v.muted = true
      v.setAttribute("muted", "")
    }
  }, [isDesktop, options?.muted])

  return (
    <Wrapper>
      <MobilePlaceholder
        $aspectRatio={mobileAspectRatio}
        query={query || "(min-width: 800px)"}
      >
        <Player
          {...options?.reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: true,
            }),
            {}
          )}
          playsInline
          preload="metadata"
          poster={
            hasMobilePoster && hasMobileMedia
              ? `${mobilePoster}?format=auto&width=800`
              : !hasMobileMedia && hasDesktopPoster
              ? `${desktopPoster}?format=auto&width=800`
              : null
          }
          ref={videoRef}
        >
          {!isDesktop && (
            <source
              src={hasMobileMedia ? mobileMedia : desktopMedia}
              type={
                hasMobileMedia
                  ? media.mobile?.mimeType
                  : media.desktop?.mimeType
              }
            />
          )}
        </Player>
        {!isAutoplaying && (
          <FallbackPoster
            $poster={mobilePoster}
            onClick={() => videoRef?.current?.play()}
          />
        )}
      </MobilePlaceholder>
      <DesktopPlaceholder
        $aspectRatio={desktopAspectRatio}
        query={query || "(min-width: 800px)"}
      >
        <Player
          {...options?.reduce((acc, curr) => {
            acc[curr] = true
            return acc
          }, {})}
          playsInline
          preload="metadata"
          poster={`${desktopPoster}?format=auto&width=1920`}
        >
          {isDesktop && (
            <source
              src={media.desktop?.mediaItemUrl}
              type={media.desktop?.mimeType}
            />
          )}
        </Player>
      </DesktopPlaceholder>
    </Wrapper>
  )
}

function InternalVideo({ internal, isLoaded }) {
  // Hooks
  const isDesktop = useMediaQuery("(min-width: 800px)")
  // Media Utilities
  const hasMobileMedia = !!internal?.video?.media?.mobile?.mediaItemUrl
  const mobileAspectRatio =
    internal?.video.media.mobile?.mediaDetails?.height /
    internal?.video.media.mobile?.mediaDetails?.width
  const desktopAspectRatio =
    internal?.video.media.desktop?.mediaDetails?.height /
    internal?.video.media.desktop?.mediaDetails?.width
  const mobileMedia = internal?.video?.media?.mobile?.mediaItemUrl
  const desktopMedia = internal?.video?.media?.desktop?.mediaItemUrl
  // Poster Utilities
  const hasMobilePoster = !!internal?.video?.poster?.mobile?.mediaItemUrl
  const hasDesktopPoster = !!internal?.video?.poster?.desktop?.mediaItemUrl
  const mobilePoster = hasMobilePoster
    ? internal?.video?.poster?.mobile.mediaItemUrl
    : null
  const desktopPoster = hasDesktopPoster
    ? internal?.video?.poster?.desktop?.mediaItemUrl
    : null
  return (
    <>
      <MobilePlaceholder
        $aspectRatio={hasMobileMedia ? mobileAspectRatio : desktopAspectRatio}
        query={"(min-width: 800px)"}
      >
        <Player
          {...internal?.video?.options?.reduce((acc, curr) => {
            acc[curr] = true
            return acc
          }, {})}
          playsInline
          preload="auto"
          poster={
            hasMobilePoster && hasMobileMedia
              ? `${mobilePoster}?format=auto&width=800`
              : !hasMobileMedia && hasDesktopPoster
              ? `${desktopPoster}?format=auto&width=800`
              : null
          }
        >
          {isLoaded && !isDesktop && (
            <source
              src={hasMobileMedia ? mobileMedia : desktopMedia}
              type={
                hasMobileMedia
                  ? internal?.video?.media?.mobile?.mimeType
                  : internal?.video?.media?.desktop?.mimeType
              }
            />
          )}
        </Player>
      </MobilePlaceholder>
      <DesktopPlaceholder
        $aspectRatio={desktopAspectRatio}
        query={"(min-width: 800px)"}
      >
        <Player
          {...internal?.video?.options?.reduce((acc, curr) => {
            acc[curr] = true
            return acc
          }, {})}
          playsInline
          preload="metadata"
          poster={`${desktopPoster}?format=auto&width=1920`}
        >
          {isLoaded && isDesktop && (
            <source
              src={desktopMedia}
              type={internal?.video?.media?.desktop?.mimeType}
            />
          )}
        </Player>
      </DesktopPlaceholder>
    </>
  )
}

function ExternalVideo({ external, isLoaded }) {
  const [isOpen, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 800px)")
  const hasMobilePoster = !!external?.poster?.mobile?.mediaItemUrl
  const hasDesktopPoster = !!external?.poster?.desktop?.mediaItemUrl
  const mobilePoster = hasMobilePoster
    ? external?.poster?.mobile?.mediaItemUrl
    : null
  const desktopPoster = hasDesktopPoster
    ? external?.poster?.desktop?.mediaItemUrl
    : null
  const mobileAspectRatio =
    external?.poster.mobile?.mediaDetails?.height /
    external?.poster.mobile?.mediaDetails?.width
  const desktopAspectRatio =
    external?.poster.desktop?.mediaDetails?.height /
    external?.poster.desktop?.mediaDetails?.width

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("noscroll")
    } else {
      document.body.classList.remove("noscroll")
    }
  }, [isOpen])

  if (hasMobilePoster && hasDesktopPoster) {
    return (
      <>
        <MobilePlaceholder
          $aspectRatio={mobileAspectRatio}
          query={"(min-width: 800px)"}
        >
          {!isDesktop && (
            <>
              <Player
                preload="metadata"
                poster={
                  hasMobilePoster
                    ? `${mobilePoster}?format=auto&width=800`
                    : hasDesktopPoster
                    ? `${desktopPoster}?format=auto&width=800`
                    : null
                }
                onClick={() => setOpen(true)}
              />
              {isOpen && (
                <VideoModal embed={external.embed} setOpen={setOpen} />
              )}
            </>
          )}
        </MobilePlaceholder>
        <DesktopPlaceholder
          $aspectRatio={desktopAspectRatio}
          query={"(min-width: 800px)"}
        >
          {isDesktop && (
            <>
              <Player
                preload="metadata"
                poster={`${desktopPoster}?format=auto&width=1920`}
                onClick={() => setOpen(true)}
              />
              {isOpen && (
                <VideoModal embed={external.embed} setOpen={setOpen} />
              )}
            </>
          )}
        </DesktopPlaceholder>
      </>
    )
  } else if (hasDesktopPoster && !hasMobilePoster) {
    return (
      <Placeholder $aspectRatio={desktopAspectRatio}>
        <Player
          preload="metadata"
          poster={`${desktopPoster}?format=auto&width=1920`}
          onClick={() => setOpen(true)}
        />
        {isOpen && <VideoModal embed={external.embed} setOpen={setOpen} />}
      </Placeholder>
    )
  } else if (!hasDesktopPoster && hasMobilePoster) {
    return (
      <Placeholder $aspectRatio={mobileAspectRatio}>
        <Player
          preload="metadata"
          poster={`${mobilePoster}?format=auto&width=800`}
          onClick={() => setOpen(true)}
        />
        {isOpen && <VideoModal embed={external.embed} setOpen={setOpen} />}
      </Placeholder>
    )
  } else {
    return (
      <Content>
        {isLoaded && <Youtube videoId={external.embed.split("watch?v=")[1]} />}
      </Content>
    )
  }
}

function VideoModal({ embed, setOpen }) {
  const isDesktop = useMediaQuery("(min-width: 800px)")

  useEffect(() => {
    const handleEscape = event => {
      if (event.code === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", handleEscape)

    return () => document.removeEventListener("keydown", handleEscape)
  }, [setOpen])

  return (
    <Modal>
      <div
        css={`
          background-color: var(--black);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: scroll;
          padding: 50px;

          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1000;
        `}
      >
        <div
          css={`
            position: absolute;
            top: 10px;
            right: 10px;
          `}
        >
          <button
            aria-label="Close Video"
            onClick={() => setOpen(false)}
            css={`
              background: transparent;
              border: none;
              border-radius: 0;
              height: 25px;
              width: 25px;
              padding: 0;
              position: relative;

              &::before,
              &::after {
                background-color: var(--white);
                content: "";
                display: block;
                height: 2px;
                width: 16px;

                position: absolute;
                top: 50%;
                left: 50%;
              }

              &::before {
                transform: translate3d(-50%, -50%, 0) rotate(45deg);
              }
              &::after {
                transform: translate3d(-50%, -50%, 0) rotate(135deg);
              }
            `}
          />
        </div>
        <div
          css={`
            position: relative;
          `}
        >
          <Content>
            <Youtube
              videoId={embed.split("watch?v=")[1]}
              opts={{
                playerVars: {
                  autoplay: 1,
                  playsinline: isDesktop ? 1 : 0,
                  modestbranding: 1,
                  enablejsapi: 1,
                },
              }}
              onReady={e => {
                e.target.playVideo()
              }}
              onPlay={e => {
                if (isDesktop) {
                  e.target.setPlaybackQuality("hd1080")
                } else {
                  e.target.setPlaybackQuality("hd720")
                }
              }}
            />
          </Content>
        </div>
      </div>
    </Modal>
  )
}

function Modal({ children, root = null }) {
  const modalRoot = root || document.body
  const el = document.createElement("div")

  useEffect(() => {
    modalRoot.appendChild(el)

    return () => {
      modalRoot.removeChild(el)
    }
  }, [el, modalRoot])

  return ReactDOM.createPortal(children, el)
}

export function Video({ data }) {
  const { ref, inView } = useInView()
  const [isLoaded, setLoaded] = useState(false)
  const {
    kind,
    external,
    wpInternal: internal,
    link,
    margin,
    marginRepeater,
    padding,
    paddingRepeater,
  } = data

  useEffect(() => {
    if (inView && isLoaded === false) {
      setLoaded(true)
    }
  }, [inView, isLoaded, setLoaded])

  if (kind === "external")
    return (
      <Container
        margin={margin}
        $margin={marginRepeater}
        padding={padding}
        $padding={paddingRepeater}
        ref={ref}
      >
        {link?.kind === "internal" ? (
          <Link to={link?.page?.uri} style={{ display: "block" }}>
            <ExternalVideo external={external} isLoaded={isLoaded} />
          </Link>
        ) : link?.kind === "external" ? (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block" }}
          >
            <ExternalVideo external={external} isLoaded={isLoaded} />
          </a>
        ) : (
          <ExternalVideo external={external} isLoaded={isLoaded} />
        )}
      </Container>
    )

  return (
    <Container
      margin={margin}
      $margin={marginRepeater}
      padding={padding}
      $padding={paddingRepeater}
      ref={ref}
    >
      {link?.kind === "internal" ? (
        <Link to={link?.page?.uri} style={{ display: "block" }}>
          <InternalVideo internal={internal} isLoaded={isLoaded} />
        </Link>
      ) : link?.kind === "external" ? (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block" }}
        >
          <InternalVideo internal={internal} isLoaded={isLoaded} />
        </a>
      ) : (
        <InternalVideo internal={internal} isLoaded={isLoaded} />
      )}
    </Container>
  )
}

export const videoFragment = graphql`
  fragment VideoFields on WpMediaItem {
    mimeType
    mediaItemUrl
    mediaDetails {
      height
      width
    }
  }
`

export const posterFragment = graphql`
  fragment MobilePosterFields on WpMediaItem {
    mediaItemUrl
    mediaDetails {
      height
      width
    }
  }
  fragment DesktopPosterFields on WpMediaItem {
    mediaItemUrl
    mediaDetails {
      height
      width
    }
  }
`

export const newFragments = graphql`
  fragment PreOrderVideoFields on WpPreorder_Content_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }

  fragment NewAccordionVideoFields on WpTemplate_2021Default_Acf2021_Layouts_Accordion_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewBannerVideoFields on WpTemplate_2021Default_Acf2021_Layouts_Banner_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewBannerCarouselVideoFields on WpTemplate_2021Default_Acf2021_Layouts_BannerCarousel_banners_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewCarouselVideoFields on WpTemplate_2021Default_Acf2021_Layouts_Carousel_slides_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewColumnsVideoFields on WpTemplate_2021Default_Acf2021_Layouts_Columns_columns_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewFiveColumnVideoFields on WpTemplate_2021Default_Acf2021_Layouts_FiveColumn_columns_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewFlexCarouselThumbVideoFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Thumbnail_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
  fragment NewFlexCarouselContentVideoFields on WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel_slides_Content_Elements_Video {
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
    kind
    external {
      poster {
        desktop {
          ...DesktopPosterFields
        }
        mobile {
          ...MobilePosterFields
        }
      }
      embed
    }
    wpInternal {
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
    link {
      kind
      page {
        __typename
        ... on WpPage {
          uri
          status
        }
        ... on WpPost {
          uri
          status
        }
        ... on WpProductPage {
          uri
          status
        }
      }
      url
    }
  }
`
