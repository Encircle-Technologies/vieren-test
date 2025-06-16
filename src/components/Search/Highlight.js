import React from "react"
import { connectHighlight } from "react-instantsearch-dom"
import styled from "styled-components"

const Mark = styled.mark`
  background-color: #e0e0e0;
`

function HighlightComponent({
  highlight,
  attribute,
  hit,
  // separator = ",",
  style,
  // ...props
}) {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  })

  return (
    <div
      style={{
        color: "#575757",
        fontFamily: "Lato, sans-serif",
        fontWeight: "300",
        fontSize: "14px",
        lineHeight: "24px",
        letterSpacing: "1px",
        ...style,
      }}
      // {...props}
    >
      {parsedHit.map((part, index) => {
        if (part.isHighlighted === undefined)
          return part.map((piece, idx) =>
            piece.isHighlighted ? (
              <Mark
                key={idx}
                dangerouslySetInnerHTML={{ __html: piece.value }}
              />
            ) : (
              <span
                key={idx}
                dangerouslySetInnerHTML={{ __html: piece.value }}
              />
            )
          )

        return part.isHighlighted ? (
          <Mark key={index} dangerouslySetInnerHTML={{ __html: part.value }} />
        ) : (
          <span key={index} dangerouslySetInnerHTML={{ __html: part.value }} />
        )
      })}
    </div>
  )
}

export const Highlight = connectHighlight(HighlightComponent)
