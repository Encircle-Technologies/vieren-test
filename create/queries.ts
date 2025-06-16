export const GET_ALL_PAGES = `
query GET_ALL_PAGES {
  allWpPage {
    edges {
      node {
        id
        databaseId
        uri
        slug
        isFrontPage
        isPostsPage
        status
        title
      }
    }
    totalCount
  }
}
`

export const GET_ALL_POSTS = `
query GET_ALL_POSTS {
  allWpPost {
    edges {
      node {
        id
        databaseId
        uri
        slug
        status
        title
      }
    }
    totalCount
  }
}
`

export const GET_ALL_GIFTS = `
query GET_ALL_GIFTS {
  allWpGift {
    edges {
      node {
        id
        databaseId
        uri
        slug
        status
        title
      }
    }
    totalCount
  }
}
`

export const GET_EXCLUDED_CATEGORIES = `
query GET_EXCLUDED_CATEGORIES($name: [String]) {
  allWpCategory(filter: {name: {in: $name}}) {
    nodes {
      id
      databaseId
      name
    }
  }
}
`

// const GET_POST_CATEGORIES = `
// ${CategoryFragment}
// query GET_POST_CATEGORIES($excludedIds: [String]) {
//   allWpCategory(filter: {id: {nin: $excludedIds}}) {
//     nodes {
//       ...CategoryFields
//     }
//     totalCount
//   }
// }
// `

// const GET_CATEGORY_POSTS = `
// ${ImageFragment}
// ${CategoryFragment}
// query GET_CATEGORY_POSTS($id: String!) {
//   allWpPost(filter: {categories: {nodes: {elemMatch: {id: {eq: $id}}}}}, sort: {fields: date, order: DESC}) {
//     edges {
//       node {
//         id
//         databaseId
//         uri
//         slug
//         status
//         title
//       }
//     }
//     totalCount
//   }
// }

// `

// const GET_ALL_PRODUCTS = `
// ${ImageFragment}
// ${ProductCategoryFragment}
// ${ProductSummaryFragment}
// query GET_ALL_PRODUCTS {
//   allWpProduct(sort: {fields: menuOrder, order: ASC}) {
//     nodes {
//       ...ProductSummaryFields
//       ACF {
//         meta {
//           image {
//             ...ImageFields
//           }
//         }
//       }
//     }
//     totalCount
//   }
// }
// `

export const GetAllProductPagesQuery = `
  query GetAllProductPages {
    allWpProductPage {
      edges {
        node {
          __typename
          id
          databaseId
          uri
          slug
          title
          date
          modified
          ACFProduct {
            linkedProductId
          }
        }
      }
      totalCount
    }
  }
`

export const GetAllCheckoutPages = `
query GetContentNodes {
  allWpContentNode(
    filter: {contentTypeName: {nin: ["attachment", "page", "post", "gift", "product_page", "sitemessage"]}}
  ) {
    edges {
      node {
        __typename
        contentTypeName
        id
        databaseId
        uri
        slug
        date
        modified
      }
    }
  }
}
`
