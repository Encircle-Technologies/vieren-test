import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useMember } from "../../hooks/useMember"

export default function ProtectedRoute({
  component: Component,
  location,
  ...rest
}) {
  const { isMember } = useMember()

  useEffect(() => {
    if (!isMember) {
      navigate("login", { state: { back: location.pathname }, replace: true })
    }
  }, [isMember])

  if (typeof window !== "undefined" && isMember) {
    return <Component {...rest} />
  }

  return null
}
