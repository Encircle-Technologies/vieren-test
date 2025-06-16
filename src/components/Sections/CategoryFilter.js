import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import Grid from "../Layout/Grid"

const FilterList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  list-style: none;
  margin: 0;
  padding: 20px 0;

  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    justify-content: center;
    overflow-x: unset;
  }
`

const FilterListItem = styled.li`
  flex-shrink: 0;
  margin: 0 40px 0 0;
`

const FilterLink = styled(Link)`
  position: relative;

  & span {
    color: #767676;
    font-family: "Lato", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: normal;
    letter-spacing: 0.75px;
    text-transform: uppercase;
  }

  &.active span {
    color: var(--black);
  }

  &::after {
    border-bottom: 1px solid #767676;
    content: "";
    display: block;

    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0;
    transition: width 0.5s ease-in;
  }

  &:hover::after,
  &:focus::after,
  &.active::after {
    width: 100%;
  }

  &.active::after {
    border-bottom: 1px solid var(--black);
  }
`

export default function CategoryFilter({ data }) {
  const { kind } = data
  const {
    allWpCategory: { nodes: categories },
    allWpGiftStoriesCategory: { nodes: giftStoriesCategories },
  } = useStaticQuery(graphql`
    query GetGiftStoriesCategories {
      allWpCategory(sort: { description: ASC }) {
        nodes {
          id
          name
          slug
          uri
          description
        }
      }
      allWpGiftStoriesCategory(sort: { description: ASC }) {
        nodes {
          id
          name
          slug
          uri
          description
        }
      }
    }
  `)

  return (
    <Grid>
      <FilterList>
        <FilterListItem>
          <FilterLink
            to="/stories/category/all/"
            activeClassName="active"
            partiallyActive={false}
          >
            <span>View All</span>
          </FilterLink>
        </FilterListItem>
        {kind === "giftStories"
          ? giftStoriesCategories.map(item => (
              <FilterListItem key={item.name}>
                <FilterLink
                  to={item.uri}
                  activeClassName="active"
                  partiallyActive={item.uri !== "/gifts"}
                >
                  <span>{item.name}</span>
                </FilterLink>
              </FilterListItem>
            ))
          : categories.map(item => (
              <FilterListItem key={item.name}>
                <FilterLink
                  to={item.uri}
                  activeClassName="active"
                  partiallyActive={item.uri !== "/stories"}
                >
                  <span>{item.name}</span>
                </FilterLink>
              </FilterListItem>
            ))}
      </FilterList>
    </Grid>
  )
}

export const fragment = graphql`
  fragment NewStoriesCategoryFilterFields on WpTemplate_2021Default_Acf2021_Layouts_StoriesCategoryFilter {
    acfeFlexibleLayoutTitle
    kind
  }
`
