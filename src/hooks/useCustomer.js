import React, { createContext, useContext } from "react"
import { useQuery, NetworkStatus } from "@apollo/client"
import GetViewerQuery from "../components/Auth/Viewer.query.graphql"
import GET_CUSTOMER from "../components/Account/Customer.query.graphql"

const CustomerContext = createContext(null)

export const CustomerProvider = ({ children }) => (
  <CustomerContext.Provider value={useProvideCustomer()}>
    {children}
  </CustomerContext.Provider>
)

export const useCustomer = () => useContext(CustomerContext)

const useProvideCustomer = () => {
  const {
    data: viewerData,
    loading: viewerLoading,
    error: viewerError,
    refetch: refetchViewer,
  } = useQuery(GetViewerQuery, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
  })

  const {
    data,
    loading: customerLoading,
    error: customerError,
    refetch,
    networkStatus,
    client,
  } = useQuery(GET_CUSTOMER, {
    variables: {
      id: viewerData?.viewer?.id,
    },
    skip: !viewerData || !viewerData.viewer || viewerLoading || viewerError,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    // onCompleted: () => console.log("customer query onComplete"),
  })

  const isRefetching = networkStatus === NetworkStatus.refetch

  const resetCustomer = () => {
    // orphan references to viewer, user, and customer
    client.cache.modify({
      fields: {
        viewer(cachedViewer, { DELETE }) {
          return DELETE
        },
        user(cachedUser, { DELETE }) {
          return DELETE
        },
        customer(cachedCustomer, { DELETE }) {
          return DELETE
        },
      },
    })

    // evict user and customer cache objects
    client.cache.evict({
      id: data?.user?.id,
    })

    client.cache.evict({
      id: data?.customer?.id,
    })

    // initiate garbage collection
    client.cache.gc()
  }

  return {
    data,
    loading: viewerLoading || customerLoading,
    isRefetching,
    error: viewerError || customerError,
    refetch,
    refetchViewer,
    resetCustomer,
  }
}
