import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { trackPLPView } from "../utils/analytics/gtag"
import { getLayouts } from "../utils/layout/layouts"
import Head from "../components/Layout/Head"

export default function Page({ location, data }) {
  const isPreview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("gatsby_preview") === "true"


  useEffect(() => {
    if (location.pathname.includes("/shop")) {
      trackPLPView()
    }
  }, [location])

   if (!data?.wpPage) {
    return isPreview ? <p>Loading preview data...</p> : <p>Page not found.</p>
  }

  if (data?.wpPage?.template?.__typename === "WpTemplate_2021Default") {
    return (
      <>
        <Head
          pageTitle={data?.wpPage?.title}
          metaTitle={data?.wpPage?.template?.ACF2021?.meta?.title}
          metaDescription={data?.wpPage?.template?.ACF2021?.meta?.description}
          metaImage={data?.wpPage?.template?.ACF2021?.meta?.image}
          metaVideo={data?.wpPage?.template?.ACF2021?.meta?.video}
          uri={data?.wpPage?.uri}
        />
        {getLayouts({ layouts: data?.wpPage?.template?.ACF2021?.layouts })}
      </>
    )
  }

  return <div>Error! No template selected.</div>
}

export const pageQuery = graphql`
  query GET_PAGE($id: String!) {
    wpPage(id: { eq: $id }) {
      __typename
      id
      slug
      uri
      title
      isFrontPage
      isPostsPage
      template {
        __typename
        ...NewTemplateFields
      }
    }
  }
`
