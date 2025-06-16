import React from "react"
import ContentLoader from "react-content-loader"
import { v4 as uuidv4 } from "uuid"

export const ImgSkeleton = ({ uniqueKey = uuidv4(), ...props }) => (
  <ContentLoader
    style={{ height: "100%", width: "100%" }}
    uniqueKey={uniqueKey}
    {...props}
  >
    <rect x="0" y="0" rx="4" ry="4" height="100%" width="100%" />
  </ContentLoader>
)

export const TextSkeleton = ({ uniqueKey = uuidv4(), count = 1, ...props }) => (
  <>
    {Array.from(Array(count)).map((_, index) => (
      <span key={index} style={{ display: "flex", alignItems: "center" }}>
        <ContentLoader
          width="100%"
          style={{ height: "1em" }}
          uniqueKey={`${uniqueKey}-${index}`}
          {...props}
        >
          <rect x="0" y="0" rx="4" ry="4" width="100%" height="1em" />
        </ContentLoader>
      </span>
    ))}
  </>
)
