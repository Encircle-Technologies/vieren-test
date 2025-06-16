import React from "react"
import styled from "styled-components"
import Grid from "../Layout/Grid"
import { H2 } from "../Elements/P"

const Container = styled.section`
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 100vh;
  width: 100%;
`

export default function NotFound() {
  return (
    <Grid>
      <Container>
        <H2>Page Not Found</H2>
      </Container>
    </Grid>
  )
}
