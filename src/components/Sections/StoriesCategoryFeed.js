import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import { useQuery } from "@apollo/client"
import GetStoriesByCategory from "./StoriesCategoryFeed.query.graphql"
import CardCarousel from "./CardCarousel"
import List from "../Stories/List"
import Section from "../Layout/Section"
import { ButtonAsButton } from "../Elements/Button"

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0 20px;

  @media (min-width: 800px) {
    padding: 50px 0;
  }
`

export default function StoriesCategoryFeed({ skipPost, data, aboveFold }) {
  const {
    kind,
    category,
    __typename,
    numberOfPosts,
    sortBy,
    sortOrder,
    ...sectionData
  } = data
  const [postCount, setPostCount] = useState(numberOfPosts)
  const [posts, setPosts] = useState([])
  const { data: feed, loading, refetch } = useQuery(GetStoriesByCategory, {
    context: { uri: process.env.GATSBY_GRAPHQL_URL },
    variables: {
      id: category?.databaseId || null,
      sortBy,
      sortOrder,
      count: postCount || 10,
      cursor: null,
    },
    skip: !data,
  })

  useEffect(() => {
    if (feed) {
      if (skipPost) {
        console.log(feed.posts.nodes.filter(post => post.id !== skipPost))
        setPosts(feed.posts.nodes.filter(post => post.id !== skipPost))
      } else {
        setPosts(feed.posts.nodes)
      }
    }
  }, [feed, skipPost, setPosts])

  if (loading || posts.length === 0) {
    return null
  }

  if (posts && kind === "carousel")
    return (
      <CardCarousel
        data={{
          ...sectionData,
          layout: "stories",
          slides: posts,
        }}
      />
    )

  if (posts && kind === "grid")
    return (
      <Section
        anchor={sectionData.anchor}
        background={sectionData.background}
        margin={sectionData.margin}
        $margin={sectionData.marginRepeater}
        padding={sectionData.padding}
        $padding={sectionData.paddingRepeater}
      >
        <List posts={posts} showFeatured />
        <ButtonContainer>
          <ButtonAsButton
            background={{ colour: "#4d4d4d", hover: "var(--black)" }}
            onClick={() =>
              refetch({
                variables: {
                  id: category?.databaseId || null,
                  sortBy,
                  sortOrder,
                  count: postCount + 10,
                  cursor: feed.posts.pageInfo.endCursor || null,
                },
              }).then(() => setPostCount(prevState => prevState + 10))
            }
          >
            {loading ? "Loading..." : "View More"}
          </ButtonAsButton>
        </ButtonContainer>
      </Section>
    )
}

export const fragment = graphql`
  fragment NewStoriesCategoryFeedFields on WpTemplate_2021Default_Acf2021_Layouts_StoriesCategoryFeed {
    acfeFlexibleLayoutTitle
    anchor
    background {
      kind
      colour {
        desktop
        mobile
      }
      image {
        desktop {
          ...ImageFields
        }
        mobile {
          ...MobileImageFields
        }
      }
      video {
        media {
          desktop {
            ...VideoFields
          }
          mobile {
            ...VideoFields
          }
        }
        poster {
          desktop {
            ...DesktopPosterFields
          }
          mobile {
            ...MobilePosterFields
          }
        }
        options
      }
    }
    marginRepeater {
      desktop {
        direction
        unit
        value
      }
      mobile {
        direction
        unit
        value
      }
    }
    paddingRepeater {
      desktop {
        direction
        unit
        value
      }
      mobile {
        direction
        unit
        value
      }
    }
    category {
      databaseId
    }
    kind
    numberOfPosts
    sortBy
    sortOrder
  }
`
