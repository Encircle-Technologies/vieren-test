import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Container from "./Container"
import Title from "./Title"

export const FREE_SHIPPING_TEXT = 'Complimentary shipping (duties included)';

export default function FreeShipping({ theme = "light" }) {
  return (
    <Container>
      {theme === "dark" ? (
        <StaticImage
          src={"../../../images/mock/shipping.png"}
          alt={FREE_SHIPPING_TEXT}
          height={16}
        />
      ) : (
        <StaticImage
          src={"../../../images/mock/free-shipping.png"}
          alt={FREE_SHIPPING_TEXT}
          height={16}
        />
      )}
      <Title theme={theme}>
        {FREE_SHIPPING_TEXT}
      </Title>
    </Container>
  )
}
