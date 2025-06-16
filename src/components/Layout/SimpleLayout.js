import React from "react"
import { Link, navigate } from "gatsby"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js/pure"
import styled from "styled-components"
import GlobalStyles from "../../styles/GlobalStyles"
import NormalizeStyles from "../../styles/NormalizeStyles"
import Grid from "./Grid"
import { LinkAsButton } from "../Elements/Link"
import Logo from "../../images/logos/logo_white_small.svg"
import BackArrow from "../../images/icons/back-arrow.svg"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Content = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
`

const Header = styled.div`
  background-color: var(--gray);
`

const HeaderContent = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
`

export default function SimpleLayout({ children, isOrder = false }) {
  const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

  return (
    <>
      <NormalizeStyles />
      <GlobalStyles />
      <Container>
        <Header>
          <Grid>
            <HeaderContent>
              {!isOrder ? (
                <LinkAsButton onClick={() => navigate(-1)}>
                  <BackArrow />
                </LinkAsButton>
              ) : (
                <div />
              )}
              <Link to="/">
                <Logo style={{ display: "block", height: "30px" }} />
              </Link>
              <div style={{ width: "31px" }} />
            </HeaderContent>
          </Grid>
        </Header>
        <Elements
          stripe={stripePromise}
          options={{
            fonts: [
              {
                cssSrc:
                  "https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap",
              },
            ],
          }}
        >
          <Content>{children}</Content>
        </Elements>
      </Container>
    </>
  )
}
