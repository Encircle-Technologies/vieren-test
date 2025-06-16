import React, { createContext, useContext, useReducer, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@reach/router"
import { useApolloClient } from "@apollo/client"
import { useCurrency } from "./useCurrency"
import { formatVariablePrice } from "../utils/price"
import SimpleProductData from "../components/Product/SimpleProduct.fragment.graphql"
import VariableProductData from "../components/Product/VariableProduct.fragment.graphql"
import VariantData from "../components/Product/Variant.fragment.graphql"

const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => (
  <ProductContext.Provider value={useProvideProduct()}>
    {children}
  </ProductContext.Provider>
)

export const useProduct = () => useContext(ProductContext)

function findVariation(attributeValue, variations) {
  console.log(`[DEBUG] searching for attribute: ${attributeValue}`)
  console.log(`[DEBUG] variations`, variations)

  if (attributeValue) {
    const results = variations.filter(
      variant =>
        variant.attributes.nodes.findIndex(
          attribute =>
            attribute.value.toLowerCase() === attributeValue.toLowerCase()
        ) > -1
    )

    if (results.length === 0) return null

    return results
  }

  return variations
}

function productReducer(state, action) {
  switch (action.type) {
    case "customization": {
      if (state.selectedVariation !== 0) {
        const [newVariation, _rest] =
          findVariation(state.selectedSize, action.variations) ||
          action.variations[0]
        console.log(`[DEBUG] reducer new variation: ${newVariation?.name}`)

        return {
          ...state,
          selectedCustomization: action.payload,
          selectedVariation: newVariation?.databaseId,
          error: "",
        }
      }

      return {
        ...state,
        selectedCustomization: action.payload,
        error: "",
      }
    }
    case "variation":
      return {
        ...state,
        selectedSize: action.size,
        selectedVariation: action.payload,
        error: "",
      }
    case "error":
      return {
        ...state,
        error: action.payload,
      }
    case "reset":
      return {
        ...state,
        selectedSize: "",
        selectedCustomization: "regular",
        selectedVariation: 0,
        error: "",
      }
    default:
      return state
  }
}

const useProvideProduct = () => {
  const [state, dispatch] = useReducer(productReducer, {
    selectedSize: "",
    selectedCustomization: "regular",
    selectedVariation: 0,
    error: "",
  })
  const location = useLocation()

  useEffect(() => {
    dispatch({ type: "reset" })
  }, [location])

  const setCustomization = (customization, variations) =>
    dispatch({
      type: "customization",
      payload: customization,
      variations,
    })

  const setSize = size => dispatch({ type: "size", payload: size })

  const setVariation = (id, size) =>
    dispatch({ type: "variation", payload: id, size })

  const setError = message => dispatch({ type: "error", payload: message })

  return {
    state,
    setSize,
    setCustomization,
    setVariation,
    setError,
  }
}

export function useCachedProductData(id) {
  const { selected: selectedCurrency } = useCurrency()
  const {
    usd: {
      products: { nodes: usdProducts },
    },
    cad: {
      products: { nodes: cadProducts },
    },
  } = useStaticQuery(graphql`
    query GetCachedPrices {
      usd {
        products(first: 100) {
          nodes {
            __typename
            databaseId
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
      cad {
        products(first: 100) {
          nodes {
            __typename
            databaseId
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
    }
  `)

  const cachedProducts =
    selectedCurrency === "USD"
      ? usdProducts
      : selectedCurrency === "CAD"
      ? cadProducts
      : []

  const cachedSimpleProduct = cachedProducts.find(
    product =>
      product.databaseId === id && product.__typename.includes("SimpleProduct")
  )
  const cachedVariableProduct = cachedProducts.find(
    product =>
      product.databaseId === id &&
      product.__typename.includes("VariableProduct")
  )

  const cachedVariations = cachedProducts.reduce((acc, curr) => {
    if (curr.__typename.includes("VariableProduct")) {
      return [...acc, ...curr.variations.nodes]
    }

    return acc
  }, [])

  const cachedVariation = cachedVariations.find(
    variation => variation.databaseId === id
  )

  const type = cachedSimpleProduct
    ? "simple"
    : cachedVariableProduct
    ? "variable"
    : cachedVariations
    ? "variation"
    : null

  const price =
    cachedSimpleProduct?.price ||
    cachedVariation?.price ||
    formatVariablePrice(cachedVariableProduct?.price)
  const stockStatus =
    cachedSimpleProduct?.stockStatus ||
    cachedVariation?.stockStatus ||
    cachedVariableProduct?.stockStatus
  const stockQuantity =
    cachedSimpleProduct?.stockQuantity ||
    cachedVariation?.stockQuantity ||
    cachedVariableProduct?.stockQuantity

  process.env.NODE_ENV === "development" &&
    console.log(
      `[DEBUG] product ${id} cached data: ${price}, ${stockStatus}, ${stockQuantity}`
    )

  return { type, price, stockStatus, stockQuantity, currency: selectedCurrency }
}

export function useProductData(id) {
  const {
    selected: selectedCurrency,
    loading: currencyLoading,
    ready: currencyReady,
  } = useCurrency()

  const client = useApolloClient()

  const simpleProduct = client.readFragment({
    id: `SimpleProduct:{"databaseId":${id}}`,
    fragment: SimpleProductData,
  })

  const variableProduct = client.readFragment({
    id: `VariableProduct:{"databaseId":${id}}`,
    fragment: VariableProductData,
  })

  const productVariation = client.readFragment({
    id: `ProductVariation:{"databaseId":${id}}`,
    fragment: VariantData,
  })

  const price =
    simpleProduct?.price ||
    productVariation?.price ||
    formatVariablePrice(variableProduct?.price)
  const stockStatus =
    simpleProduct?.stockStatus ||
    productVariation?.stockStatus ||
    variableProduct?.stockStatus
  const stockQuantity =
    simpleProduct?.stockQuantity ||
    productVariation?.stockQuantity ||
    variableProduct?.stockQuantity

  return {
    price,
    stockStatus,
    stockQuantity,
    currency: selectedCurrency,
    loading: currencyLoading,
    ready: currencyReady,
    // error: null,
  }
}
