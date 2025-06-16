import { getRawWooSession } from "../session"
import { parsePrice, parseFeaturedCollection } from "./gtag"
interface ClientProfileData {
  confirmed: "yes" | "no"
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  note?: string
  notifications: boolean
}

export const session = getRawWooSession()

/**
 * Reference: https://developers.klaviyo.com/en/reference/create_client_profile
 * @param email
 * @returns Promise<Response>
 */
export async function createClientProfile(email: string) {
  const url = `https://a.klaviyo.com/client/profiles/?company_id=${process.env.GATSBY_KLAVIYO_COMPANY_ID}`
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      revision: "2025-01-15",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "profile", // required
        attributes: {
          email,
        },
        meta: {
          identifiers: {
            email,
          },
        },
      },
    }),
  }

  return fetch(url, options)
}

export async function createClientSubscription(
  email: string,
  source: string,
  list?: string
) {
  const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${process.env.GATSBY_KLAVIYO_COMPANY_ID}`
  const options = {
    method: "POST",
    headers: { revision: "2025-01-15", "content-type": "application/json" },
    body: JSON.stringify({
      data: {
        type: "subscription",
        attributes: {
          custom_source: source || "Vieren Website",
          profile: {
            data: {
              type: "profile",
              attributes: {
                email,
              },
            },
          },
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: list || process.env.GATSBY_KLAVIYO_LIST_ID,
            },
          },
        },
      },
    }),
  }

  return fetch(url, options)
}

export async function createClientEvent(
  email: string,
  metricName: string,
  properties?: any
) {
  const url = `https://a.klaviyo.com/client/events/?company_id=${process.env.GATSBY_KLAVIYO_COMPANY_ID}`
  const options = {
    method: "POST",
    headers: { revision: "2025-01-15", "content-type": "application/json" },
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          properties: properties || {},
          metric: {
            data: { type: "metric", attributes: { name: metricName } },
          },
          profile: { data: { type: "profile", attributes: { email } } },
        },
      },
    }),
  }

  return fetch(url, options)
}

export const trackDirectMarketingOptin = async (email: string) =>
  await createClientEvent(email, "marketing_optin")

export const trackDirectGenerateLead = async (email: string) =>
  await createClientEvent(email, "generate_lead")

export const trackDirectDownloadConfirmation = async (email: string) =>
  await createClientEvent(email, "download_confirmation")

export const trackDirectBeginCheckout = async (
  email: string,
  data: any,
  currency: string
) =>
  await createClientEvent(email, "begin_checkout", {
    currency,
    value: parsePrice(data.cart.subtotal),
    cart_session: session,
    item_names: data.cart.contents.nodes.reduce(
      (acc: string[], curr: any) => [...acc, curr.product.node.name as string],
      []
    ),
    featured_collection: parseFeaturedCollection(data.cart.contents.nodes),
    items: data.cart.contents.nodes.reduce(
      (acc: any[], curr: any) => [
        ...acc,
        {
          item_id: curr.product.node.id,
          item_name: curr.product.node.name,
          item_brand: "VIEREN",
          item_category: "Apparel & Accessories",
          item_category2: "Jewelry",
          item_category3: "Watches",
          item_category4: "Automatic Watches",
          item_category5: "Swiss Made Watches",
          item_list_id: curr.product.node.productCategories.nodes[0].id,
          item_list_name: curr.product.node.productCategories.nodes[0].name,
          item_variant: curr.variation ? curr.variation.node.id : null,
          image_url: curr.product.node.image.mediaItemUrl,
          price: parsePrice(curr.product.node.price),
          quantity: curr.quantity,
        },
      ],
      []
    ),
  })

export const trackDirectAddShippingInfo = async (email: string) =>
  await createClientEvent(email, "add_shipping_info")

export const trackDirectAddPaymentInfo = async (email: string) =>
  await createClientEvent(email, "add_payment_info")

export const trackDirectPurchase = async (
  email: string,
  order: any,
  currency: string
) =>
  await createClientEvent(email, "purchase", {
    cart_session: session,
    transaction_id: order.id,
    currency,
    value: parsePrice(order.total),
    shipping: parsePrice(order.shippingTotal),
    tax: parsePrice(order.totalTax),
    featured_collection: parseFeaturedCollection(order.lineItems.nodes),
    items: order.lineItems.nodes.reduce(
      (acc: any[], curr: any) => [
        ...acc,
        {
          item_id: curr.product.node.id,
          item_name: curr.product.node.name,
          item_brand: "VIEREN",
          item_category: "Apparel & Accessories",
          item_category2: "Jewelry",
          item_category3: "Watches",
          item_category4: "Automatic Watches",
          item_category5: "Swiss Made Watches",
          item_list_id: curr.product.node.productCategories.nodes[0].id,
          item_list_name: curr.product.node.productCategories.nodes[0].name,
          item_variant: curr.variation ? curr.variation.node.id : null,
          image_url: curr.product.node.image.mediaItemUrl,
          price: parsePrice(curr.product.node.price),
          quantity: curr.quantity,
        },
      ],
      []
    ),
  })
