import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useQuery } from "@apollo/client"
import GetViewerQuery from "./Viewer.query.graphql"

export default function PrivateRoute({
  component: Component,
  // location,
  ...rest
}) {
  const { data, loading, error } = useQuery(GetViewerQuery)

  useEffect(() => {
    if (!loading && !data?.viewer) {
      navigate("/members/signin")
    }
  }, [data, loading])

  if (loading) return <div>Checking login status</div>

  if (error || !data) {
    return <div>Error logging in.</div>
  }

  if (data?.viewer?.id) {
    return <Component {...rest} />
  }

  return null
}
