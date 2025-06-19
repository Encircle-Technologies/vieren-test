import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"

const PreviewPage = () => {
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const uri = params.get("uri")
    const token = params.get("gatsby_preview_token")

    if (uri) {
      const path = uri.startsWith("/") ? uri : `/${uri}`
      const previewUrl = `${path}${token ? `?gatsby_preview_token=${token}` : ""}`
      navigate(previewUrl, { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }, [location])

  return <main style={{ padding: "2rem" }}><p>Loading preview...</p></main>
}

export default PreviewPage
