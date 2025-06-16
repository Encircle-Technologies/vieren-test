import { Actions, Reporter } from "gatsby"
import path from "path"
import { GET_ALL_POSTS, GET_ALL_GIFTS } from "./queries"
import { redirectList } from "../data/redirects"

const postTemplate = path.resolve("src/templates/story.js")
// const archiveTemplate = path.resolve("src/templates/stories.js")

type CreatePostsProps = {
  actions: Actions
  graphql: any
  reporter: Reporter
}

const createPosts = async ({
  actions,
  graphql,
  reporter,
}: CreatePostsProps) => {
  const { createPage } = actions

  const fetchPosts = async (variables?: any) => {
    const {
      data: {
        allWpPost: { edges: posts, totalCount },
      },
    } = await graphql(GET_ALL_POSTS, variables)

    return { posts, totalPosts: totalCount }
  }

  const fetchGifts = async (variables?: any) => {
    const {
      data: {
        allWpGift: { edges: gifts, totalCount },
      },
    } = await graphql(GET_ALL_GIFTS, variables)

    return { gifts, totalGifts: totalCount }
  }

  // RUN STUFF HERE

  const { posts, totalPosts } = await fetchPosts()

  if (posts) {
    //@ts-ignore
    posts.map(({ node }) => {
      const isRedirected = redirectList.some(r => r.fromPath === node.uri)
      if (isRedirected) {
        reporter.info(`Skipping story creation for redirected path: ${node.uri}`)
        return
      }

      createPage({
        path: `${node.uri}`,
        component: postTemplate,
        ownerNodeId: node.id,
        context: {
          id: node.id,
        },
        // defer: true,
      })

      reporter.info(`Story created: ${node.uri} [DSG]`)
    })

    reporter.info(`# -----> STORIES TOTAL: ${totalPosts}`)
  }

  const { gifts, totalGifts } = await fetchGifts()

  if (gifts) {
    //@ts-ignore
    gifts.map(({ node }) => {
      const isRedirected = redirectList.some(r => r.fromPath === node.uri)
      if (isRedirected) {
        reporter.info(`Skipping gift creation for redirected path: ${node.uri}`)
        return
      }

      createPage({
        path: `${node.uri}`,
        component: postTemplate,
        ownerNodeId: node.id,
        context: {
          id: node.id,
        },
        // defer: true,
      })
      reporter.info(`Gift Story created: ${node.uri} [DSG]`)
    })

    reporter.info(`# -----> GIFT STORIES TOTAL: ${totalGifts}`)
  }

  // if (storiesPageId) {
  //   const path = `/stories/all`

  //   createPage({
  //     path,
  //     component: archiveTemplate,
  //   })
  //   reporter.info(`Page created: ${path} with ${totalCount} posts`)
  // }

  // if (allPages) {
  //   allPages.map(page => {
  //     const basePath = `/stories`

  //     const path =
  //       page.pageNumber < 2 ? basePath : `${basePath}/${page.pageNumber}`

  //     createPage({
  //       path,
  //       component: archiveTemplate,
  //       context: {
  //         id: storiesPageId,
  //         posts: page.posts,
  //         currentPage: page.pageNumber,
  //         pages: allPages.reduce((acc, curr) => [...acc, curr.pageNumber], []),
  //         basePath,
  //       },
  //     })
  //     reporter.info(`Page created: ${path} with ${page.posts.length} posts`)
  //   })
  // }
}

export default createPosts
