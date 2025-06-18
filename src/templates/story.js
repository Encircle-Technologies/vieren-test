import React from "react"
import { graphql } from "gatsby"
import { getLayouts } from "../utils/layout/layouts"
import Head from "../components/Layout/Head"

export default function Post({ data }) {

  const isPreview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("gatsby_preview") === "true"
    
  if (data?.wpPost?.template?.__typename === "WpTemplate_2021Default") {
    return (
      <>
        <Head
          pageTitle={data?.wpPost?.title}
          metaTitle={data?.wpPost?.template?.ACF2021?.meta?.title}
          metaDescription={data?.wpPost?.template?.ACF2021?.meta?.description}
          metaImage={data?.wpPost?.template?.ACF2021?.meta?.image}
          metaVideo={data?.wpPost?.template?.ACF2021?.meta?.video}
          uri={data?.wpPost?.uri}
        />
        {getLayouts({
          pageId: data?.wpPost?.id,
          layouts: data?.wpPost?.template?.ACF2021?.layouts,
        })}
      </>
    )
  }

  if (data?.wpGift?.template?.__typename === "WpTemplate_2021Default") {
    return (
      <>
        <Head
          pageTitle={data?.wpGift?.title}
          metaTitle={data?.wpGift?.template?.ACF2021?.meta?.title}
          metaDescription={data?.wpGift?.template?.ACF2021?.meta?.description}
          metaImage={data?.wpGift?.template?.ACF2021?.meta?.image}
          metaVideo={data?.wpGift?.template?.ACF2021?.meta?.video}
          uri={data?.wpGift?.uri}
        />
        {getLayouts({
          pageId: data?.wpGift?.id,
          layouts: data?.wpGift?.template?.ACF2021?.layouts,
        })}
      </>
    )
  }

  return <div>Error! No template Selected</div>
}

export const postQuery = graphql`
  query GET_POST($id: String!) {
    wpPost(id: { eq: $id }) {
      __typename
      id
      slug
      uri
      title
      ACFPost {
        featured
      }
      template {
        __typename
        ...NewTemplateFields
      }
    }
    wpGift(id: { eq: $id }) {
      __typename
      id
      slug
      uri
      title
      template {
        __typename
        ...NewTemplateFields
      }
    }
  }
`
