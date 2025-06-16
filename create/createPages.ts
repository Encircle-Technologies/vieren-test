import { Actions, Reporter } from "gatsby"
import path from "path"
import { GET_ALL_PAGES } from "./queries"
import { redirectList } from "../data/redirects"

const pageTemplate = path.resolve("src/templates/page.js")

const exemptUrisfromDSG = [
  "/",
  "/stories/",
  "/shop/",
  "/accessories/",
  "/packaging/",
  "/engraving/",
  "/size-guide/",
  "/collection/",
  "/craftsmanship/",
  "/making-of/",
  "/press/",
  "/about/",
  "/shipping/",
  "/returns/",
  "/servicing/",
  "/faq/",
  "/contact/",
]

type CreatePagesProps = {
  actions: Actions
  graphql: any
  reporter: Reporter
}

const createPages = async ({
  actions,
  graphql,
  reporter,
}: CreatePagesProps) => {
  const { createPage, createRedirect } = actions

  const {
    data: {
      allWpPage: { edges: pages, totalCount },
    },
  } = await graphql(GET_ALL_PAGES)

  if (pages) {
    // Create 301 redirects
    redirectList.forEach(listItem => {
      createRedirect(listItem)
      reporter.info(`Page redirect: ${listItem.fromPath} to ${listItem.toPath}`)
    })

    //@ts-ignore
    pages.forEach(({ node }) => {
      const exemptFromDsg = exemptUrisfromDSG.indexOf(node.uri) > -1

      const isRedirected = redirectList.some(r => r.fromPath === node.uri)
      if (isRedirected) {
        reporter.info(`Skipping page creation for redirected path: ${node.uri}`)
        return
      }

      // exempts the creation of `/stories/all` page
      if (node.databaseId !== 42915) {
        createPage({
          path: node.uri,
          component: pageTemplate,
          ownerNodeId: node.id,
          context: {
            id: node.id,
          },
          // defer: !exemptFromDsg,
        })
        reporter.info(
          `Page created: "${node.title}" (${node.status}) at ${node.uri} [Page${
            exemptFromDsg ? "" : " - DSG"
          }]`
        )
      }
    })

    reporter.info(`# -----> PAGES TOTAL: ${totalCount}`)
  }
}

export default createPages
