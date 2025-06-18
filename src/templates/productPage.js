import React from "react"
import { graphql } from "gatsby"
import { Router } from "@reach/router"
import { ContentProvider } from "../hooks/useProductContent"
import ProtectedRoute from "../components/Auth/ProtectedRoute"
import { getLayouts } from "../utils/layout/layouts"
import Head from "../components/Layout/Head"
import ProductDetail from "../components/Product/ProductDetail"
import Overlay from "../components/Product/Overlay"
import { useCurrency } from "../hooks/useCurrency"

const Content = ({ productFields, layouts }) => {
  return (
    <>
      <ProductDetail productFields={productFields} />
      <div id="pdp-container">{getLayouts({ layouts })}</div>
    </>
  )
}

export default function ProductPage({ data }) {

  const isPreview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("gatsby_preview") === "true"
    
  const preOrderProducts = data?.wp?.preorder?.content?.productPages

  const isPreOrder =
    preOrderProducts?.findIndex(
      product => product.id === data?.wpProductPage?.id
    ) > -1


  const { selected: selectedCurrency } = useCurrency()
  const product = selectedCurrency === 'CAD' ? data?.cad?.product : data?.usd?.product

  process.env.NODE_ENV === "development" &&
    console.log("[rerender] Product Page Template")

  if (data?.wpProductPage?.template?.__typename === "WpTemplate_2021Default") {
    return (
      <ContentProvider products={{ usd: data?.usd, cad: data?.cad }}>
        <Head
          pageTitle={data?.wpProductPage?.title}
          metaTitle={data?.wpProductPage?.template?.ACF2021?.meta?.title}
          metaDescription={
            data?.wpProductPage?.template?.ACF2021?.meta?.description
          }
          metaImage={data?.wpProductPage?.template?.ACF2021?.meta?.image}
          metaVideo={data?.wpProductPage?.template?.ACF2021?.meta?.video}
          uri={data?.wpProductPage?.uri}
          product={product}
        />
        {isPreOrder ? (
          <Router basepath={data?.wpProductPage?.uri}>
            {/* <NotFound /> */}
            <Overlay
              path="/login"
              content={data?.wp?.preorder?.content}
              default
            />
            <ProtectedRoute
              path="/"
              component={Content}
              product={data?.usd?.product}
              productFields={data?.wpProductPage?.ACFProduct}
              layouts={data?.wpProductPage?.template?.ACF2021?.layouts}
            />
          </Router>
        ) : (
          <Content
            productFields={data?.wpProductPage?.ACFProduct}
            layouts={data?.wpProductPage?.template?.ACF2021?.layouts}
          />
        )}
      </ContentProvider>
    )
  }

  return <div>Error! No template Selected</div>
}

export const productPageQuery = graphql`
  query GetProductPage($id: String!, $productId: ID!) {
    wp {
      preorder {
        content {
          productPages {
            ... on WpProductPage {
              id
            }
          }
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
          elements {
            __typename
            ...PreOrderCardFields
            ...PreOrderButtonFields
            ...PreOrderDividerFields
            ...PreOrderGalleryFields
            ...PreOrderImageFields
            ...PreOrderPreformattedTextFields
            ...PreOrderQuotesFields
            ...PreOrderSpecFields
            ...PreOrderTextFields
            ...PreOrderVideoFields
            ...PreOrderFormFields
            ...PreOrderCountdownFields
          }
        }
      }
    }

    wpProductPage(id: { eq: $id }) {
      __typename
      id
      databaseId
      uri
      slug
      title
      ACFProduct {
        theme
        mGallery {
          kind
          image {
            desktop {
              ...ImageFields
            }
            mobile {
              ...MobileImageFields
            }
          }
          video {
            poster {
              desktop {
                ...DesktopPosterFields
              }
              mobile {
                ...MobilePosterFields
              }
            }
            media {
              desktop {
                ...VideoFields
              }
              mobile {
                ...VideoFields
              }
            }
            options
          }
        }
      }
      template {
        __typename
        ...NewTemplateFields
      }
    }
    usd {
      product(id: $productId, idType: DATABASE_ID) {
        __typename
        id
        databaseId
        name
        sku
        slug
        date
        modified
        featured
        onSale
        image {
          mediaItemUrl
        }
        productCategories {
          nodes {
            databaseId
            name
            slug
            parent {
              node {
                databaseId
                name
                slug
              }
            }
          }
        }
        collections {
          nodes {
            databaseId
            name
          }
        }
        productStatuses {
          nodes {
            databaseId
            name
          }
        }
        productFeatures {
          nodes {
            databaseId
            name
            description
          }
        }
        productTags {
          nodes {
            databaseId
            name
            slug
          }
        }
        averageRating
        reviewCount
        description
        ... on USD_SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
          manageStock
        }
        ... on USD_VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
          manageStock
          variations {
            nodes {
              id
              databaseId
              name
              description
              sku
              onSale
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
              attributes {
                nodes {
                  name
                  value
                }
              }
              image {
                altText
                mediaItemUrl
              }
            }
          }
        }
      }
    }
    cad {
      product(id: $productId, idType: DATABASE_ID) {
        __typename
        id
        name
        sku
        databaseId
        image {
          mediaItemUrl
        }
        productStatuses {
          nodes {
            databaseId
            name
          }
        }
        ... on CAD_SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
          manageStock
        }
        ... on CAD_VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
          stockQuantity
          manageStock
          variations {
            nodes {
              id
              databaseId
              name
              description
              sku
              onSale
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
              image {
                altText
                mediaItemUrl
              }
            }
          }
        }
      }
    }
  }
`
