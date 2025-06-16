import React, { useState, useEffect } from "react"
import { parse } from "query-string"
import Head from "../../components/Layout/Head"
import Checkout from "../../components/Checkout/Checkout"
import { setRawWooSession } from "../../utils/session"

export default function CheckoutPage({ location }) {
  const queryVars = parse(location.search)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (queryVars.session) {
      setRawWooSession(queryVars.session)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head pageTitle="Checkout" />
      <Checkout email={queryVars?.email} />
    </>
  )
}
