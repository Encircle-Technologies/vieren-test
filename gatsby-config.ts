import { GatsbyConfig } from "gatsby"
import * as dotenv from "dotenv"
require("dotenv").config({ path: `.env` })
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
})
const isNetlify = process.env.NETLIFY === 'true'
const config: GatsbyConfig = {
  flags: {
    // DEV_SSR: true,
    PARALLEL_SOURCING: false,
    // DETECT_NODE_MUTATIONS: true,
  },
  siteMetadata: {
    title: `VIEREN`,
    siteUrl: process.env.GATSBY_SITE_URL,
    description: `Limited edition luxury brand Swiss watches to celebrate time, designed by Sunny Fong of Project Runway. Be first on the VIEREN List for an invite to our launch.`,
    canonicalUrl: process.env.GATSBY_SITE_URL,
    image: `${process.env.GATSBY_SITE_URL}/images/logo.png`,
    author: {
      name: `VIEREN`,
    },
    organization: {
      name: `VIEREN`,
      url: `${process.env.GATSBY_SITE_URL}`,
      logo: `${process.env.GATSBY_SITE_URL}/images/logo.png`,
    },
  },
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      /* Include plugin */
      resolve: "gatsby-omni-font-loader",
      options: {
        /* Font loading mode */
        mode: "async",
        /* Enable font loading listener to handle FOUT */
        enableListener: true,
        /* Preconnect URL-s. This example is for Google Fonts */
        preconnect: [
          "https://fonts.gstatic.com",
          "https://fonts.googleapis.com",
        ],
        /* Self-hosted fonts config. Add font files and font CSS files to "static" folder */
        custom: [
          {
            /* Exact name of the font as defied in @font-face CSS rule */
            name: ["vieren-type-regular"],
            /* Path to the font CSS file inside the "static" folder with @font-face definition */
            file: "/fonts/vieren-type-regular.css",
          },
        ],

        /* Web fonts. File link should point to font CSS file. */
        web: [
          {
            /* Exact name of the font as defied in @font-face CSS rule */
            name: "Lato",
            /* URL to the font CSS file with @font-face definition */
            file:
              "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `VIEREN`,
        short_name: `VIEREN`,
        description: `Limited edition luxury brand Swiss watches to celebrate time, designed by Sunny Fong of Project Runway. Be first on the VIEREN List for an invite to our launch.`,
        lang: `en`,
        start_url: `/`,
        icon: `src/images/logos/favicon.png`,
        background_color: `#000`,
        theme_color: `#000`,
        display: `browser`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        // headers: {
        //   "/*": ["Referrer-Policy: strict-origin-when-cross-origin"],
        // },
        generateMatchPathRewrites: true,
      },
    },
    {
  resolve: `gatsby-plugin-gatsby-cloud`,
  options: {
    generateMatchPathRewrites: true
  }
},
    {
      resolve: "gatsby-source-wordpress",
      options: {
        url: "https://vieren-cms-prod.zuratech.ca/graphql",
        auth: {
          htaccess: {
            username: 'crea8ivedev@gmail.com',
            password: 'JustWork@989',
          },
        },
        verbose: true,
        debug: {
          preview: true,
          timeBuildSteps: true,
          graphql: {
            showQueryVarsOnError: true,
            showQueryOnError: true,
            writeQueriesToDisk: true,
          },
        },
        develop: {
          hardCacheData: true,
          hardCacheMediaFiles: true,
        },
        production: {
          hardCacheMediaFiles: true,
          allow404Images: true,
          allow401Images: true,
        },
        schema: {
          timeout: 600000,
          perPage: isNetlify ? 10 : 20,
          requestConcurrency: isNetlify ? 3 : 5,
          previewRequestConcurrency: isNetlify ? 2 : 3,
        },
        type: {
          Category: {
            excludeFieldNames: [
              `ancestors`,
              `children`,
              `contentNodes`,
              `taxonomy`,
              `taxononmyName`,
              `termGroupId`,
              `termTaxonomyId`,
            ],
          },
          CheckoutPage: {
            // excludeFieldNames: [``]
          },
          Comment: {
            exclude: true,
          },
          ContentType: {
            exclude: true,
          },

          Gift: {
            excludeFieldNames: [`terms`],
          },
          GiftStoriesCategory: {
            excludeFieldNames: [`contentNodes`, `gifts`],
          },
          MediaItem: {
            createFileNodes: false,
            excludeFieldNames: [
              `ancestors`,
              "children",
              `commentCount`,
              `commentStatus`,
              `parent`,
              `template`,
            ],
          },
          Menu: {
            exclude: true,
          },
          MenuItem: {
            exclude: true,
          },
          Page: {
            excludeFieldNames: [
              `ancestors`,
              `children`,
              `featuredImage`,
              `featuredImageDatabaseId`,
              `featuredImageId`,
              `parent`,
            ],
          },
          Post: {
            excludeFieldNames: [
              `featuredImage`,
              `featuredImageDatabaseId`,
              `featuredImageId`,
              `terms`,
            ],
          },
          PostFormat: {
            exclude: true,
          },
          ProductPage: {
            excludeFieldNames: [`terms`],
          },
          ProductPageCategory: {
            excludeFieldNames: [
              `contentNodes`,
              `productPages`,
              `taxonomyName`,
              `termGroupId`,
            ],
          },
          SiteMesssage: {
            excludeFieldNames: [`template`],
          },
          Tag: {
            exclude: true,
          },
          Taxonomy: {
            exclude: true,
          },
          User: {
            exclude: true,
          },
          UserRole: {
            exclude: true,
          },
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "USD",
        fieldName: "usd",
        url: `${process.env.GATSBY_STORE_GRAPHQL_URL}?currency=USD`,
        batch: false,
        headers: {
          "Content-Type": "application/json",
        },
        fetchOptions: {
          agent: new (require("https").Agent)({ rejectUnauthorized: false }),
        },
      },
    },
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "CAD",
        fieldName: "cad",
        url: `${process.env.GATSBY_STORE_GRAPHQL_URL}?currency=CAD`,
        batch: false,
        headers: {
          "Content-Type": "application/json",
        },
        fetchOptions: {
          agent: new (require("https").Agent)({ rejectUnauthorized: false }),
        },
      },
    },
    ...(!isNetlify ? [
  {
    resolve: "gatsby-plugin-sharp",
    options: {
      defaults: {},
      failOn: "none",
    },
  },
  "gatsby-transformer-sharp",
  "gatsby-plugin-image",
] : []),
    "gatsby-transformer-sharp",
    "gatsby-plugin-image",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `{
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
          allWpContentNode(
            filter: {nodeType: {in: ["Page", "Post", "ProductPage"]}}
          ) {
            nodes {
              uri
              modifiedGmt
            }
          }
        }
        `,
        excludes: [
          `/thanks/`,
          `/success/`,
          `/checkout/`,
          `/checkout/success/`,
          `/checkout/print/`,
          `/test-page/`,
          `/icelebrateny/welcome/`,
        ],
        resolveSiteUrl: ({ site }) => site.siteMetadata.siteUrl,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allWpContentNode: { nodes: allWpNodes },
        }) => {
          const wpNodeMap = allWpNodes.reduce((acc, node) => {
            const { uri } = node
            acc[uri] = node

            return acc
          }, {})

          return allPages.map(page => {
            return { ...page, ...wpNodeMap[page.path] }
          })
        },
        serialize: page => ({ url: page.path, lastmod: page.modifiedGmt }),
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: process.env.GTM_ID,
        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },

        // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        // dataLayerName: "YOUR_DATA_LAYER_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        // routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
        //
        // Defaults to false
        enableWebVitalsTracking: true,
        //
        // Defaults to https://www.googletagmanager.com
        selfHostedOrigin: process.env.GTM_ORIGIN,
        //
        // Defaults to gtm.js
        // selfHostedPath: "YOUR_SELF_HOSTED_PATH",
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }],
        sitemap: `${process.env.GATSBY_SITE_URL}/sitemap-index.xml`,
      },
    },
  ],
}

export default config
