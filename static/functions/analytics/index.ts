import { Context, Handler } from "@netlify/functions"
import { Analytics } from "@segment/analytics-node"

type SessionId = string

type WooCommerceProduct = {
  id: string
  sku: string
  productCategories: {
    nodes: Array<{
      name: string
    }>
  }
  name: string
  menuOrder: number
  uri: string
  image: {
    mediaItemUrl: string
  }
}

type Product = {
  id: string
  sku: string
  category: string[]
  name: string
  brand: string
  // variant:
  price: number
  quantity: number
  // coupon:
  currency: string
}

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY as string,
})

analytics.on("error", err => console.error(err))

analytics.on("identify", ctx => console.log(ctx))

analytics.on("track", ctx => console.log(ctx))

const identifyUser = async (email: string) =>
  await new Promise(resolve =>
    analytics.identify(
      {
        userId: email,
      },
      resolve
    )
  )

const trackPLPView = async (sessionId: SessionId) =>
  await new Promise(resolve =>
    analytics.track(
      {
        anonymousId: sessionId,
        event: "Product List Viewed",
        properties: {
          // ...
        },
      },
      resolve
    )
  )

const trackPDPView = async (
  sessionId: SessionId,
  product: WooCommerceProduct
) =>
  await new Promise(resolve =>
    analytics.track(
      {
        anonymousId: sessionId,
        event: "Product Viewed",
        properties: {
          product_id: product.id,
          sku: product.sku,
          category: product.productCategories.nodes[0].name,
          name: product.name,
          brand: "VIEREN",
          // variant: null, // string
          // price: parseInt(price),
          // quantity,
          // coupon: null,
          // currency,
          position: product.menuOrder,
          // value: quantity * parseInt(price),
          url: `${process.env.GATSBY_SITE_URL}${product.uri}`,
          image_url: `${process.env.GATSBY_SITE_URL}${product.image.mediaItemUrl}`,
        },
      },
      resolve
    )
  )

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    }
  }

  const data = JSON.parse(event.body as string)

  if (data.email) {
    const res = await identifyUser(data.email)

    console.log(res)
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  }

  return {
    statusCode: 200,
    body: "",
  }
}

export { handler }
