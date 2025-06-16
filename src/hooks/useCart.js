import { useEffect } from "react"
import { useCurrency } from "./useCurrency"
import { useQuery, NetworkStatus } from "@apollo/client"
import GET_CART from "../components/Cart/Cart.query.graphql"

export function useCart(options) {
  const { selected: selectedCurrency } = useCurrency()
  const { data, loading, error, refetch, networkStatus } = useQuery(GET_CART, {
    context: { currency: selectedCurrency },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only", // REQUIRED for accurate currency updates
    ...options,
  })

  useEffect(() => {
    process.env.NODE_ENV === "development" &&
      console.log(`[useCart] refetching cart in ${selectedCurrency}`)
    refetch()
  }, [selectedCurrency, refetch])

  const isRefetching = networkStatus === NetworkStatus.refetch

  return { data, loading, isRefetching, error }
}
