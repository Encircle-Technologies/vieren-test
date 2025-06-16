import React from "react"
import { useCachedProductData } from "../../hooks/useProductData"
import styled from "styled-components"
import Grid from "./Grid"

const Bar = styled.div`
  border-bottom: 1px solid #dddddd;
  background: var(--white);
  display: ${({ transparent }) => (transparent ? `none` : `block`)};
  padding: 10px 0;

  @media (min-width: 800px) {
    padding: 20px 0;
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Name = styled.span`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 1px;
  margin: 0;

  flex: 1 0 70%;

  @media (min-width: 800px) {
    flex: 1 0 85%;

    font-size: 22px;
    line-height: 27px;
    letter-spacing: 1px;
  }
`

const Price = styled.span`
  display: none;

  @media (min-width: 800px) {
    display: inline-block;

    color: #767676;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 27px;
    letter-spacing: 0.67px;
    margin: 0 0 0 30px;
  }
`

export default function ProductBar({ product, transparent, children }) {
  const { price: cachedPrice, currency } = useCachedProductData(
    product?.databaseId
  )

  return (
    <Bar transparent={transparent}>
      <Grid>
        <Content>
          <Name>
            {product.name}
            <Price>
              {`${cachedPrice || ``}${cachedPrice && ` ${currency}`}`}
            </Price>
          </Name>
          {children}
        </Content>
      </Grid>
    </Bar>
  )
}
