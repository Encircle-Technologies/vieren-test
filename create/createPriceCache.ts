import { Reporter } from "gatsby"
import { gql } from "@apollo/client"
import { initializeApollo, addApolloState } from "../src/utils/apollo/client"

const GetAllPricesQuery = gql`
  query GetAllPricesQuery {
    products(first: 100) {
      nodes {
        __typename
        id
        databaseId
        ... on SimpleProduct {
          __typename
          id
          databaseId
          price
          salePrice
          regularPrice
          stockStatus
          stockQuantity
          manageStock
        }
        ... on VariableProduct {
          __typename
          id
          databaseId
          price
          salePrice
          regularPrice
          stockStatus
          stockQuantity
          manageStock
        }
        ... on VariableProduct {
          variations {
            nodes {
              __typename
              id
              databaseId
              name
              description
              sku
              attributes {
                nodes {
                  name
                  value
                }
              }
              onSale
              price
              salePrice
              regularPrice
              stockStatus
              stockQuantity
              manageStock
            }
          }
        }
      }
    }
  }
`

type CreatePriceCacheProps = {
  reporter: Reporter
}

const createPriceCache = async ({ reporter }: CreatePriceCacheProps) => {
  const apolloClient = initializeApollo()

  const { data, error } = await apolloClient.query(GetAllPricesQuery)

  if (error) {
    reporter.info(
      `[createPriceCache] Error querying prices! ${JSON.stringify(error)}`
    )
  }

  if (data && !error) {
    addApolloState(apolloClient, {
      props: {
        data,
      },
    })

    reporter.info("[createPriceCache] Added dynamic prices to apollo state")
  }
}

export default createPriceCache
