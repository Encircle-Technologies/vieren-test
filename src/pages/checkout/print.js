import React, { useEffect } from "react"
import Success from "../../components/Checkout/Success"

export default function PrintPage({ location }) {
  useEffect(() => {
    setTimeout(() => typeof window !== "undefined" && window.print(), 2000)
  }, [])

  if (location.state) {
    return <Success data={location.state} />
  }

  return null
}
