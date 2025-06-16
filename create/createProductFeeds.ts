import fs from "fs"
// import glob from "glob"
import path from "path"
import { parse } from "json2csv"
import sanitizeHtml from "sanitize-html"
import { GetAllProductPagesQuery } from "./queries"
import { getProductIdByCurrency } from "../src/utils/analytics/gtag"
// import { productPageQuery } from "../src/templates/productPage"

// function getAllPageData() {
//   const files = glob.sync(`./public/page-data/**/page-data.json`)

//   return files
// }

// async function getPageQuery(file: string) {
//   const jsonContents = await fs.promises.readFile(file, { encoding: "utf-8" })

//   if (jsonContents) {
//     const contents = await JSON.parse(jsonContents)

//     return contents.result.data
//   }

//   return null
// }

// async function getProductPageQueries(files: string[]) {
//   let products: any[] = []

//   if (!!files.length) {
//     await Promise.all(
//       files.map(async file => {
//         const data = await getPageQuery(file)

//         if (data) {
//           const keys = Object.keys(data)
//           const isProductPage =
//             keys.findIndex(key => key === "wpProductPage") !== -1

//           if (isProductPage) {
//             products.push(data)
//           }
//         }
//       })
//     )
//   }

//   return products
// }

function processProduct(site: any, product: any, formatPrice: boolean = true, currency: string = 'USD') {
  const { wpProductPage, usd, cad } = product

  const productObj = currency == 'CAD' ? cad : usd; //todo change to switch(...) if more currencies available

  const category = productObj.product.productCategories.nodes[0].name

  const formattedPrice = productObj.product.regularPrice
    .split(" - ")[0] // takes lower price in variable product
    .replace("$", "") // strips dollar sign
    .replace(",", "") // strips comma separators
    .concat(".00") // adds .00 formatting

  const numericPrice = productObj.product.regularPrice
    .split(" - ")[0]
    .replace("$", "")
    .replace(",", "")

  const includesBlackTag = productObj?.product?.productTags?.nodes.filter(
    (tag: any) => tag.name === "Black"
  )
  const includesWhiteTag = productObj?.product?.productTags?.nodes.filter(
    (tag: any) => tag.name === "White"
  )
  const includesGoldTag = productObj?.product?.productTags?.nodes.filter(
    (tag: any) => tag.name === "Gold"
  )

  const isBlackWatch =
    Array.isArray(includesBlackTag) && includesBlackTag.length > 0
  const isWhiteWatch =
    Array.isArray(includesWhiteTag) && includesWhiteTag.length > 0
  const isGoldWatch =
    Array.isArray(includesGoldTag) && includesGoldTag.length > 0

  const additionalImageLinks = wpProductPage.ACFProduct.mGallery.reduce(
    (acc: string, curr: any, idx: number) => {
      if (idx >= 10) {
        return acc
      }

      if (acc.length === 0) {
        return curr.image?.mobile?.mediaItemUrl || acc
      }

      return `${acc}, ${curr.image.mobile.mediaItemUrl}` || acc
    },
    ""
  )

  return {
    id: getProductIdByCurrency(currency, productObj.product.id),
    sku: productObj.product.sku,
    name: sanitizeHtml(productObj.product.name, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    description: sanitizeHtml(productObj.product.description, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    category,
    link: `${site.siteMetadata.siteUrl}${wpProductPage.uri}?defaultCurrency=${currency}`,
    imageLink: `${productObj.product.image.mediaItemUrl}`,
    additionalImageLinks: additionalImageLinks, // up to 10 google, up to 20 facebook
    stockStatus: productObj.product.stockStatus,
    stockQuantity: productObj.product.stockQuantity || `0`,
    price: formatPrice ? `${formattedPrice} ${currency}` : numericPrice,
    google_product_category: category === "Watches" ? "201" : "5122", // 201 watches, 5122 watch accessories
    fb_product_category: category === "Watches" ? "318" : "314", // 318 watches, 314 watch accessories
    product_type:
      category === "Watches"
        ? "Apparel & Accessories > Jewelry > Watches > Automatic Watches > Swiss Made Watches > Luxury Watches > Rectangular Watches > Unisex Watches > Black Watches > Leather Watches > Steel Watches > Diamond Watches > Mens Watches > Womens Watches"
        : null,
    brand: "VIEREN Luxury Watches",
    gender: "unisex",
    age_group: "adult",
    color: isBlackWatch
      ? "Black"
      : isWhiteWatch
      ? "White"
      : isGoldWatch
      ? "Gold"
      : null,
  }
}

export default async function createProductFeeds(graphql: any, reporter: any) {
  const {
    //@ts-ignore
    data: { site, usd: usdAll, cad: cadAll },
  } = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          canonicalUrl
        }
      }
      usd {
        products(first: 100) {
          nodes {
            id
            databaseId
            name
            description
            image {
              mediaItemUrl
            }
            productCategories {
              nodes {
                databaseId
                name
                slug
                parent {
                  node {
                    databaseId
                    name
                    slug
                  }
                }
              }
            }
            productStatuses {
              nodes {
                databaseId
                name
              }
            }
            productTags {
              nodes {
                databaseId
                name
                slug
              }
            }
            ... on USD_SimpleProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
            }
            ... on USD_VariableProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
            }
          }
        }
      }
      cad {
        products(first: 100) {
          nodes {
            id
            databaseId
            name
            description
            image {
              mediaItemUrl
            }
            productCategories {
              nodes {
                databaseId
                name
                slug
                parent {
                  node {
                    databaseId
                    name
                    slug
                  }
                }
              }
            }
            productStatuses {
              nodes {
                databaseId
                name
              }
            }
            productTags {
              nodes {
                databaseId
                name
                slug
              }
            }
            ... on CAD_SimpleProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
            }
            ... on CAD_VariableProduct {
              price
              regularPrice
              salePrice
              stockStatus
              stockQuantity
              manageStock
            }
          }
        }
      }
    }
  `)
  reporter.info(
    `[createProductFeeds] site url is: ${site.siteMetadata.siteUrl}`
  )

  const {
    data: {
      allWpProductPage: { edges: productPages, totalCount },
    },
  } = await graphql(GetAllProductPagesQuery)

  if (productPages) {
    //@ts-ignore
    const productsPromises = productPages.map(async ({ node }) => {
      const { data } = await graphql(
        `
          query GetProductPageSummary($id: String!) {
            wp {
              preorder {
                content {
                  productPages {
                    ... on WpProductPage {
                      id
                    }
                  }
                }
              }
            }
            wpProductPage(id: { eq: $id }) {
              __typename
              id
              databaseId
              uri
              slug
              title
              ACFProduct {
                linkedProductId
                mGallery {
                  kind
                  image {
                    mobile {
                      mediaItemUrl
                    }
                  }
                }
              }
            }
          }
        `,
        {
          id: node.id,
        }
      )

      const usdProduct = usdAll.products.nodes.find(
        product => product.databaseId === node.ACFProduct.linkedProductId
      )

      const cadProduct = cadAll.products.nodes.find(
        product => product.databaseId === node.ACFProduct.linkedProductId
      )
      reporter.info(`[createProductFeeds] Product page created at ${node.uri}`)
      return { ...data, usd: { product: usdProduct }, cad: { product: cadProduct } }
    })

    const products = await Promise.all(productsPromises)

    // const withoutPreorderProducts = products.filter(product => {
    //   const listOfPreOrderProducts = product.wp.preorder.content.productPages?.reduce(
    //     (acc, curr) => [...acc, curr.id],
    //     []
    //   )
    //   console.log(`[DEBUG] list of preorder products: `, listOfPreOrderProducts)

    //   const isPreOrder =
    //     listOfPreOrderProducts?.findIndex(
    //       id => id === product.wpProductPage.id
    //     ) > -1

    //   return isPreOrder === false
    // })

    // console.log(`[DEBUG] withoutPreorderProducts: `, withoutPreorderProducts)

    if (products?.length > 0) {
      const klaviyoProducts = getKlaviyoProducts(site, products)
      const klaviyoProducts_cad = getKlaviyoProducts(site, products, 'CAD')

      const pinterestCsv = parse(getFacebookProducts(site, products))
      const pinterestCsv_cad = parse(getFacebookProducts(site, products, 'CAD'))

      const tsv = parse(getGoogleMerchantProducts(site, products), {
        delimiter: "\t",
      })
      const tsv_cad = parse(getGoogleMerchantProducts(site, products, 'CAD'), {
        delimiter: "\t",
      })

      const fbCsv = parse(getFacebookProducts(site, products))
      const fbCsv_cad = parse(getFacebookProducts(site, products, 'CAD'))

      const feedPath = path.join(__dirname, `../public/product-feed`)

      if (!fs.existsSync(feedPath)) {
        fs.mkdirSync(feedPath)
      }

      const pinterestFeedPath = path.join(feedPath, `/pinterest.csv`)
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${pinterestFeedPath}`
      )
      await fs.promises.writeFile(pinterestFeedPath, pinterestCsv)

      const pinterestFeedCadPath = path.join(feedPath, `/pinterest_cad.csv`)
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${pinterestFeedCadPath}`
      )
      await fs.promises.writeFile(pinterestFeedCadPath, pinterestCsv_cad)

      const googleFeedPath = path.join(feedPath, "google.tsv")
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${googleFeedPath}`
      )
      await fs.promises.writeFile(googleFeedPath, tsv)

      const googleCadFeedPath = path.join(feedPath, "google_cad.tsv")
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${googleCadFeedPath}`
      )
      await fs.promises.writeFile(googleCadFeedPath, tsv_cad)

      const klaviyoFeedPath = path.join(feedPath, `klaviyo.json`)
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${klaviyoFeedPath}`
      )
      await fs.promises.writeFile(
        klaviyoFeedPath,
        JSON.stringify(klaviyoProducts)
      )

      const klaviyoFeedPath_cad = path.join(feedPath, `klaviyo_cad.json`)
      console.log(
        `[DEBUG - createProductFeeds] writing file - ${klaviyoFeedPath_cad}`
      )
      await fs.promises.writeFile(
        klaviyoFeedPath_cad,
        JSON.stringify(klaviyoProducts_cad)
      )

      const fbFeedPath = path.join(feedPath, `/facebook.csv`)
      console.log(`[DEBUG - createProductFeeds] writing file - ${fbFeedPath}`)
      await fs.promises.writeFile(fbFeedPath, fbCsv)

      const fbFeedCadPath = path.join(feedPath, `/facebook_cad.csv`)
      console.log(`[DEBUG - createProductFeeds] writing file - ${fbFeedCadPath}`)
      await fs.promises.writeFile(fbFeedCadPath, fbCsv_cad)
    }
  }

  // const files = getAllPageData()
  // console.log(`[DEBUG - createProductFeeds] files`, files)
  // const products = await getProductPageQueries(files)
  // console.log(`[DEBUG - createProductFeeds] products`, products.length)

  return
}

