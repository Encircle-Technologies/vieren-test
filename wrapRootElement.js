import React from "react"
import { LocationProvider } from "@reach/router"
import { client } from "./src/utils/apollo/client"
import { ApolloProvider } from "@apollo/client"
import { MemberProvider } from "./src/hooks/useMember"
import { CurrencyProvider } from "./src/hooks/useCurrency"
import { CustomerProvider } from "./src/hooks/useCustomer"
import { ProductProvider } from "./src//hooks/useProductData"

export default function wrapRootElement({ element }) {
  return (
    <LocationProvider>
      <ApolloProvider client={client}>
        <CurrencyProvider>
          <MemberProvider>
            <CustomerProvider>
              <ProductProvider>{element}</ProductProvider>
            </CustomerProvider>
          </MemberProvider>
        </CurrencyProvider>
      </ApolloProvider>
    </LocationProvider>
  )
}
