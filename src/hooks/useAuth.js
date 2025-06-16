import React, { createContext, useContext, useEffect } from "react"
import {
  getInMemoryAuthToken,
  getRefreshToken,
  isLoggedOut,
  isTokenExpired,
  LOGGED_OUT_KEY,
  logout,
  setAuthToken,
} from "../utils/apollo/auth"
import { gql, useMutation } from "@apollo/client"
import useNetwork from "./useNetwork"

import GET_VIEWER from "../components/Auth/Viewer.query.graphql"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={useProvideAuth()}>
    {children}
  </AuthContext.Provider>
)

export const useAuth = () => useContext(AuthContext)

const syncLoginStatus = event => {
  if (event.key === LOGGED_OUT_KEY && isLoggedOut()) {
    logout() // update this to "/account"? 2020/03/13
  }
}

const REFRESH_TOKEN = gql`
  mutation GET_REFRESH_TOKEN($input: RefreshJwtAuthTokenInput!) {
    refreshJwtAuthToken(input: $input) {
      authToken
    }
  }
`

const useProvideAuth = () => {
  const [refreshToken] = useMutation(REFRESH_TOKEN, {
    // fetchPolicy: "no-cache",
    // onCompleted: data => {
    //   if (data.refreshJwtAuthToken) {
    //     process.env.NODE_ENV === "development" &&
    //       console.log(
    //         "[silentRefresh] assigning token",
    //         data.refreshJwtAuthToken.authToken
    //       )
    //   }
    // },
  })
  const isOnline = useNetwork()

  // Consolidate all methods into one function that returns current state
  const loginState = () => {
    const token = getInMemoryAuthToken()
    const tokenExists = !!token
    const tokenExpired = isTokenExpired(token)
    const refreshExists = !!getRefreshToken()

    if (tokenExists && !tokenExpired) return "loggedin"
    else if (tokenExists && tokenExpired) return "expired"
    else if (!tokenExists && refreshExists) return "revisiting"
    else return "loggedout"
  }

  async function silentRefresh() {
    await refreshToken({
      variables: {
        input: {
          jwtRefreshToken: getRefreshToken(),
        },
      },
      update: (cache, mutationResult) => {
        if (mutationResult.data.refreshJwtAuthToken) {
          process.env.NODE_ENV === "development" &&
            console.log(
              "[silentRefresh] assigning token",
              mutationResult.data.refreshJwtAuthToken.authToken
            )

          setAuthToken(mutationResult.data.refreshJwtAuthToken.authToken)
        }
      },
      refetchQueries: [{ query: GET_VIEWER }],
    })
  }

  /**
   * Make sure, User is logged out on all Tabs
   */
  useEffect(() => {
    typeof window !== "undefined" &&
      window.addEventListener("storage", syncLoginStatus)

    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("storage", syncLoginStatus)
    }
  })

  return {
    isOnline,
    loginState,
    silentRefresh,
  }
}
