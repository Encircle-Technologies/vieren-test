import React from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import Grid from "../../components/Layout/Grid"
import { H2 } from "../../components/Elements/H2"
import { H5 } from "../../components/Elements/H5"
import { P } from "../../components/Elements/P"
import { ButtonAsButton } from "../../components/Elements/Button"

const Container = styled.section`
  padding: 200px 0;

  @media (min-width: 800px) {
    padding: 300px 0 230px;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 800px) {
    max-width: 500px;
    margin: auto;
  }
`

const Headline = styled(H2)`
  color: var(--black);
  text-align: center;
`

const Description = styled(P)`
  color: var(--gray);
  margin: 0 0 20px;
  text-align: center;
`
const Subheadline = styled(H5)`
  color: #767676;
  text-align: center;
  text-transform: uppercase;
  margin: 0 0 6px;
`

const AccessCode = styled.span`
  color: var(--black);
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 28px;
  line-height: 26px;
  letter-spacing: 1.7px;
  margin: 0 0 28px;
`

export default function WelcomeToTheFamilyPage() {
  return (
    <Container>
      <Grid>
        <Content>
          <Headline>Welcome to the Family!</Headline>
          <Description>Show us this confirmation to get your gift.</Description>
          <Description
            css={`
              margin: 0 0 25px;

              @media (min-width: 800px) {
                margin: 0 0 50px;
              }
            `}
          >
            As part of the family, you’ll get first access to pre-order our new
            leather dress watch: Black Croc
          </Description>
          <Subheadline>Your Access Code</Subheadline>
          <AccessCode>#icelebrateny</AccessCode>
          <ButtonAsButton
            flex
            type="button"
            css={`
              max-width: 275px;
            `}
            onClick={() => navigate("/watches/black-croc")}
          >
            Preview
          </ButtonAsButton>
        </Content>
      </Grid>
    </Container>
  )
}
