const fs = require("fs").promises
const glob = require("glob")
const path = require("path")
const algoliasearch = require("algoliasearch")
const { extractSection } = require("../src/utils/algolia/extractSection")

require("dotenv").config({
  path: `.env.production`,
})

const client = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)

const pageIndex = client.initIndex(process.env.GATSBY_ALGOLIA_PAGES_INDEX)
const postIndex = client.initIndex(process.env.GATSBY_ALGOLIA_POSTS_INDEX)
const productIndex = client.initIndex(process.env.GATSBY_ALGOLIA_PRODUCTS_INDEX)

function getPageData() {
  const files = glob.sync(`./public/page-data/**/page-data.json`)

  return files
}

async function getPageQueries(files) {
  let queries = []

  if (!!files.length) {
    await Promise.all(
      files.map(async file => {
        const contents = await fs.readFile(file)
        const {
          result: { data },
        } = await JSON.parse(contents)

        if (data) {
          queries = [...queries, data]
        }
      })
    )

    return queries
  }

  return null
}

async function createIndexes(site) {
  // 1. Get the page-data.json for each built page
  const files = getPageData()
  // 2. Extract the page query data for each built page
  const queries = await getPageQueries(files)
  // 3. Organize and transform data for indices
  if (!!queries.length) {
    const pages = queries
      .filter(query => query && query.wpPage)
      .reduce((acc, curr) => {
        const finalPageTitle =
          curr.wpPage?.title === "Home" ? null : curr.wpPage?.title

        const isNewTemplate =
          curr.wpPage?.template?.__typename === "WpTemplate_2021Default"

        const meta = isNewTemplate
          ? curr.wpPage?.template?.ACF2021?.meta
          : curr.wpPage?.template?.ACF.meta

        const layouts = isNewTemplate
          ? curr.wpPage?.template?.ACF2021?.layouts
          : curr.wpPage?.template?.ACF?.layouts

        const metadata = {
          id: curr.wpPage?.id,
          title: `${
            meta.title
              ? `${meta.title} | `
              : finalPageTitle
              ? `${finalPageTitle} | `
              : ""
          }${site.siteMetadata.title}`,
          summary: meta.description || site.siteMetadata.description,
          image: meta.image ? meta.image.mediaItemUrl : site.siteMetadata.image,
          video: meta.video ? meta.video.mediaItemUrl : null,
          url: curr.wpPage?.uri,
        }

        const data = extractSection(metadata, layouts)

        if (data && !!data.length) {
          return [...acc, ...data]
        }

        return acc
      }, [])

    const posts = queries
      .filter(query => query && query.wpPost)
      .reduce((acc, curr) => {
        const isNewTemplate =
          curr.wpPost?.template?.__typename === "WpTemplate_2021Default"

        const meta = isNewTemplate
          ? curr.wpPost?.template?.ACF2021?.meta
          : curr.wpPost?.template?.ACF.meta

        const layouts = isNewTemplate
          ? curr.wpPost?.template?.ACF2021?.layouts
          : curr.wpPost?.template?.ACF?.layouts

        const metadata = {
          id: curr.wpPost?.id,
          title: `${
            meta.title
              ? `${meta.title} | `
              : curr.wpPost?.title
              ? `${curr.wpPost?.title} | `
              : ""
          }${site.siteMetadata.title}`,
          summary: meta.description || site.siteMetadata.description,
          image: meta.image ? meta.image.mediaItemUrl : site.siteMetadata.image,
          video: meta.video ? meta.video.mediaItemUrl : null,
          url: curr.wpPost?.uri,
        }

        const data = extractSection(metadata, layouts)

        if (data && !!data.length) {
          return [...acc, ...data]
        }

        return acc
      }, [])

    const products = queries
      .filter(query => query && query.wpProductPage)
      .reduce((acc, curr) => {
        const isNewTemplate =
          curr.wpProductPage?.template?.__typename === "WpTemplate_2021Default"

        const meta = isNewTemplate
          ? curr.wpProductPage?.template?.ACF2021?.meta
          : curr.wpProductPage?.template?.ACF.meta

        if (!meta) {
          return acc;
        }

        const layouts = isNewTemplate
          ? curr.wpProductPage?.template?.ACF2021?.layouts
          : curr.wpProductPage?.template?.ACF?.layouts

        const metadata = {
          id: curr.wpProductPage?.id,
          title: curr.wpProductPage?.title,
          summary: meta.description || site.siteMetadata.description,
          image: meta.image ? meta.image.mediaItemUrl : site.siteMetadata.image,
          video: meta.video ? meta.video.mediaItemUrl : null,
          url: curr.wpProductPage?.uri,
          productId: curr?.wpProduct?.databaseId,
        }

        const data = extractSection(metadata, layouts)

        if (data && !!data.length) {
          return [...acc, ...data]
        }

        return acc
      }, [])

    // 4. Test local writes
    // await fs.writeFile(
    //   path.join(__dirname, `zzTest/pages.json`),
    //   JSON.stringify(pages)
    // )
    // await fs.writeFile(
    //   path.join(__dirname, `zzTest/posts.json`),
    //   JSON.stringify(posts)
    // )
    // await fs.writeFile(
    //   path.join(__dirname, `zzTest/products.json`),
    //   JSON.stringify(products)
    // )

    // 4. Upload data to Algolia indices
    try {
      const pageRes = await pageIndex.partialUpdateObjects(pages, {
        createIfNotExists: true,
      })
      console.log(pageRes)
      const postRes = await postIndex.partialUpdateObjects(posts, {
        createIfNotExists: true,
      })
      console.log(postRes)
      const productRes = await productIndex.partialUpdateObjects(products, {
        createIfNotExists: true,
      })
      console.log(productRes)
    } catch (err) {
      console.log(err)
    }
  }
}

exports.createIndexes = createIndexes
