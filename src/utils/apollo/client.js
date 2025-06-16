import { useMemo } from "react"
import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
} from "@apollo/client"
// import { TokenRefreshLink } from "apollo-link-token-refresh"
import { onError } from "@apollo/client/link/error"
import fetch from "isomorphic-fetch"

import possibleTypes from "./possibleTypes.json"
import {
  // deleteRefreshToken,
  // getInMemoryAuthToken,
  // getRefreshToken,
  // isTokenExpired,
  logout,
  // setAuthToken,
} from "./auth"
import { navigate } from "gatsby"
import merge from "deepmerge"
import isEqual from "lodash/isEqual"

let activeCurrency = "USD"

const customFetch = (uri, options) => {
  if (activeCurrency) return fetch(`${uri}?currency=${activeCurrency}`, options)

  return fetch(uri, options)
}

// const httpLink = new HttpLink({
//   uri: process.env.GATSBY_STORE_GRAPHQL_URL,
//   fetch: customFetch,
//   credentials: "include", // Use this with the wp-graphql-cors method of authentication
// })

/**
 * This middleware splits the traffic to the CMS and Store
 */
const cmsMiddleware = new ApolloLink.split(
  operation => operation.getContext().uri === process.env.GATSBY_GRAPHQL_URL,
  new HttpLink({
    uri: process.env.GATSBY_GRAPHQL_URL,
    fetch,
  }),
  new HttpLink({
    uri: process.env.GATSBY_STORE_GRAPHQL_URL,
    fetch: customFetch,
    credentials: "include",
  })
)

const currencyMiddleware = new ApolloLink((operation, forward) => {
  const { currency } = operation.getContext()

  if (currency) {
    activeCurrency = currency
  }

  return forward(operation)
})

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // get the authentication token from in memory storage if it exists
//   const token = getInMemoryAuthToken()

//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers, // Spread existing headers, e.g. woocommerce session
//       Authorization: token ? `Bearer ${token}` : "", // Adds the authentication header if an in memory token exists
//     },
//   }))

//   return forward(operation)
// })

// const refreshTokenLink = new TokenRefreshLink({
//   accessTokenField: `refreshJwtAuthToken`,
//   isTokenValidOrUndefined: () => {
//     const token = getInMemoryAuthToken()

//     return !token || (token && !isTokenExpired(token))
//   },
//   fetchAccessToken: () => {
//     console.log("refreshTokenLink")
//     // TODO: Check if refreshJwtAuthToken can return authExpiration
//     const query = `
//       mutation RefreshJwtAuthToken($input: RefreshJwtAuthTokenInput!) {
//         refreshJwtAuthToken(input: $input) {
//           authToken
//         }
//       }
//     `

//     return fetch(process.env.GATSBY_GRAPHQL_URL, {
//       method: "POST",
//       mode: "cors",
//       // credentials: "include",
//       headers: {
//         // Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query,
//         variables: {
//           input: {
//             jwtRefreshToken: getRefreshToken(),
//           },
//         },
//       }),
//     })
//   },
//   handleFetch: response => {
//     if (response.errors && response.errors.length) return
//     console.log("HandleFetch", response)
//     setAuthToken(response.authToken)
//   },
//   handleError: err => {
//     console.error(err)
//     deleteRefreshToken()
//   },
// })

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions && extensions.code === "invalid-jwt") {
        logout(() => navigate("/"))
      }
      console.log(`[GraphQL error]:`, {
        Message: message,
        Location: locations,
        Path: path,
        Extension: extensions,
      })
    })
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const isBrowser = () => typeof window !== "undefined"

const wooSessionMiddleware = new ApolloLink((operation, forward) => {
  /**
   * If session data exist in local storage, set value as session header.
   */
  const session = isBrowser() && window.localStorage.getItem("woo-session")
  const { uri } = operation.getContext() // doesn't set woocommerce headers if CMS

  if (session && uri !== process.env.GATSBY_GRAPHQL_URL) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers, // spread existing headers, e.g. authentication
        "woocommerce-session": `Session ${session}`,
      },
    }))
  }

  return forward(operation)
})

const wooSessionAfterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext()
    const {
      response: { headers },
    } = context
    const session = headers.get("woocommerce-session")
    if (session) {
      // remove session data if session destroyed.
      if ("false" === session) {
        window.localStorage.removeItem("woo-session")
        // update session new data if changed.
      } else if (window.localStorage.getItem("woo-session") !== session) {
        window.localStorage.setItem(
          "woo-session",
          headers.get("woocommerce-session")
        )
      }
    }

    return response
  })
})

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__"

let apolloClient

const createApolloClient = () =>
  new ApolloClient({
    ssrMode: isBrowser === false,
    link: from([
      onErrorLink,
      currencyMiddleware,
      wooSessionMiddleware,
      wooSessionAfterware,
      cmsMiddleware,
    ]),
    cache: new InMemoryCache({
      possibleTypes,
      typePolicies: {
        Query: {
          fields: {
            cart: {
              merge: true,
            },
          },
        },
        Product: {
          keyFields: ["databaseId"],
        },
        ProductVariation: {
          keyFields: ["databaseId"],
        },
        CartItem: {
          keyFields: ["key"],
        },
        MetaData: {
          keyFields: false,
        },
      },
    }),
  })

export const client = new ApolloClient({
  link: from([
    // refreshTokenLink,
    onErrorLink,
    currencyMiddleware,
    // authMiddleware,
    wooSessionMiddleware,
    wooSessionAfterware,
    cmsMiddleware,
  ]),
  cache: new InMemoryCache({
    possibleTypes,
    typePolicies: {
      Query: {
        fields: {
          cart: {
            merge: true,
          },
        },
      },
      Product: {
        keyFields: ["databaseId"],
      },
      ProductVariation: {
        keyFields: ["databaseId"],
      },
      CartItem: {
        keyFields: ["key"],
      },
      MetaData: {
        keyFields: false,
      },
    },
  }),
})

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (isBrowser === false) return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client?.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
