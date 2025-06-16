import React from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"
import { BackgroundImage } from "../Elements/Image"
import { H3 } from "../Elements/H3"
import { H5 } from "../Elements/H5"
import { P } from "../Elements/P"
import StaticImage from "../Elements/StaticImage"

const FeaturedItem = styled.div`
  position: relative;

  ${({ external }) =>
    !external &&
    `&:nth-of-type(1) {
    grid-row: 1;
  }

  @media (min-width: 768px) {
    grid-column: 1 / 3;
  }

  @media (min-width: 1280px) {
    &::after {
      border-left: 1px solid #f2f2f2;
      content: "";
      display: block;

      position: absolute;
      top: 0;
      right: -40px;
      bottom: 0;
    }
  }`}
`

const PostItem = styled.li`
  position: relative;

  ${({ external, currentPage }) =>
    !external &&
    `@media (min-width: 1280px) {
    // 5th, 15th, 25th, 35th, etc...
    &:nth-of-type(10n - 5) {
      grid-column: 3 / 5;
    }
    // 10th, 20th, 30th, etc...
    &:nth-of-type(10n - 10) {
      grid-column: 1 / 3;
    }

    &::after {
      border-left: 1px solid #f2f2f2;
      content: "";
      display: block;

      position: absolute;
      top: 0;
      right: -40px;
      bottom: 0;
    }

    &:nth-of-type(2)::after,
    &:nth-of-type(5)::after,
    &:nth-of-type(9)::after,
    &:nth-of-type(12)::after,
    &:nth-of-type(15)::after,
    &:nth-of-type(19)::after {
      display: ${currentPage === 1 && "none"};
    }
  }`}
`

const FeaturedCardBody = styled.article`
  display: flex;
  flex-direction: column-reverse;
  ${({ direction }) => direction === "row" && `align-items: center;`}

  @media (min-width: 800px) {
    display: ${({ direction }) => (direction === "row" ? "grid" : "flex")};
    grid-template-columns: ${({ direction }) =>
      direction === "row" ? "1fr 1fr" : null};
    flex-direction: ${({ direction }) =>
      direction ? `${direction}` : `column`};
  }
`

const CardBody = styled.article``

const ImageWrapper = styled.div`
  margin: ${({ direction }) => (direction === "row" ? "0" : "0 0 10px")};
  overflow: hidden;
`

const CardImgZoom = styled(BackgroundImage)`
  transition: transform 1s;

  &:hover {
    transform: scale3d(1.2, 1.2, 1.2);
  }
`

const Caption = styled.div`
  margin: ${({ direction }) =>
    direction === "row" ? `60px 0 80px` : `0 0 20px`};

  @media (min-width: 800px) {
    margin: ${({ direction }) => (direction === "row" ? `0 6%` : `0 0 20px`)};
    padding: 0;
  }
`

const Featured = styled(H5)`
  text-transform: uppercase;
`

const Categories = styled.span`
  display: block;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.61px;
  line-height: 30px;
  min-height: 10px;
  text-transform: uppercase;

  a {
    color: #767676;
  }

  @media (min-width: 800px) {
    font-size: 12px;
    letter-spacing: 0.67px;
  }
`

const Title = styled.h3`
  color: var(--black);
  font-family: "vieren-type-regular", "Lato", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 1px;
  margin: 0 0 5px;

  @media (min-width: 800px) {
    font-size: 22px;
    line-height: 27px;
  }
`
const Excerpt = styled(P)`
  margin: 0;
`

export const FeaturedCard = ({
  post,
  direction = "column",
  external = false,
}) => {
  const isGift = post?.__typename === "WpGift"
  const templateName = post?.template?.__typename
  const isDynamic = templateName === "DefaultTemplate" || "Template_2021Default"

  const imageSources =
    post?.template?.__typename === "WpDefaultTemplate"
      ? {
          mobile: post?.template?.ACF?.related.image.mobile,
          desktop: post?.template?.ACF?.related.image.desktop,
        }
      : {
          mobile: post?.template?.ACF2021?.related.image.mobile,
          desktop: post?.template?.ACF2021?.related.image.desktop,
        }

  return (
    <FeaturedItem external={external}>
      <FeaturedCardBody direction={direction}>
        <Caption direction={direction}>
          <Featured
            colour={{ mobile: "#767676", desktop: "#767676" }}
            align={{
              mobile: direction === "row" ? "center" : "left",
              desktop: direction === "row" ? "center" : "left",
            }}
          >
            {post?.ACFPost?.featured
              ? `Feature`
              : isGift
              ? post?.giftStoriesCategories?.nodes?.map((category, index) => (
                  <Link key={index} to={`/gifts/${category.slug}`}>{`${
                    category.name
                  }${
                    index < post?.giftStoriesCategories?.nodes?.length - 1
                      ? ", "
                      : ""
                  }`}</Link>
                ))
              : post?.categories?.nodes?.map((category, index) => (
                  <Link key={index} to={`/stories/${category.slug}`}>{`${
                    category.name
                  }${
                    index < post.categories.nodes.length - 1 ? ", " : ""
                  }`}</Link>
                ))}
          </Featured>
          <Link to={post?.uri}>
            <H3
              align={{
                mobile: direction === "row" ? "center" : "left",
                desktop: direction === "row" ? "center" : "left",
              }}
            >
              {post?.template?.__typename === "WpDefaultTemplate"
                ? post?.template?.ACF?.related.headline
                : post?.template?.ACF2021?.related.headline}
            </H3>
          </Link>
          <Excerpt
            as="p"
            align={{
              mobile: direction === "row" ? "center" : "left",
              desktop: direction === "row" ? "center" : "left",
            }}
            dangerouslySetInnerHTML={{
              __html:
                post?.template?.__typename === "WpDefaultTemplate"
                  ? post?.template?.ACF?.related.description
                  : post?.template?.ACF2021?.related.description,
            }}
          />
        </Caption>
        <Link to={post?.uri} style={{ width: "100%" }}>
          <ImageWrapper direction={direction}>
            {isDynamic && templateName === "DefaultTemplate" ? (
              <StaticImage
                image={post.template.ACF.related.image}
                hoverImage={post.template.ACF.related.hoverImage}
              />
            ) : isDynamic && templateName === "Template_2021Default" ? (
              <StaticImage
                image={post.template.ACF2021.related.image}
                hoverImage={post.template.ACF2021.related.hoverImage}
              />
            ) : (
              <CardImgZoom source={imageSources} />
            )}
          </ImageWrapper>
        </Link>
      </FeaturedCardBody>
    </FeaturedItem>
  )
}

