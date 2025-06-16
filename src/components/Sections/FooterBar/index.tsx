import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Container from "./Container"
import Grid from "../../Layout/Grid"
import Content from "./Content"
import Column from "./Column"
import Title from "./Title"

export default function FooterBar() {
  return (
    <Container>
      <Grid>
        <Content>
          <Column>
            <StaticImage
              src="../../../images/mock/free-shipping.png"
              alt="Complimentary Shipping"
              height={18}
            />
            <Title>Complimentary Shipping</Title>
          </Column>
          <Column>
            <StaticImage
              src="../../../images/mock/30-day-returns-2.png"
              alt="30 Day Returns"
              height={18}
            />
            <Title>30 Day Returns</Title>
          </Column>
          <Column>
            <StaticImage
              src="../../../images/mock/warranty.png"
              alt="2 Year Warranty"
              height={18}
            />
            <Title>2 Year Warranty</Title>
          </Column>
        </Content>
      </Grid>
    </Container>
  )
}
