const glob = require("glob")
const fs = require("fs")
const mailchimp = require("@mailchimp/mailchimp_marketing")
const md5 = require("md5")

require("dotenv").config({
  path: `.env.production`,
})

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
})

const getAllPageData = () => glob.sync(`./public/page-data/**/page-data.json`)

async function getPageQuery(file) {
  const jsonContents = await fs.promises.readFile(file, { encoding: "utf-8" })

  if (jsonContents) {
    const contents = await JSON.parse(jsonContents)

    return contents.result.data
  }

  return null
}

async function getProductPageQueries(files) {
  let products = []

  if (!!files.length) {
    await Promise.all(
      files.map(async file => {
        const data = await getPageQuery(file)

        if (data) {
          const keys = Object.keys(data)
          const isProductPage =
            keys.findIndex(key => key === "wpProductPage") !== -1

          if (isProductPage) {
            products.push(data)
          }
        }
      })
    )
  }

  return products
}

const parsePriceInt = price =>
  Math.round(parseFloat(price.replace(/\$|,/g, "")))

const getStores = async () => await mailchimp.ecommerce.stores()

const getAllStoreProducts = async () =>
  await mailchimp.ecommerce.getAllStoreProducts(
    process.env.MAILCHIMP_WOOCOMMERCE_STORE,
    {
      fields: ["products.id", "total_items"],
    }
  )

async function addStoreProduct(meta, product) {
  try {
    const res = await mailchimp.ecommerce.addStoreProduct(
      process.env.MAILCHIMP_WOOCOMMERCE_STORE,
      {
        id: product.id,
        title: meta.title,
        handle: meta.slug,
        url: meta.url,
        description: meta.description,
        image_url: meta.image_url,
        variants:
          product.__typename === "USD_SimpleProduct"
            ? [
                {
                  id: product.id,
                  title: product.name,
                  sku: product.sku,
                  price: parsePriceInt(product.price),
                  inventory_quantity: product.stockQuantity,
                  url: meta.url,
                  image_url: meta.image_url,
                },
              ]
            : product.__typename === "USD_VariableProduct"
            ? product.variations.nodes.map(variation => ({
                id: variation.id,
                title: variation.name,
                sku: variation.sku,
                price: parsePriceInt(variation.price),
                iventory_quantity: variation.stockQuantity,
                url: meta.url,
                image_url: meta.image_url,
              }))
            : [],
      }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

async function updateStoreProduct(meta, product) {
  try {
    const res = await mailchimp.ecommerce.updateStoreProduct(
      process.env.MAILCHIMP_WOOCOMMERCE_STORE,
      product.id,
      {
        id: product.id,
        title: meta.title,
        handle: meta.slug,
        url: meta.url,
        description: meta.description,
        image_url: meta.image_url,
        variants:
          product.__typename === "USD_SimpleProduct"
            ? [
                {
                  id: product.id,
                  title: product.name,
                  sku: product.sku,
                  price: parsePriceInt(product.price),
                  inventory_quantity: product.stockQuantity,
                  url: meta.url,
                  image_url: meta.image_url,
                },
              ]
            : product.__typename === "USD_VariableProduct"
            ? product.variations.nodes.map(variation => ({
                id: variation.id,
                title: variation.name,
                sku: variation.sku,
                price: parsePriceInt(variation.price),
                iventory_quantity: variation.stockQuantity,
                url: meta.url,
                image_url: meta.image_url,
              }))
            : [],
      }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

module.exports = async site => {
  try {
    // 1. Test Mailchimp configuration by getting the list of stores
    const { stores } = await getStores()

    const existingStores =
      Array.isArray(stores) && stores.map(store => store.id)
    console.log(`[createMailchimp] Existing stores: `, existingStores)

    if (existingStores.includes(process.env.MAILCHIMP_WOOCOMMERCE_STORE)) {
      const foundStore = stores.find(
        store => store.id === process.env.MAILCHIMP_WOOCOMMERCE_STORE
      )
      console.log(
        `[createMailchimp] Found store: ${foundStore.name} at ${foundStore.domain} `
      )

      // 2. If store exists, get a list of existing products from the store
      const { products } = await getAllStoreProducts()

      const existingProductsArray = products.map(product => product.id)
      console.log(
        `[createMailchimp] existing products in store: `,
        existingProductsArray
      )

      const files = getAllPageData()
      const productPages = await getProductPageQueries(files)

      if (productPages.length > 0) {
        productPages.forEach(async ({ wpProductPage, usd: { product } }) => {
          const meta = {
            title:
              wpProductPage.template.__typename === "WpDefaultTemplate" &&
              wpProductPage.template.ACF.meta.title
                ? wpProductPage.template.ACF.meta.title
                : wpProductPage.template.__typename ===
                    "WpTemplate_2021Default" &&
                  wpProductPage.template.ACF2021.meta.title
                ? wpProductPage.template.ACF2021.meta.title
                : wpProductPage.title,
            description:
              wpProductPage.template.__typename === "WpDefaultTemplate" &&
              wpProductPage.template.ACF.meta.description
                ? wpProductPage.template.ACF.meta.description
                : wpProductPage.template.__typename ===
                    "WpTemplate_2021Default" &&
                  wpProductPage.template.ACF2021.meta.description
                ? wpProductPage.template.ACF2021.meta.description
                : "",
            slug: wpProductPage.slug,
            url: `${site.siteMetadata.canonicalUrl}${wpProductPage.uri}`,
            image_url: `${site.siteMetadata.siteUrl}${wpProductPage.template.ACF2021.related.image.desktop.mediaItemUrl}`,
            additional_image_url: wpProductPage.template.ACF2021.related
              .hasHover
              ? `${site.siteMetadata.siteUrl}${wpProductPage.template.ACF2021.related.hoverImage.image.desktop.mediaItemUrl}`
              : "", // related image hover link
          }

          const productExists = existingProductsArray.includes(
            product.id.toString()
          )

          if (productExists) {
            console.log(
              `[createMailchimp] Product with id ${product.id} exists, updating instead.`
            )
            await updateStoreProduct(meta, product)
            // TODO: Add in a mechanism to clean up (delete) all mailchimp products that do not existin  these queries
          } else {
            console.log(
              `[createMailchimp] Creating product with id ${product.id}`
            )
            await addStoreProduct(meta, product)
          }
        })
      }
    } else {
      console.error(`[createMailchimp] Error - Store not found.`)
    }
  } catch (err) {
    console.log(err)
  }
}
