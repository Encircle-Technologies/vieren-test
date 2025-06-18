// src/pages/preview.js

import React, { useEffect, useState } from "react"
import { useLocation, navigate } from "@reach/router"

const PreviewPage = () => {
  const [post, setPost] = useState(null)
  const location = useLocation()

  // Parse query params
  const params = new URLSearchParams(location.search)
  const slug = params.get("slug")
  const type = params.get("type")

  useEffect(() => {
    if (!slug || !type) return

    const fetchPreviewData = async () => {
      try {
        const res = await fetch(process.env.GATSBY_WPGRAPHQL_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GATSBY_JWT_PREVIEW_TOKEN}`,
          },
          body: JSON.stringify({
            query: `
              query GetPreviewContent {
                ${type}(id: "${slug}", idType: SLUG, asPreview: true) {
                  title
                  content
                }
              }
            `
          }),
        })

        const result = await res.json()
        setPost(result.data?.[type] || null)
      } catch (e) {
        console.error("Error fetching preview data:", e)
        navigate("/") // fallback if error
      }
    }

    fetchPreviewData()
  }, [slug, type])

  if (!post) return <p>Loading preview...</p>

  return (
    <main>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  )
}

export default PreviewPage
