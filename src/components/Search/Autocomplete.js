import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  connectAutoComplete,
  connectStateResults,
  Index,
} from "react-instantsearch-dom"
import styled from "styled-components"
import { InlineInput } from "../Forms/Inputs"
import { Suggestions } from "./Hits"

const Container = styled.div`
  margin: 0 0 50px;
`

const List = styled.div`
  background-color: #fafafa;
  border-top: none;
  border-left: 1px solid #bbbbbb;
  border-right: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
  border-radius: 0;
  list-style: none;
  margin: -1px 0 50px;
  padding: 0;
  width: 100%;
`

const Results = connectStateResults(({ children, searchState }) =>
  searchState && searchState.query ? <List>{children}</List> : null
)

const CustomAutocomplete = ({ hits, currentRefinement, refine }) => {
  const inputRef = useRef(null)
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(false)

  const handleRefine = useCallback(
    value => {
      refine(value)
      setOpen(false)
    },
    [refine, setOpen]
  )

  useEffect(() => {
    inputRef.current.addEventListener("focus", () => setFocused(true))
    inputRef.current.addEventListener("blur", () => setFocused(false))

    // return () => {
    //   inputRef.current.removeEventListener("focus", () => setFocused(true))
    //   inputRef.current.removeEventListener("blur", () => setFocused(false))
    // }
  }, [inputRef])

  useEffect(() => {
    if (focused && !!hits.length) {
      setOpen(true)
    }
  }, [focused, hits, setOpen])

  return (
    <Container>
      <InlineInput
        light
        meta={{ touched: null, error: null }}
        ref={inputRef}
        name="search"
        type="search"
        autoComplete="off"
        value={currentRefinement}
        placeholder="What are you searching for?"
        onChange={event => refine(event.currentTarget.value)}
        style={{
          "-webkit-appearance": "none",
        }}
      />
      {open && (
        <Results>
          <Index indexName={process.env.GATSBY_ALGOLIA_SUGGESTIONS_INDEX}>
            <Suggestions handleRefine={handleRefine} />
          </Index>
        </Results>
      )}
    </Container>
  )
}

const Autocomplete = connectAutoComplete(CustomAutocomplete)

export default Autocomplete
