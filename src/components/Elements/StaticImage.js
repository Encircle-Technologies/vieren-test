import React from "react"
import useMediaQuery from "../../hooks/useMediaQuery"
import styled from "styled-components"

const Container = styled.div`
  background-color: #dedede;
  padding-top: ${({ $aspectRatio }) =>
    $aspectRatio.mobile
      ? `${$aspectRatio.mobile * 100}%`
      : `${$aspectRatio.desktop * 100}%`};
  position: relative;

  @media (min-width: 800px) {
    padding-top: ${({ $aspectRatio }) => `${$aspectRatio.desktop * 100}%`};
  }
`

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

export default function StaticImage({ image, hoverImage }) {
  const isDesktop = useMediaQuery("(min-width: 800px)", false)
  const hasMobileImage = !!image.mobile
  const hasMobileHoverImage = !!hoverImage.image.mobile

  return (
    <Container
      $aspectRatio={{
        mobile: hasMobileImage
          ? image.mobile.mediaDetails.height / image.mobile.mediaDetails.width
          : null,
        desktop:
          image.desktop.mediaDetails.height / image.desktop.mediaDetails.width,
      }}
    >
      <Image
        src={
          isDesktop || !hasMobileImage
            ? image.desktop.mediaItemUrl
            : image.mobile.mediaItemUrl
        }
      />
    </Container>
  )
}
