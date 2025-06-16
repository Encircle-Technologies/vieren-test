import React, { createContext, useContext, useState, useEffect } from "react"
import { useLocation } from "@reach/router"
import { parse } from "query-string"

import { useQuery, NetworkStatus } from "@apollo/client"
import { GetAllPricesQuery } from "./GetAllPrices.query.graphql"

const CurrencyContext = createContext(null)

export const CurrencyProvider = ({ children }) => {
  return (
    <CurrencyContext.Provider value={useProvideCurrency()}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)

const currencies = ["USD", "CAD"]

const defaultSelected = currencies.find(currency => currency === "USD")

function setDefaultCurrency(query) {
  const vars = parse(query)

  if (vars.defaultCurrency && currencies.indexOf(vars.defaultCurrency) !== -1) {
    return vars.defaultCurrency
  }

  return defaultSelected
}

const useProvideCurrency = () => {
  const location = useLocation()
  const [selected, setSelected] = useState(() => {
    if (location.search) {
      // Query string parameters take precedence over
      // everything else.
      return setDefaultCurrency(location.search)
    } else {
      // Otherwise evaluate whether or not there's a
      // localStorageKey for currency already.
      let currency = defaultSelected

      try {
        const localStorageValue = window?.localStorage.getItem("currency")

        if (localStorageValue !== null) {
          currency = JSON.parse(localStorageValue)
        } else {
        }

        return currency
      } catch (e) {
        currency = defaultSelected
      }

      return currency
    }
  })

  useEffect(() => {
    window?.localStorage.setItem("currency", JSON.stringify(selected))
  }, [selected])

  const { loading, networkStatus } = useQuery(GetAllPricesQuery, {
    context: { currency: selected },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  })

  return {
    currencies,
    selected,
    setSelected,
    loading,
    ready: networkStatus === NetworkStatus.ready,
  }
}
