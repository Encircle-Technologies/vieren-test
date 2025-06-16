import React from "react"
import { Link } from "gatsby"
import { connectHits } from "react-instantsearch-dom"
import styled from "styled-components"
import { Highlight } from "./Highlight"

import { useCachedProductData } from "../../hooks/useProductData"

const List = styled.ol`
  list-style: none;
  margin: 0 0 30px;
  padding: 0;
`

const Grid = styled.ol`
  display: grid;
  grid-template-columns: 1fr;
  gap: 35px;
  list-style: none;
  margin: 0 0 50px;
  padding: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Item = styled.li`
  border-top: 1px solid #bbbbbb;
  display: flex;
  padding: 20px;
`

const TextItem = styled.li`
  margin: 0 0 30px;

  &:last-child {
    margin: 0;
  }
`

const Card = styled.li`
  display: flex;
  flex-direction: column;
`

const Image = styled.img`
  display: block;
  width: 80px;
`

const Result = styled.div`
  margin: 0 0 0 20px;
`

const Price = styled.span`
  color: #767676;
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 27px;
  letter-spacing: 0.67px;
  text-align: center;
`

const Divider = styled.hr`
  border: 1px solid #dddddd;
  margin: 0 0 30px;
`

const ProductAutocomplete = ({ hits, handleRefine }) => (
  <List>
    {hits.map(hit => (
      <Item key={hit.objectID} onClick={() => handleRefine(hit.title)}>
        <Image src={hit.image} loading="lazy" />
        <Result>
          <Highlight
            hit={hit}
            attribute="title"
            style={{ fontWeight: 700, margin: "0 0 10px" }}
          />
          <Highlight hit={hit} attribute="summary" />
        </Result>
      </Item>
    ))}
  </List>
)

const Autocomplete = ({ hits, handleRefine }) => (
  <List style={{ margin: 0 }}>
    {hits.map(hit => (
      <Item key={hit.objectID} onClick={() => handleRefine(hit.query)}>
        <div>
          <Highlight hit={hit} attribute="query" />
        </div>
      </Item>
    ))}
  </List>
)

const TextCards = ({ hits, last = false }) => {
  if (Array.isArray(hits) && hits.length > 0) {
    return (
      <>
        <List>
          {hits.map(hit => (
            <TextItem key={hit.objectID}>
              <Link to={hit.url}>
                <div>
                  <Highlight
                    hit={hit}
                    attribute="title"
                    style={{ fontWeight: "400" }}
                  />
                  <Highlight hit={hit} attribute="text" />
                </div>
              </Link>
            </TextItem>
          ))}
        </List>
        {!last && <Divider />}
      </>
    )
  }
  return null
}

const ProductCard = ({ hit }) => {
  const { price: cachedPrice, currency } = useCachedProductData(hit?.productId)

  return (
    <Card>
      <Link to={hit.url}>
        <Image
          src={hit.image}
          loading="lazy"
          style={{ width: "100%", margin: "0 0 10px" }}
        />
      </Link>
      <Link to={hit.url}>
        <div>
          <Highlight
            hit={hit}
            attribute="title"
            style={{
              color: "var(--black)",
              fontFamily: "vieren-type-regular, sans-serif",
              fontWeight: "normal",
              fontSize: "18px",
              lineHeight: "27px",
              textAlign: "center",
            }}
          />
          <Price>{`${cachedPrice || ``}${cachedPrice &&
            ` ${currency}`}`}</Price>
        </div>
      </Link>
    </Card>
  )
}

const ProductCards = ({ hits }) => {
  if (Array.isArray(hits) && hits.length > 0) {
    return (
      <>
        <Grid>
          {hits.map((hit, idx) => (
            <ProductCard hit={hit} key={idx} />
          ))}
        </Grid>
        <Divider />
      </>
    )
  }

  return null
}

export const Suggestions = connectHits(Autocomplete)
export const ProductSuggestions = connectHits(ProductAutocomplete)
export const TextResults = connectHits(TextCards)
export const ProductResults = connectHits(ProductCards)
