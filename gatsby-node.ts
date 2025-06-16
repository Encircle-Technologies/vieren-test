import { GatsbyNode } from "gatsby"
import createWpPages from "./create/createPages"
import createWpPosts from "./create/createPosts"
import createWpProductPages from "./create/createProductPages"
import { createIndexes } from "./create/createIndex"
import createProductFeeds from "./create/createProductFeeds"
// import createPriceCache from "./create/createPriceCache"

import util from "util"
import child_process from "child_process"
const exec = util.promisify(child_process.exec)

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        },
      ],
    },
  })
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({
  actions,
}) => {
  actions.createTypes(`
    type Site {
      siteMetadata: SiteMetadata!
    }

    type SiteMetadata {
      title: String!
      siteUrl: String!
      description: String!
      canonicalUrl: String!
      image: String!
      author: Author!
      organization: Organization!
    }

    type Author {
      name: String!
    }

    type Organization {
      name: String!
      url: String!
      logo: String!
    }
  `)
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  // Create All Pages
  await createWpPages({ actions, graphql, reporter })
  // Create All Posts (Stories + Gifts)
  await createWpPosts({ actions, graphql, reporter })
  // Create All Product Pages
  await createWpProductPages({ actions, graphql, reporter })
}

export const onPostBuild: GatsbyNode["onPostBuild"] = async ({
  graphql,
  reporter,
}) => {
  const {
    //@ts-ignore
    data: { site },
  } = await graphql(`
    query GetSiteMetadata {
      site {
        siteMetadata {
          title
          siteUrl
          description
          canonicalUrl
          image
          author {
            name
          }
          organization {
            name
            url
            logo
          }
        }
      }
    }
  `)

  try {
    await createIndexes(site)

    await createProductFeeds(graphql, reporter)
  } catch (e) {
    console.error(e)
  }

  const reportOut = (report: any) => {
    const { stderr, stdout } = report
    if (stderr) reporter.error(stderr)
    if (stdout) reporter.info(stdout)
  }

  reportOut(await exec("cd ./public/functions && yarn install"))

  // await createPriceCache({ reporter })
}
