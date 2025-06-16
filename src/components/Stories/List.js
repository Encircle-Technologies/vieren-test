import React from "react"
import styled from "styled-components"
import Grid from "../Layout/Grid"
import { FeaturedCard, Card } from "./Card"

const PostList = styled.ul`
  display: grid;
  gap: 80px;
  grid-template-columns: 1fr;

  list-style: none;
  margin: 25px 0;
  padding: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    grid-template-rows: max-content;
    margin: 32px 0;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    margin: 50px 0;
  }
`

export default function List({
  showFeatured = true,
  currentPage = 1,
  external = false,
  posts,
  ...rest
}) {
  const featuredPosts = posts.filter(post => post.ACFPost.featured)
  const featuredPost = featuredPosts.length > 0 ? featuredPosts[0] : posts[0]
  const regularPosts = showFeatured
    ? posts.filter(post => post.id !== featuredPost?.id)
    : posts

  return (
    <Grid>
      <PostList {...rest}>
        <>
          {showFeatured && (
            <FeaturedCard post={featuredPost} external={external} />
          )}
          {regularPosts.map(post => (
            <Card
              key={post.id}
              post={post}
              external={external}
              currentPage={currentPage}
            />
          ))}
        </>
      </PostList>
      {/* <Pagination basePath={basePath} pages={pages} currentPage={currentPage} /> */}
    </Grid>
  )
}
