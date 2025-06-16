import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import styled from "styled-components"
import { InlineInput } from "../Forms/Inputs"

const CustomSearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
  <form noValidate action="" role="search">
    <InlineInput
      light
      meta={{ touched: null, error: null }}
      name="search"
      type="search"
      placeholder="What are your searching for?"
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
    />
    {isSearchStalled ? "My search is stalled" : ""}
  </form>
)

const SearchBox = connectSearchBox(CustomSearchBox)

export default SearchBox