export const Card = ({ post, external = false, currentPage }) => {
  const isGift = post?.__typename === "WpGift"
  const templateName = post?.template?.__typename
  const isDynamic = templateName === "DefaultTemplate" || "Template_2021Default"

  const imageSources =
    templateName === "WpDefaultTemplate"
      ? {
          mobile: post?.template?.ACF?.related.image.mobile,
          desktop: post?.template?.ACF?.related.image.desktop,
        }
      : {
          mobile: post?.template?.ACF2021?.related.image.mobile,
          desktop: post?.template?.ACF2021?.related.image.desktop,
        }

  return (
    <PostItem
      as={external ? "article" : "li"}
      external={external}
      currentPage={currentPage}
    >
      <CardBody>
        <Link to={post?.uri}>
          <ImageWrapper>
            {isDynamic && templateName === "DefaultTemplate" ? (
              <StaticImage
                image={post.template.ACF.related.image}
                hoverImage={post.template.ACF.related.hoverImage}
              />
            ) : isDynamic && templateName === "Template_2021Default" ? (
              <StaticImage
                image={post.template.ACF2021.related.image}
                hoverImage={post.template.ACF2021.related.hoverImage}
              />
            ) : (
              <CardImgZoom source={imageSources} />
            )}
          </ImageWrapper>
        </Link>
        <Categories>
          {isGift
            ? post?.giftStoriesCategories?.nodes?.map((category, index) => (
                <Link key={index} to={`/gifts/${category.slug}`}>{`${
                  category.name
                }${
                  index < post?.giftStoriesCategories?.nodes?.length - 1
                    ? ", "
                    : ""
                }`}</Link>
              ))
            : post?.categories?.nodes?.map((category, index) => (
                <Link key={index} to={`/stories/${category.slug}`}>{`${
                  category.name
                }${
                  index < post?.categories?.nodes?.length - 1 ? ", " : ""
                }`}</Link>
              ))}
        </Categories>
        <Link to={post?.uri}>
          <Title>
            {templateName === "WpDefaultTemplate" ||
            templateName === "DefaultTemplate"
              ? post?.template?.ACF?.related.headline
              : post?.template?.ACF2021?.related.headline}
          </Title>
        </Link>
        <Excerpt
          as="p"
          dangerouslySetInnerHTML={{
            __html:
              templateName === "WpDefaultTemplate" ||
              templateName === "DefaultTemplate"
                ? post?.template?.ACF?.related.description
                : post?.template?.ACF2021?.related.description,
          }}
        />
      </CardBody>
    </PostItem>
  )
}

export const postSummaryFragment = graphql`
  fragment CategoryFields on WpCategory {
    id
    databaseId
    uri
    slug
    name
    count
    wpParent {
      node {
        id
        databaseId
        name
        uri
        slug
      }
    }
  }

  fragment PostSummaryFields on WpPost {
    id
    # databaseId
    uri
    title
    date
    modified
    categories {
      nodes {
        ...CategoryFields
      }
    }
    ACFPost {
      featured
    }
    template {
      __typename
      ... on WpTemplate_2021Default {
        ACF2021 {
          ...NewRelatedFields
        }
      }
    }
  }

  fragment GiftSummaryFields on WpGift {
    id
    # databaseId
    uri
    title
    date
    modified
    giftStoriesCategories {
      nodes {
        id
        databaseId
        uri
        slug
        name
        count
      }
    }
    ACFPost {
      featured
    }
    template {
      __typename
      ... on WpTemplate_2021Default {
        ACF2021 {
          ...NewRelatedFields
        }
      }
    }
  }
`
