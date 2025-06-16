import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Head from "../../components/Layout/Head"
import Grid from "../../components/Layout/Grid"
import Success from "../../components/Checkout/Success"
import { getLayouts } from "../../utils/layout/layouts"

export default function SuccessPage({ location }) {
  const {
    allWpCheckoutPage: { nodes: checkoutPages },
  } = useStaticQuery(graphql`
    query GetAllSuccessPages {
      allWpCheckoutPage {
        nodes {
          id
          title
          checkoutPageFields {
            productPages {
              __typename
              ... on WpProductPage {
                id
                ACFProduct {
                  linkedProductId
                }
              }
            }
          }
          template {
            __typename
            ...NewTemplateFields
          }
        }
      }
    }
  `)

  // console.log(checkoutPages)

  // console.log(location)

  const productsOrdered = location.state?.order?.lineItems?.nodes?.reduce(
    (acc, curr) => [
      ...acc,
      {
        id: curr.product.node.databaseId,
        subtotal: curr.subtotal,
      },
    ],
    []
  )

  // console.log(productsOrdered)

  const mostExpensiveProduct = productsOrdered?.sort(
    (a, b) => b.subtotal - a.subtotal
  )[0]

  // console.log(mostExpensiveProduct)

  const checkoutPage = checkoutPages.find(
    page =>
      page.checkoutPageFields.productPages.findIndex(
        productPage =>
          productPage.ACFProduct.linkedProductId === mostExpensiveProduct?.id
      ) > -1
  )

  // console.log(checkoutPage)

  if (location.state) {
    const [first, ...rest] = checkoutPage?.template?.ACF2021?.layouts

    if (first) {
      return (
        <>
          <Head pageTitle="Thank you for your order" />
          {first && getLayouts({ layouts: [first] })}
          <Grid>
            <Success data={location.state} />
          </Grid>
          {rest && getLayouts({ layouts: rest })}
        </>
      )
    }

    return (
      <>
        <Head pageTitle="Thank you for your order" />
        <Grid>
          <Success data={location.state} />
        </Grid>
      </>
    )
  }

  return null
}