function getGoogleMerchantProducts(site: any, products: any, currency: string = 'USD') {
  return products.map(data => {
    const product = processProduct(site, data, true, currency)

    return {
      // https://support.google.com/merchants/answer/7052112?hl=en
      // BASIC PRODUCT DATA
      id: product.id, // REQUIRED: Id from real product
      title: product.name, // REQUIRED: Name from real product
      description: product.description, // REQUIRED: Sanitized description from real product
      link: product.link, // REQUIRED: Url for PDP
      image_link: product.imageLink, // REQUIRED: Image from real product
      additional_image_link: product.additionalImageLinks.replaceAll(
        ", ",
        ","
      ),
      mobile_link: null, // OPTIONAL
      // PRICE & AVAILABILITY
      availability:
        product.stockStatus === "IN_STOCK" ? "in_stock" : "out_of_stock", // REQUIRED
      availability_date: null,
      cost_of_goods_sold: null,
      expiration_date: null,
      price: product.price, // REQUIRED takes the lower price of a range
      sale_price: null,
      sale_price_effective_date: null,
      unit_pricing_measure: null,
      unit_pricing_base_measure: null,
      installment: null,
      subscription_cost: null,
      loyalty_points: null,
      // PRODUCT CATEGORY
      google_product_category:
        product.category === "Watches" ? "201" : "5122", // 201 watches, 5122 watch accessories
      product_type:
        product.category === "Watches"
          ? "Apparel & Accessories > Jewelry > Watches > Automatic Watches > Swiss Made Watches > Luxury Watches > Rectangular Watches > Unisex Watches > Black Watches > Leather Watches > Steel Watches > Diamond Watches > Mens Watches > Womens Watches"
          : null,
      // PRODUCT IDENTIFIERS
      brand: product.brand, // REQUIRED
      gtin: null,
      mpn: product.sku,
      identifier_exists: "no",
      // DETAILED PRODUCT DESCRIPTION
      condition: "new", // REQUIRED
      adult: "no", // REQUIRED
      multipack: null,
      is_bundle: null,
      energy_efficiency_class: null,
      min_energy_efficiency_class: null,
      max_energy_efficiency_class: null,
      age_group: "adult",
      color: product.color,
      gender: product.gender,
      material: null,
      pattern: null,
      size: "one_size",
      size_system: null,
      item_group_id: null,
      product_length: null,
      product_width: null,
      product_height: null,
      product_weight: null,
      product_detail: "",
      product_highlight: "",
      // Shopping campaigns and other configurations
      ads_redict: null,
      promotion_id: null,
      lifestyle_image_link: null,
      short_title: null,
      // Marketplaces
      external_seller_id: null,
      // Destinations
      excluded_destination: null,
      included_destination: null,
      shopping_ads_excluded_coutnry: null,
      pause: null,
      // Shipping
      // shipping: "US"
    };
  })
}

