import React from "react"
import styled from "styled-components"
import Grid from "../Layout/Grid"

const ProductList = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;

  list-style: none;
  margin: 42px 0;
  padding: 0;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: max-content;
    gap: 60px;
    margin: 32px 0;
  }

  @media (min-width: 1280px) {
    gap: 100px;
    margin: 70px 0;
  }
`

export default function List({ children, ...props }) {
  return (
    <Grid>
      <ProductList {...props}>{children}</ProductList>
    </Grid>
  )
}
