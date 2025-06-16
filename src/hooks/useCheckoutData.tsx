import React, { createContext, useContext, useReducer } from "react"

type Address = {
  firstName: string
  lastName: string
  company: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
  country: string
  phone: string
  overwrite: boolean
}

type Action =
  | {
      type: "shipping"
      payload: {
        email: CheckoutData["email"]
        firstName: CheckoutData["firstName"]
        lastName: CheckoutData["lastName"]
        marketingOptIn: CheckoutData["marketingOptIn"]
        shipping: CheckoutData["shipping"]
        giftMessage: CheckoutData["giftMessage"]
      }
    }
  | { type: "billing" }
type Dispatch = (action: Action) => void
type CheckoutData = {
  email: string
  firstName: string
  lastName: string
  marketingOptIn: boolean
  shipping: Address
  shippingMethod: string
  billingSame: boolean
  billing: Address
  cardholderName: string
  paymentMethod: "stripe"
  customerNote: string
  acceptTerms: boolean
  giftMessage: string
}
type CheckoutDataProviderProps = { children: React.ReactNode }

const CheckoutDataContext = createContext<
  { state: CheckoutData; dispatch: Dispatch } | undefined
>(undefined)

function checkoutReducer(state: CheckoutData, action: Action) {
  switch (action.type) {
    case "shipping": {
      return {
        ...state,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        marketingOptIn: action.payload.marketingOptIn,
        shipping: action.payload.shipping,
        giftMessage: action.payload.giftMessage,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function CheckoutDataProvider({ children }: CheckoutDataProviderProps) {
  const [state, dispatch] = useReducer(checkoutReducer, {
    email: "",
    firstName: "",
    lastName: "",
    marketingOptIn: true,
    shipping: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      phone: "", // shipping phone doesnt exist on account
      overwrite: true,
    },
    shippingMethod: "",
    billingSame: true,
    billing: {
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      phone: "",
      overwrite: true,
    },
    cardholderName: "",
    paymentMethod: "stripe",
    customerNote: "",
    acceptTerms: true,
    giftMessage: "",
  })

  const value = { state, dispatch }

  return (
    <CheckoutDataContext.Provider value={value}>
      {children}
    </CheckoutDataContext.Provider>
  )
}

function useCheckoutData() {
  const context = useContext(CheckoutDataContext)

  if (context === undefined) {
    throw new Error(
      "useCheckoutData must be used within a CheckoutDataProvider"
    )
  }

  return context
}

export { CheckoutData, CheckoutDataProvider, useCheckoutData }
