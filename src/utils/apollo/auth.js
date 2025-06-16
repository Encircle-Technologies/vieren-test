import decode from "jwt-decode"

let inMemoryAuthTokenDefault = {
  authToken: null,
  authExpiration: null,
}

let inMemoryAuthToken = inMemoryAuthTokenDefault

// Local Storage Key
export const REFRESH_TOKEN_KEY = `REFRESH_TOKEN`
export const LOGGED_OUT_KEY = `LOGGED_OUT_TIME`

// Helper
export const isBrowser = typeof window !== `undefined`

// Checks if current token is expired
export const isTokenExpired = authToken => {
  if (authToken) {
    const currentTime = Date.now()
    const expTime = decode(authToken).exp * 1000
    console.log(`${expTime - currentTime}ms before refresh required`)
    const isExpired = expTime - currentTime <= 0

    return isExpired
  }

  return true
}

export const isLoggedOut = () => {
  const loggedOutTime = getLoggedOutTime()
  return loggedOutTime && loggedOutTime <= Date.now()
}

// Methods

export const deleteRefreshToken = () => {
  if (!isBrowser) return null
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const logout = callback => {
  inMemoryAuthToken = inMemoryAuthTokenDefault
  deleteRefreshToken()
  setLoggedOutTime()

  if (callback) {
    callback()
  }
}

// Setter

export const setAuthToken = authToken => {
  if (!isBrowser) return
  if (!authToken) {
    process.env.NODE_ENV === "development" &&
      console.log(
        "[setAuthToken]",
        `Auth Token or Auth Expiration shouldn't be ${authToken}.`
      )
    return
  }
  inMemoryAuthToken = { authToken, authExpiration: decode(authToken).exp }
}

export const setRefreshToken = (refreshToken, callback) => {
  if (!isBrowser) return
  if (!refreshToken) {
    process.env.NODE_ENV === "development" &&
      console.log(
        "[setRefreshToken]",
        `Refresh token shouldn't be ${refreshToken}.`
      )
    return
  }

  localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshToken))
  localStorage.removeItem(LOGGED_OUT_KEY)

  process.env.NODE_ENV === "development" &&
    console.log("[setRefreshToken]", inMemoryAuthToken)

  if (callback) {
    callback()
  }
}

export const setLoggedOutTime = () => {
  if (!isBrowser) return
  localStorage.setItem(LOGGED_OUT_KEY, JSON.stringify(Date.now()))
}

// Getter

export const getInMemoryAuthToken = () => {
  if (!isBrowser) return null
  return inMemoryAuthToken.authToken
}

export const getAuthTokenExpiration = () => {
  if (!isBrowser) return null
  return inMemoryAuthToken.authExpiration
}

export const getRefreshToken = () => {
  if (!isBrowser) return null
  return JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY))
}

export const getLoggedOutTime = () => {
  if (!isBrowser) return null
  return JSON.parse(localStorage.getItem(LOGGED_OUT_KEY))
}

export const checkUserExists = async email => {
  const { id, username } = await fetch("/.netlify/functions/WpUserQuery", {
    method: "POST",
    body: JSON.stringify({ username: email }),
  }).then(response => response.json())

  return { id, username }
}
