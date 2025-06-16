const {
  GET_EXCLUDED_CATEGORIES,
  GET_POST_CATEGORIES,
  GET_CATEGORY_POSTS,
} = require("./queries")

const archiveTemplate = require.resolve("../src/templates/stories.js")

module.exports = async ({ actions, graphql, reporter }, storiesPageId) => {
  const { createPage } = actions

  const getExcludedIds = async variables => {
    const {
      data: {
        allWpCategory: { nodes: categories },
      },
    } = await graphql(GET_EXCLUDED_CATEGORIES, variables)

    return categories.reduce((acc, curr) => [...acc, curr.id], [])
  }

  const fetchCategories = async variables => {
    const {
      data: {
        allWpCategory: { nodes: categories, totalCount },
      },
    } = await graphql(GET_POST_CATEGORIES, variables)

    return { categories, totalCount }
  }

  const fetchPostSummaries = async variables => {
    const {
      data: {
        allWpPost: { edges: posts, totalCount },
      },
    } = await graphql(GET_CATEGORY_POSTS, variables)

    return { posts, totalCount }
  }

  const getCategoryPosts = async categories => {
    const promiseArray = categories.map(async category => {
      // reporter.info(
      //   `Starting to fetch posts for category ${category.name} (ID: ${category.databaseId})`
      // )

      const { posts } = await fetchPostSummaries({
        id: category.id,
      })

      return {
        name: category.name,
        path: category.uri,
        // parent: category.wpParent.node,
        posts,
      }
    })

    const postsByCategory = await Promise.all(promiseArray)

    return postsByCategory
  }

  // RUN STUFF HERE

  // Step 1: get an array of databaseIds for excluded categories
  const excludedIds = await getExcludedIds({
    name: ["Uncategorized", "Making of VIEREN", "Brand"],
  })
  reporter.info(`Excluding the following categories: ${excludedIds}`)

  // Step 2: kick off the function to get a list of all categories
  // reporter.info(`fetch batch ${pageNumber} of categories...`)
  const { categories, totalCount: totalCategories } = await fetchCategories({
    excludedIds,
  })
  reporter.info(`# -----> CATEGORIES TOTAL: ${totalCategories}`)
  pageNumber = 1

  // Step 3: kick off function to get all products (paginated) by category
  if (categories) {
    const postsByCategory = await getCategoryPosts(categories)

    if (postsByCategory) {
      postsByCategory.map(category => {
        const { name, path, posts } = category

        createPage({
          path,
          component: archiveTemplate,
          context: {
            id: storiesPageId,
            posts,
            currentPage: 1,
          },
        })

        reporter.info(
          `Category Page "${name}" created at ${path} with ${posts.length} posts`
        )
      })
    }
  }
}
