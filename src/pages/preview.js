import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { usePreviewNode } from "../hooks/usePreviewNode"
import DOMPurify from "dompurify"

const PreviewPage = () => {

  const { node, loading, error } = usePreviewNode()

  useEffect(() => {
    if (node?.uri) {
      navigate(`${node.uri}?preview=true`)
    }
  }, [node])

  if (loading) return <p>Loading preview...</p>

  if (error) {
    return (
      <p style={{ color: "red" }}>
        Preview Error:{" "}
        {typeof error === "string"
          ? DOMPurify.sanitize(error)
          : "An unknown error occurred."}
      </p>
    )
  }

  return <p>Redirecting...</p>
}

export default PreviewPage