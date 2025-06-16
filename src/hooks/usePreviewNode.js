import { useEffect, useState } from "react"


const VALID_TYPES = [
  "POST",
  "PAGE",
]

const getPreviewQuery = (type) => `
  query GetPreviewNode($id: ID!) {
    ${type}(id: $id, idType: DATABASE_ID, asPreview: true) {
      id
      uri
    }
  }
`

export const usePreviewNode = () => {
  const [node, setNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const previewId = urlParams.get("p")
    const rawType = urlParams.get("post_type") || "post"

    // Capitalize post_type safely
    const capitalizedType = rawType.charAt(0).toUpperCase() + rawType.slice(1)

    // Validate post_type
    if (!VALID_TYPES.includes(capitalizedType)) {
      setError(`Invalid post type: ${capitalizedType}`)
      setLoading(false)
      return
    }

    if (!previewId) {
      setError("Missing post ID in preview URL.")
      setLoading(false)
      return
    }

    const fetchPreviewNode = async () => {
      try {
        const response = await fetch("/___graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: getPreviewQuery(capitalizedType),
            variables: { id: previewId },
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.errors?.length > 0) {
          console.error("GraphQL errors:", result.errors)
          throw new Error(result.errors[0].message || "Unknown GraphQL error")
        }

        const data = result.data?.[capitalizedType]
        if (data?.uri) {
          setNode(data)
        } else {
          throw new Error("No preview node found.")
        }
      } catch (err) {
        console.error("Preview fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPreviewNode()
  }, [])

  return { node, loading, error }
}
