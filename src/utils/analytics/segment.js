import { getWooSession } from "../session"

const session = getWooSession()

const SITE_NAME = "https://vieren.co"

const isBrowser = typeof window !== "undefined"

const parsePrice = price => (price ? parseInt(price.replace(/\$|,/g, "")) : 0)

// https://segment.com/docs/connections/spec/ecommerce/v2/
// “Products Searched” will be sent as “Search”
// “Product List Viewed” will be sent as “ViewContent”
// “Product Viewed” will be sent as “ViewContent”
// “Product Added” will be sent as “AddToCart”
// “Checkout Started” will be sent as “InitiateCheckout”
// “Order Completed” will be sent as “Purchase”

export const identifyUser = (id = "", properties = {}) =>
  isBrowser && window.analytics && window.analytics.identify(id, properties)

export const trackPage = (category, name, properties, options, callback) =>
  isBrowser &&
  window.analytics &&
  window.analytics.page(category, name, properties, options, callback)

export const trackEvent = (event, properties) =>
  isBrowser && window.analytics && window.analytics.track(event, properties)

export const trackLink = (element, event, properties) =>
  isBrowser &&
  window.analytics &&
  window.analytics.trackLink(element, event, properties)

export const trackRegistration = () => trackEvent("Complete Registration", "") //CompleteRegistration
export const trackContact = () => trackEvent("Contact", {}) // Contact
export const trackSearch = () => trackEvent("Search", {}) //Search

export const trackOutbound = outboundUrl =>
  trackEvent("Outbound Link", { outboundUrl })

export const trackLead = email => trackEvent("Lead", { email }) // Lead

/**
 * FB: "ViewContent", expects the following properties:
 * {
    content_ids: products.reduce((acc, curr) => [...acc, ...curr.sku], []), // returns array of SKUs,
    content_category: "Watches",
    content_name: "Shop",
    content_type: "product",
    contents: products.reduce((acc, curr) => [...acc, { id: curr.sku, quantity: 1}], []) // return array of objects with SKUs and quantity 1
 * 
 */
export const trackPLPView = products =>
  trackEvent("Product List Viewed", {
    list_id: "Shop",
    // category: "Watches",
    // {
    //   product_id: String
    //   sku: String
    //   category: String
    //   name: String
    //   brand: String
    //   variant: String
    //   price: Number
    //   quantity: Number
    //   coupon: String
    //   position: Number
    //   url: String
    //   image_url:
    // }
    // products: products.reduce(
    //   (acc, curr) => [
    //     ...acc,
    //     {
    //       product_id: curr.id,
    //       sku: curr.sku,
    //       category: curr.productCategories.nodes[0].name,
    //       name: curr.name,
    //       brand: "VIEREN",
    //       // variant: null,
    //       price: parseInt(curr.price),
    //       // quantity: 1,
    //       // coupon: null,
    //       position: curr.menuOrder,
    //       url: `${SITE_NAME}${curr.uri}`,
    //       image_url: `${SITE_NAME}${curr.image.localFile.publicURL}`,
    //     },
    //   ],
    //   []
    // ),
  })
/**
 * 
 * FB: "ViewContent", expects the following properties:
 * {
    content_ids: [product.sku],
    content_category: product.productCategories.nodes[0].name, // First category in array
    content_name: product.name,
    content_type: "product",
    contents: [{id: product.sku, quantity: 1}]
  }
 */
export const trackPDPView = (product, currency) =>
  trackEvent("Product Viewed", {
    product_id: product.id,
    sku: product.sku,
    category: product.productCategories.nodes[0].name,
    name: product.name,
    brand: "VIEREN",
    // variant: null,
    price: parsePrice(product.price),
    // quantity,
    // coupon: null,
    currency,
    position: product.menuOrder,
    // value: quantity * parseInt(price),
    url: `${SITE_NAME}${product.uri}`,
    image_url: product.image.mediaItemUrl,
  })
//
/**
 * 
 * FB: "AddToCart", expects the following properties:
 * {
      content_ids: [product.sku],
      content_name: "Add To Cart",
      content_type: "product",
      contents: [{ id: product.sku, quantity }],
      currency,
      value: product.price * quantity,
    }
 * 
 * @param {Object} product 
 * @param {Number} quantity 
 * @param {String} currency 
 */
export const trackAddToCart = (product, quantity, currency) =>
  trackEvent("Product Added", {
    cart_id: session,
    product_id: product.id,
    sku: product.sku,
    category: product.productCategories.nodes[0].name,
    name: product.name,
    brand: "VIEREN",
    // variant: null,
    price: parsePrice(product.price),
    currency,
    quantity,
    // coupon: null,
    // position: null,
    url: `${SITE_NAME}${product.uri}`,
    image_url: product.image.mediaItemUrl,
  })

/**
 * FB: "InitiateCheckout", expects the following properties:
 * {
      content_ids:
      content_category:
      contents:
      currency:
      num_items:
      value:
    }
 */
export const trackCheckout = (data, currency) =>
  trackEvent("Checkout Started", {
    order_id: session,
    // affiliation: null,
    value: parsePrice(data.cart.subtotal),
    revenue: parsePrice(data.cart.contentsTotal),
    shipping: parsePrice(data.cart.shippingTotal),
    tax: parsePrice(data.cart.totalTax),
    discount: parsePrice(data.cart.discountTotal),
    // coupon: null,
    currency,
    products: data.cart.contents.nodes.reduce(
      (acc, curr) => [
        ...acc,
        {
          product_id: curr.product.node.id,
          variant: curr.variation ? curr.variation.node.id : null,
          sku: curr.product.node.sku,
          category: curr.product.node.productCategories.nodes[0].name,
          name: curr.product.node.name,
          brand: "VIEREN",
          price: parsePrice(curr.product.node.price),
          quantity: curr.quantity,
          // coupon: null,
          // position: curr.product.menuOrder,
          // url: `${SITE_NAME}${curr.product.node.uri}`, // no good way to support this
          image_url: curr.product.node.image.mediaItemUrl,
        },
      ],
      []
    ),
  })

export const trackAddPaymentInfo = () =>
  trackEvent("Payment Info Entered", {
    checkout_id: session,
  }) // AddPaymentInfo

/**
 * FB: Purchase, expects the following properties:
 * {
 *
 * }
 */
export const trackPurchase = (order, currency) =>
  trackEvent("Order Completed", {
    checkout_id: session,
    order_id: order.id,
    // affiliation: null,
    subtotal: parsePrice(order.subtotal),
    total: parsePrice(order.total),
    revenue: parsePrice(order.subtotal),
    shipping: parsePrice(order.shippingTotal),
    tax: parsePrice(order.totalTax),
    discount: parsePrice(order.discountTotal),
    // coupon: null,
    currency,
    products: order.lineItems.nodes.reduce(
      (acc, curr) => [
        ...acc,
        {
          product_id: curr.product.node.id,
          variant: curr.variation ? curr.variation.node.id : null,
          category: curr.product.node.productCategories.nodes[0].name,
          sku: curr.product.node.sku,
          name: curr.product.node.name,
          brand: "VIEREN",
          price: parsePrice(curr.product.node.price),
          quantity: curr.quantity,
          // url: `${SITE_NAME}${curr.product.uri}`,
          image_url: curr.product.node.image.mediaItemUrl,
        },
      ],
      []
    ),
  })
