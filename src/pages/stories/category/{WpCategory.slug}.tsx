import React from "react"
import { graphql } from "gatsby"
import { PageProps } from "gatsby"
import { getLayouts } from "../../../utils/layout/layouts"
import Head from "../../../components/Layout/Head"
import Filter from "../../../components/Stories/Filter"
import List from "../../../components/Stories/List"

export default function StoriesCategoryPage(
  props: PageProps<Queries.GetStoriesCategoryQuery>
) {
  return (
    <>
      <Head
        pageTitle={props.data?.wpPage?.title}
        metaTitle={props.data?.wpPage?.template?.ACF2021?.meta?.title}
        metaDescription={
          props.data?.wpPage?.template?.ACF2021?.meta?.description
        }
        metaImage={props.data?.wpPage?.template?.ACF2021?.meta?.image}
        metaVideo={props.data?.wpPage?.template?.ACF2021?.meta?.video}
        uri={props.data?.wpPage?.uri}
      />
      {getLayouts({ layouts: props.data.wpPage?.template?.ACF2021?.layouts })}
      <Filter categories={props.data.allWpCategory?.nodes} />
      <List posts={props.data.wpCategory?.posts?.nodes} />
    </>
  )
}

export const query = graphql`
  query GetStoriesCategory($id: String!) {
    wpPage(databaseId: { eq: 42915 }) {
      id
      title
      uri
      template {
        __typename
        ...NewTemplateFields
      }
    }
    allWpCategory {
      nodes {
        id
        name
        slug
        uri
      }
    }
    wpCategory(id: { eq: $id }) {
      id
      name
      slug
      uri
      posts {
        nodes {
          ...PostSummaryFields
        }
      }
    }
  }
`
