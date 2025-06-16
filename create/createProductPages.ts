import { Actions, Reporter } from "gatsby"
import path from "path"
import { GetAllProductPagesQuery } from "./queries"
import { redirectList } from "../data/redirects"

const productPageTemplate = path.resolve("src/templates/productPage.js")

type CreateProductPagesProps = {
  actions: Actions
  graphql: any
  reporter: Reporter
}

const createWpProductPages = async ({
  actions,
  graphql,
  reporter,
}: CreateProductPagesProps) => {
  const { createPage, createRedirect } = actions

  const fetchProductPages = async (variables?: any) => {
    const {
      data: {
        allWpProductPage: { edges: productPages, totalCount },
      },
    } = await graphql(GetAllProductPagesQuery, variables)

    return { productPages, totalCount }
  }

  // RUN STUFF HERE

  const { productPages, totalCount } = await fetchProductPages()

  if (productPages) {
    //@ts-ignore
    productPages.map(({ node }) => {
      const isRedirected = redirectList.some(r => r.fromPath === node.uri)
      if (isRedirected) {
        reporter.info(`Skipping product page creation for redirected path: ${node.uri}`)
        return
      }

      createPage({
        path: node.uri,
        matchPath: `${node.uri}*`, // client only routing for members-only
        component: productPageTemplate,
        ownerNodeId: node.id,
        context: {
          id: node.id,
          productId:
            node.ACFProduct && node.ACFProduct.linkedProductId
              ? node.ACFProduct.linkedProductId
              : null,
        },
      })

      reporter.info(`Product page created at ${node.uri}`)
    })

    reporter.info(`# -----> PRODUCT PAGES TOTAL: ${totalCount}`)
  }

  // Redirects for existing pages
  createRedirect({
    fromPath: "/product/black-diamond/",
    toPath: "/watches/black-diamond/",
    isPermanent: true,
  })
  createRedirect({
    fromPath: "/product/white-diamond/",
    toPath: "/watches/white-diamond/",
    isPermanent: true,
  })
  createRedirect({
    fromPath: "/product/matte-black/",
    toPath: "/watches/matte-black/",
    isPermanent: true,
  })
  createRedirect({
    fromPath: "/product/matte-white/",
    toPath: "/watches/matte-white/",
    isPermanent: true,
  })
}

export default createWpProductPages
