import { trackPage } from "./src/utils/analytics/segment"

export function onRouteUpdate({ location, prevLocation }) {
  window.setTimeout(() => trackPage(document.title), 50)
}

export { default as wrapRootElement } from "./wrapRootElement"
export { default as wrapPageElement } from "./wrapPageElement"
