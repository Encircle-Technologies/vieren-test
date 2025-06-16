import React, { useEffect, useRef } from "react"
import { useLocation } from "@reach/router"
import styled from "styled-components"
import { BackgroundImage } from "../Elements/Image"
import { BackgroundVideo } from "../Elements/Video"
import { margin, padding } from "../../styles/spacing"

const Container = styled.section`
  background-color: ${({ colour }) => colour?.mobile || `#000000`};
  box-sizing: border-box;
  ${({ stacking }) =>
    stacking === "end"
      ? `
    display: flex;
    flex-direction: column;
  `
      : `display: block;`}
  overflow: hidden;
  position: relative;

  ${margin}

  @media (min-width: 800px) {
    background-color: ${({ colour }) => colour?.mobile || `#000000`};
  }
`

const Background = styled.div`
  display: block;
  height: auto;
  width: 100%;
  object-fit: cover;
  z-index: 0;
`

const Content = styled.div`
  box-sizing: border-box;
  position: ${({ kind, stacking }) =>
    kind === "colour" || stacking === "end" ? "relative" : "absolute"};

  top: 0;
  left: 0;
  /* height: ${({ stacking }) => (stacking === "center" ? "100%" : "auto")}; */
  height: 100%;
  width: 100%;
  /* Safari fix when translate3d is used on other components */
  transform: translate3d(0, 0, 0);

  ${padding}

  @media (min-width: 800px) {
    position: ${({ kind }) => (kind === "colour" ? "relative" : "absolute")};
  }
`

export default function Section({
  anchor,
  background,
  margin,
  $margin,
  padding,
  $padding,
  aboveFold,
  isPopup,
  stacking,
  children,
  ...props
}) {
  const { kind, image, video, colour } = background
  const minHeight =
    kind === "image"
      ? {
          desktop: image.desktop?.mediaDetails.height,
          mobile: image.mobile?.mediaDetails.height,
        }
      : kind === "video"
      ? {
          desktop:
            video?.media?.desktop?.mediaDetails?.height /
            video?.media?.desktop?.mediaDetails?.width,
          mobile:
            video?.media?.mobile?.mediaDetails?.height /
            video?.media?.mobile?.mediaDetails?.width,
        }
      : { desktop: null, mobile: null }
  const location = useLocation()
  const sectionRef = useRef(null)

  useEffect(() => {
    if (location.hash === `#${anchor}`) {
      process.env.NODE_ENV === "development" &&
        console.log("[Section] we got ourselves a match!")
      const element = sectionRef.current
      process.env.NODE_ENV === "development" && console.log(element)
      setTimeout(() => element?.scrollIntoView({ behavior: "smooth" }), 500)
    }
  }, [location, anchor])

  return (
    <Container
      ref={sectionRef}
      id={anchor}
      colour={colour}
      margin={margin}
      $margin={$margin}
      minHeight={minHeight}
      stacking={stacking}
      {...props}
    >
      <Background>
        {kind === "image" && (
          <BackgroundImage source={image} aboveFold={isPopup || aboveFold} />
        )}
        {kind === `video` && (
          <BackgroundVideo source={video} aboveFold={aboveFold} />
        )}
      </Background>
      <Content
        kind={kind}
        padding={padding}
        $padding={$padding}
        stacking={stacking}
      >
        {children}
      </Content>
    </Container>
  )
}
