import { getRawWooSession } from "../session"

export const session = getRawWooSession()

declare const window: Window & { dataLayer: Record<string, unknown>[] }

export const parsePrice = (price: string) =>
  price ? parseInt(price.replace(/\$|,/g, "")) : 0

export const parseFeaturedCollection = (collections: any[]) => {
  // 1. reduce cart items to array of collection strings
  const collectionNames = collections.reduce(
    (acc: string[], curr: any) => [
      ...acc,
      curr.product.node.collections.nodes[0]?.name as string,
    ],
    []
  )
  // 2. if array of collection strings includes 'Stereo Collection', return 'Stereo Collection'
  return collectionNames.includes("Stereo")
    ? "Stereo"
    : collectionNames.includes("OG Automatic")
    ? "OG Automatic"
    : ""
}

/**
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_item
 */

type Item = {
  id: string
  name: string
  item_id: string
  item_name: string
  affiliation?: string
  coupon?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  quantity?: number
  google_business_vertical?: string
}

type KlaviyoItem = {
  image_url?: string
}

type CombinedItem = Item & KlaviyoItem

type ViewItemParameters = {
  currency: string
  value: number
  items: CombinedItem[]
}
type AddToCartParameters = {
  currency: string
  value: number
  items: CombinedItem[]
}

type ViewItemListParamters = {
  item_list_id?: string
  item_list_name?: string
  items: CombinedItem[]
}

type BeginCheckoutParameters = {
  currency: string
  value: number
  coupon?: string
  items: CombinedItem[]
}

type PurchaseParameters = {
  transaction_id: string
  currency: string
  value: number
  coupon?: string
  shipping?: number
  tax?: number
  items: CombinedItem[]
}

export function trackUpdatedEmail(email_address: string) {
  window.dataLayer.push({
    user_data: {
      email_address,
    },
  })
}

export function trackMarketingOptin(email_address: string) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "marketing_optin",
    user_data: {
      email_address,
    },
  })
}

export function trackPLPView(products: any[], currency: string) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      items: products?.map(product => ({
        id: getProductIdByCurrency(currency, product.id),
        item_id: getProductIdByCurrency(currency, product.id),
        name: product.name,
        item_name: product.name,
        item_brand: "VIEREN",
        item_category: "Apparel & Accessories",
        item_category2: "Jewelry",
        item_category3: "Watches",
        item_category4: "Automatic Watches",
        item_category5: "Swiss Made Watches",
        item_list_id: product.productCategories.nodes[0].id,
        item_list_name: product.productCategories.nodes[0].name,
        // item_variant,
        price: parsePrice(product.price),
        quantity: 1,
        google_business_vertical: "retail",
      })),
    } as ViewItemListParamters,
  })
}

export function trackPDPView(product: any, currency: string) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency,
      value: 0,
      item_name: product.name,
      items: [
        {
          id: getProductIdByCurrency(currency, product.id),
          item_id: getProductIdByCurrency(currency, product.id),
          name: product.name,
          item_name: product.name,
          index: product.menuOrder,
          item_brand: "VIEREN",
          item_category: "Apparel & Accessories",
          item_category2: "Jewelry",
          item_category3: "Watches",
          item_category4: "Automatic Watches",
          item_category5: "Swiss Made Watches",
          item_list_id: product.productCategories.nodes[0].id,
          item_list_name: product.productCategories.nodes[0].name,
          // item_variant,
          price: parsePrice(product.price),
          google_business_vertical: "retail",
        },
      ],
    } as ViewItemParameters,
  })
}

export function trackGenerateLead() {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "generate_lead",
  })
}

export function trackDownloadConfirmation() {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "download_confirmation",
  })
}

export function trackAddToCart(
  product: any,
  quantity: number,
  currency: string
) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency,
      value: 0,
      item_name: product.name,
      cart_session: session,
      items: [
        {
          id: getProductIdByCurrency(currency, product.id),
          item_id: getProductIdByCurrency(currency, product.id),
          name: product.name,
          item_name: product.name,
          item_brand: "VIEREN",
          item_category: "Apparel & Accessories",
          item_category2: "Jewelry",
          item_category3: "Watches",
          item_category4: "Automatic Watches",
          item_category5: "Swiss Made Watches",
          item_list_id: product.productCategories.nodes[0].id,
          item_list_name: product.productCategories.nodes[0].name,
          // item_variant: curr.variation ? curr.variation.node.id : null,
          image_url: product.image.mediaItemUrl,
          price: parsePrice(product.price),
          quantity,
          google_business_vertical: "retail",
        },
      ],
    } as AddToCartParameters,
  })
}

export function trackBeginCheckout(data: any, currency: string) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value: parsePrice(data.cart.subtotal),
      cart_session: session,
      item_names: data.cart.contents.nodes.reduce(
        (acc: string[], curr: any) => [
          ...acc,
          curr.product.node.name as string,
        ],
        []
      ),
      featured_collection: parseFeaturedCollection(data.cart.contents.nodes),
      items: data.cart.contents.nodes.reduce(
        (acc: Item[], curr: any) => [
          ...acc,
          {
            id: getProductIdByCurrency(currency, curr.product.node.id),
            item_id: getProductIdByCurrency(currency, curr.product.node.id),
            name: curr.product.node.name,
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
            google_business_vertical: "retail",
          },
        ],
        []
      ),
    } as BeginCheckoutParameters,
  })
}

export function trackAddShippingInfo() {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "add_shipping_info",
  })
}

export function trackAddPaymentInfo() {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "add_payment_info",
  })
}

export function trackPurchase(order: any, currency: string) {
  window.dataLayer.push({
    ecommerce: null,
  }) // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      cart_session: session,
      transaction_id: order.id,
      currency,
      value: parsePrice(order.total),
      shipping: parsePrice(order.shippingTotal),
      tax: parsePrice(order.totalTax),
      featured_collection: parseFeaturedCollection(order.lineItems.nodes),
      items: order.lineItems.nodes.reduce(
        (acc: Item[], curr: any) => [
          ...acc,
          {
            id: getProductIdByCurrency(currency, curr.product.node.id),
            item_id: getProductIdByCurrency(currency, curr.product.node.id),
            name: curr.product.node.name,
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
            google_business_vertical: "retail",
          },
        ],
        []
      ),
    } as PurchaseParameters,
  })
}

export function getProductIdByCurrency(currency: string, productId): string {
  return (currency == 'CAD' ? 'ca_' : '') + productId;
}
