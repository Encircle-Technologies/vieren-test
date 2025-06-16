import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const PageNumber = styled(Link)`
  color: #4d4d4d;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;

  &.active {
    border-bottom: 2px solid var(--black);
  }
`

const Button = styled(PageNumber)`
  &.disabled {
    color: #e0e0e0;
    pointer-events: none;
  }
`

const PageList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 50px 0 100px;
  padding: 0;
`

const PageListItem = styled.li`
  margin: 0 7px;
`

export default function Pagination({ basePath, pages, currentPage }) {
  const singlePage = pages.length === 1
  const lastPage = pages[pages.length - 1]

  const prevPagePath =
    currentPage > 2 ? `${basePath}/${currentPage - 1}` : basePath
  const nextPagePath =
    currentPage <= lastPage - 1
      ? `${basePath}/${currentPage + 1}`
      : `${basePath}/${lastPage}`

  if (singlePage) return null

  return (
    <PageList>
      <PageListItem>
        <Button to={prevPagePath} activeClassName="disabled">
          Prev
        </Button>
      </PageListItem>
      {pages.map(page => {
        const buttonPath = page === 1 ? basePath : `${basePath}/${page}`

        return (
          <PageListItem key={page}>
            <PageNumber to={buttonPath} activeClassName="active">
              {page}
            </PageNumber>
          </PageListItem>
        )
      })}
      <PageListItem>
        <Button to={nextPagePath} activeClassName="disabled">
          Next
        </Button>
      </PageListItem>
    </PageList>
  )
}
