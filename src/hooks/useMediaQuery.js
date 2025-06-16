import { useState, useEffect } from "react"

const isBrowser = typeof window !== "undefined"

export default function useMediaQuery(query, defaultState = false) {
  const [match, setMatch] = useState(
    isBrowser ? window.matchMedia(query).matches : defaultState
  )

  useEffect(() => {
    let mounted = true

    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) return

      setMatch(!!mql.matches)
    }
    // required to support iOS 13
    mql.addListener(onChange)
    // mql.addEventListener("change", onChange)
    setMatch(mql.matches)

    return () => {
      mounted = false
      // required to support iOS 13
      mql.removeListener(onChange)
      // mql.removeEventListener("change", onChange)
    }
  }, [query])

  return match
}
