import React from "react"
import { useLayout, LAYOUT_STATE } from "../../hooks/useLayout"
import styled from "styled-components"
import SearchIcon from "../../images/icons/search.svg"

const Search = styled(({ light, ...rest }) => <SearchIcon {...rest} />)`
  color: ${({ light }) => (light ? "black" : "white")};
  cursor: pointer;
`

export default function Icon({ light }) {
  const { dispatchLayout } = useLayout()

  return (
    <Search
      light={light}
      onClick={() => {
        dispatchLayout({ type: LAYOUT_STATE.search, payload: true })
        typeof window !== "undefined" && window.scrollTo(0, 0)
      }}
    />
  )
}
