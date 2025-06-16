import { useState, useEffect } from "react"

export default function useIsLoaded() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return isLoaded
}