function getFacebookProducts(site: any, products: any, currency: string = 'USD') {
  return products.map(data => {

    const product = processProduct(site, data, true, currency)

    return {
      id: product.id, // REQUIRED Id from real product
      title: product.name, // REQUIRED: Name from real product
      description: product.description, // REQUIRED: Sanitized description from real product
      availability:
        product.stockStatus === "IN_STOCK" ? "in stock" : "out of stock",
      condition: "new",
      price: product.price, // REQUIRED takes the lower price of a range
      link: product.link,
      image_link: product.imageLink, // REQUIRED: Image from real product
      additional_image_link: product.additionalImageLinks,
      brand: product.brand,
      quantity_to_sell_on_facebook: product.stockQuantity || `0`,
      google_product_category:
        product.category === "Watches" ? "201" : "5122", // 201 watches, 5122 watch accessories
      fb_product_category: product.category === "Watches" ? "318" : "314", // 318 watches, 314 watch accessories
      size: "One size",
      gender: product.gender,
      age_group: product.age_group,
      color: product.color,
    }
  })
}

function getKlaviyoProducts(site: any, products: any, currency: string = 'USD') {
  return products.map(data => {
    const product = processProduct(site, data, false, currency)

    return {
      id: product.id, // REQUIRED: Id from real product
      title: product.name, // REQUIRED: Name from real product
      description: product.description, // REQUIRED: Sanitized description from real product
      link: product.link, // REQUIRED: Url for PDP
      image_link: product.imageLink, // REQUIRED: Image from real product
      additional_image_link: product.additionalImageLinks,
      availability:
        product.stockStatus === "IN_STOCK" ? "in_stock" : "out_of_stock", // REQUIRED
      price: product.price, // REQUIRED takes the lower price of a range
      google_product_category:
        product.category === "Watches" ? "201" : "5122", // 201 watches, 5122 watch accessories
      product_type:
        product.category === "Watches"
          ? "Apparel & Accessories > Jewelry > Watches > Automatic Watches > Swiss Made Watches > Luxury Watches > Rectangular Watches > Unisex Watches > Black Watches > Leather Watches > Steel Watches > Diamond Watches > Mens Watches > Womens Watches"
          : null,
      brand: product.brand,
      mpn: product.sku,
      condition: "new",
      adult: "no",
      color: product.color,
      gender: product.gender,
    }
  })
}

