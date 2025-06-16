import React from "react"
import styled from "styled-components"
import { TextSkeleton } from "../Elements/Skeleton"

const Status = styled.span`
  color: ${({ theme }) => (theme === "dark" ? "#dddddd" : "#767676")};
  font-size: 11px;
  line-height: 30px;
  letter-spacing: 0.67px;
  margin: 0 0 0 20px;
  text-transform: uppercase;

  @media (min-width: 800px) {
    font-size: 12px;
    line-height: 30px;
  }
`

export default function Stock({ theme, stockStatus, stockQuantity, special }) {
  switch (true) {
    case !stockStatus && !stockQuantity:
      return (
        <Status theme={theme}>
          <TextSkeleton style={{ height: "1em", width: "100px" }} />
        </Status>
      )
    case special && stockQuantity > 1:
      return <Status theme={theme}>{Stock.messages.SPECIAL}</Status>
    case stockStatus === "OUT_OF_STOCK":
      return <Status theme={theme}>{Stock.messages.OUT}</Status>
    case stockStatus === "IN_STOCK" && stockQuantity > 25:
      return <Status theme={theme}>{Stock.messages.IN}</Status>
    case stockStatus === "IN_STOCK" && stockQuantity <= 25 && stockQuantity > 1:
      return <Status theme={theme}>{Stock.messages.LOW(stockQuantity)}</Status>
    case stockStatus === "IN_STOCK" && stockQuantity === 1:
      return <Status theme={theme}>{Stock.messages.LAST}</Status>
    default:
      return null
    // throw new Error(`[Error] unhandled stock quantity type`)
  }
}

Stock.messages = {
  SPECIAL: "5 Special Edition",
  IN: "100 Limited Edition",
  LOW: qty => `Only ${qty} Left`,
  LAST: "Only One Remaining",
  OUT: "Sold Out",
}
