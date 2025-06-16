import React from "react"
import { connectStateResults } from "react-instantsearch-dom"
import styled from "styled-components"

const CustomResults = ({ children, searchState }) => {
  if (searchState && searchState.query) return <>{children}</>
  return null
}

const Results = connectStateResults(CustomResults)

export default Results
