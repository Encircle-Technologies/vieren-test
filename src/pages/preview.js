import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"

const PreviewPage = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const slug = params.get("slug")
    const type = params.get("type") // 'page' or 'post' or custom
    const previewToken = params.get("gatsby_preview")

    if (slug && previewToken) {
      // Assuming your site uses pretty URLs
      navigate(`/${slug}/?gatsby_preview=true`, { replace: true })
    } else {
      // fallback
      navigate("/", { replace: true })
    }

    setLoading(false)
  }, [location])

  return (
    <main style={{ padding: "2rem" }}>
      {loading ? <p>Loading preview...</p> : <p>Redirecting...</p>}
    </main>
  )
}

export default PreviewPage
