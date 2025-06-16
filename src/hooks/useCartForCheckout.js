import { useEffect } from "react"
import { useCurrency } from "./useCurrency"
import { useQuery, NetworkStatus } from "@apollo/client"
import GET_CART_FOR_CHECKOUT from "../components/Checkout/Checkout.query.graphql"

export function useCartForCheckout(options) {
  const { selected: selectedCurrency } = useCurrency()
  const { data, loading, error, refetch, networkStatus } = useQuery(
    GET_CART_FOR_CHECKOUT,
    {
      context: { currency: selectedCurrency.value },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      ...options,
    }
  )

  useEffect(() => {
    refetch()
  }, [selectedCurrency, refetch])

  const isRefetching = networkStatus === NetworkStatus.refetch

  return { data, loading, isRefetching, error }
}
