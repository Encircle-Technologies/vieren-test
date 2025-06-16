import { useState, useEffect } from "react"

const useNetwork = () => {
  const initialValue =
    typeof window !== "undefined" ? window.navigator.onLine : true
  const [isOnline, setNetwork] = useState(initialValue)
  const updateNetwork = () => setNetwork(window.navigator.onLine)

  useEffect(() => {
    typeof window !== "undefined" &&
      window.addEventListener("offline", updateNetwork)
    typeof window !== "undefined" &&
      window.addEventListener("online", updateNetwork)
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("offline", updateNetwork)
      typeof window !== "undefined" &&
        window.removeEventListener("online", updateNetwork)
    }
  })

  return isOnline
}

export default useNetwork
