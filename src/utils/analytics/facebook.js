const isBrowser = typeof window !== "undefined"

export function trackEvent(event, options) {
  if (isBrowser) {
    window.fbq && window.fbq("track", event, options)
  }
}
