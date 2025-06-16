import decode from "jwt-decode"

const isBrowser = typeof window !== `undefined`

export const getWooSession = () => {
  if (!isBrowser) return

  const session = localStorage.getItem("woo-session")

  if (typeof session !== "string") {
    return null
  }

  const raw = decode(session)

  return raw?.data?.customer_id
}

export const getRawWooSession = () => {
  if (!isBrowser) return

  return localStorage.getItem("woo-session")
}

export const setRawWooSession = (raw: string) => {
  if (!isBrowser) return

  localStorage.setItem("woo-session", raw)
}
