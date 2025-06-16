import React from "react"
import { Script, ScriptStrategy } from "gatsby"
import Layout from "./src/components/Layout/Layout"
import SimpleLayout from "./src/components/Layout/SimpleLayout"

export default function wrapPageElement({ element, props }) {
  const { data, location } = props

  if (data) {
    const types = data && Object.keys(data)

    const pageTypes = types.filter(type => type.startsWith("wp"))

    const type =
      pageTypes.length === 1
        ? pageTypes[0]
        : pageTypes.length > 1 && data["wpProductPage"] // product pages include both wpProductPage and wpProduct
        ? "wpProductPage"
        : pageTypes.length > 1 && data["wpGift"]
        ? "wpGift"
        : pageTypes.length > 1 && data["wpPost"]
        ? "wpPost"
        : null

    const headerStyle =
      type === "wpProductPage"
        ? data.wpProductPage.ACFProduct?.theme
        : data[type]?.template?.ACF2021?.headerStyle || "light"

    return (
      <Layout
        headerStyle={headerStyle}
        product={type === "wpProductPage" ? data.wpProduct : null}
      >
        {process.env.GATSBY_TIDIO_ENABLED === "true" && (
          <Script
            id="tidio-js"
            strategy="idle"
            src="//code.tidio.co/sdtns06akaep2qb0cbkere6thl2e9d5q.js"
          />
        )}
        {element}
      </Layout>
    )
  } else if (!data && location.pathname.includes("/checkout")) {
    return (
      <SimpleLayout isOrder={location.pathname.includes("/checkout/success")}>
        {process.env.GATSBY_TIDIO_ENABLED === "true" && (
          <Script
            id="tidio-js"
            strategy="idle"
            src="//code.tidio.co/sdtns06akaep2qb0cbkere6thl2e9d5q.js"
          />
        )}
        {element}
      </SimpleLayout>
    )
  } else {
    return (
      <Layout>
        {process.env.GATSBY_TIDIO_ENABLED === "true" && (
          <Script
            id="tidio-js"
            strategy="idle"
            src="//code.tidio.co/sdtns06akaep2qb0cbkere6thl2e9d5q.js"
          />
        )}
        {element}
      </Layout>
    )
  }
}
