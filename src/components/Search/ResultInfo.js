import React from "react"
import { connectHits } from "react-instantsearch-dom"
import styled from "styled-components"

const Eyebrow = styled.h5`
  color: #818181;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: 0.67px;
  margin: 0;
  text-transform: uppercase;
`

const Title = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 27px;
  letter-spacing: 1px;
  margin: 0 0 40px;
`

const HitInfo = ({ hits, title }) => {
  if (!!hits.length)
    return (
      <div>
        <Eyebrow>{`${hits.length} results`}</Eyebrow>
        <Title>{title}</Title>
      </div>
    )
  return null
}

const ResultInfo = connectHits(HitInfo)

export default ResultInfo
