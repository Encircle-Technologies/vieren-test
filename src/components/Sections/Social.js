import React, { useState, useEffect, useCallback } from "react"
import { graphql } from "gatsby"

import { useInView } from "react-intersection-observer"
import { useRecursiveTimeout } from "../../hooks/useRecursiveTimeout"
import { useEmblaCarousel } from "embla-carousel/react"
import styled from "styled-components"
import InstagramIcon from "../../images/icons/instagram-brands.svg"
import FacebookIcon from "../../images/icons/facebook-f-brands.svg"
import YoutubeIcon from "../../images/icons/youtube-brands.svg"

const Section = styled.section`
  padding: 60px 0 0;
`

const Title = styled.h2`
  font-family: "vieren-type-regular", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 1px;
  margin: 0 0 20px;
  text-align: center;
`

const SocialBar = styled.div`
  display: flex;
  justify-content: center;
`

const IgIcon = styled(InstagramIcon)`
  color: #767676;
  display: block;
  height: 19px;
  margin-right: 20px;
`

const FbIcon = styled(FacebookIcon)`
  color: #767676;
  display: block;
  height: 19px;
  margin-right: 20px;
`

const YtIcon = styled(YoutubeIcon)`
  color: #767676;
  display: block;
  height: 19px;
`

const Container = styled.div`
  /* Embla Carousel settings*/
  .viewport {
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 calc(1 / 24 * 100vw);
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

  padding: 50px 0;

  @media (min-width: 1280px) {
    padding: 60px 0;
  }
`

const Track = styled.div`
  --padding: calc(-1 / 24 * 100vw);

  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin-left: var(--padding);
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

const Slide = styled.div`
  padding: 0 0 0 23px;
  position: relative;

  @media (min-width: 1280px) {
    padding: 0 0 0 40px;
  }
`

const Link = styled.a`
  display: block;
  height: 170px;
  width: 170px;
  position: relative;

  @media (min-width: 1280px) {
    height: 300px;
    width: 300px;
  }

  /* prettier-ignore */
  ${Slide}:nth-of-type(odd) & {
    height: 130px;
    width: 130px;

  /* prettier-ignore */
    @media (min-width: 1280px) {
      height: 240px;
      width: 240px;
    }
  }
`

const Image = styled.img`
  display: block;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  min-height: 100%;
  height: 100%;
  width: auto;
  min-width: 100%;
  max-width: none;
`

const AUTOPLAY_INTERVAL = 2000

function Carousel({ posts }) {
  const [ref, inView] = useInView({ threshold: 0 })
  const [EmblaCarouselReact, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  })

  const autoplay = useCallback(() => {
    if (!embla) return
    if (embla.canScrollNext()) {
      embla.scrollNext()
    } else {
      embla.scrollTo(0)
    }
  }, [embla])

  const { play, stop } = useRecursiveTimeout(autoplay, AUTOPLAY_INTERVAL)

  useEffect(() => {
    if (!embla) return
    embla.on("pointerDown", stop)
  }, [embla, stop])

  useEffect(() => {
    if (inView) {
      play()
    } else {
      stop()
    }
  }, [play, stop, inView])

  return (
    <Container ref={ref}>
      <EmblaCarouselReact className="viewport">
        <Track>
          {posts.map(post => (
            <Slide key={post.id}>
              <Link href={post.url} target="_blank" rel="noopener noreferrer">
                <Image src={post.src} alt="" loading="lazy" />
              </Link>
            </Slide>
          ))}
        </Track>
      </EmblaCarouselReact>
    </Container>
  )
}

export default function Social({ data }) {
  const [posts, setPosts] = useState([])

  const hasPosts = !!posts.length

  useEffect(() => {
    fetch("/.netlify/functions/instagram")
      .then(response => response.json())
      .then(result => setPosts(result))
  }, [])

  if (hasPosts && data.enabled)
    return (
      <Section>
        <Title>Follow our journey</Title>
        <SocialBar>
          <a
            href="https://instagram.com/vierentime"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IgIcon />
          </a>
          <a
            href="https://facebook.com/vierentime"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FbIcon />
          </a>
          <a
            href="http://bit.ly/vierenyoutube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YtIcon />
          </a>
        </SocialBar>
        <Carousel posts={posts} />
      </Section>
    )

  return null
}

export const fragment = graphql`
  fragment NewSocialFields on WpTemplate_2021Default_Acf2021_Layouts_Social {
    acfeFlexibleLayoutTitle
    enabled
  }
`
