import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { formatVariablePrice } from "../../utils/price"
import { getProductIdByCurrency } from "../../utils/analytics/gtag"
import { useCurrency } from "../../hooks/useCurrency"

const Head = ({
  pageTitle = "",
  metaTitle = "",
  metaDescription = "",
  metaImage = null,
  metaVideo = null,
  uri,
  product = null,
}) => {
  const {
    site: { siteMetadata: seo },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
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

  const finalPageTitle = pageTitle === "Home" ? null : pageTitle

  const title = `${
    metaTitle ? `${metaTitle}` : finalPageTitle ? `${finalPageTitle}` : ""
  }`

  const description = metaDescription || seo.description
  const image = metaImage ? `${metaImage.mediaItemUrl}` : seo.image
  const video = metaVideo ? `${metaVideo.mediaItemUrl}` : null
  const url = uri ? `${seo.canonicalUrl}${uri}` : seo.canonicalUrl

  // Product
  const isPreOrder =
    product &&
    product?.productStatuses?.nodes?.findIndex(
      status => status.name === "Pre-Order"
    ) !== -1

  const type = product?.__typename
  const price =
    product && type?.endsWith("_SimpleProduct")
      ? product?.price
      : type?.endsWith("_VariableProduct")
      ? formatVariablePrice(product?.price)
      : ""

  const { selected: selectedCurrency } = useCurrency()

  return (
    <Helmet>
      <html lang="en" />
      <link rel="DNS-prefetch" href="//fonts.googleapis.com" />
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      {/* General tags */}
      <title lang="en">{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      {video && <meta property="og:video" content={video} />}
      <meta property="og:type" content="website" />
      {/* change to article for blog posts */}
      <meta name="twitter:card" content="summary" />
      {/* change to embedded player for video series */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:image" content={image} />
      {/* Pinterest claim tag */}
      <meta name="p:domain_verify" content="50e27419adb4e5d0a284f9381a69fdb3" />
      {/* Structured data for Google */}
      {product && (
        <script type="application/ld+json">{`
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "id": "${getProductIdByCurrency(selectedCurrency, product.id)}",
      "name": "${product.name}",
      "image": [
        ${metaImage ? `"${metaImage.mediaItemUrl}"` : ""}
      ],
      "description": "${description}",
      "sku": "${product.sku}",
      "brand": {
        "@type": "Brand",
        "name": "VIEREN"
      },
      "offers": [                                                                                           {
        "@type": "Offer",
        "availability": "${isPreOrder ? "PreOrder" : "InStock"}",
        "price": "${price?.replace("$", "").replace(",", "")}",
        "priceCurrency": "${selectedCurrency}"
      }]
    }`}</script>
      )}
    </Helmet>
  )
}

// Removed this from LD+JSON schema
// "image": [
//   "${seo.canonicalUrl}${
//     product.image.localFile.publicURL
//   }",${product.galleryImages.nodes.map(
//     image => `"${seo.canonicalUrl}${image.localFile.publicURL}"`
//   )}
// ],

export default Head

export const fragment = graphql`
  fragment NewMetaFields on WpTemplate_2021Default_Acf2021 {
    meta {
      title
      description
      image {
        mediaItemUrl
      }
      video {
        mediaItemUrl
        localFile {
          publicURL
        }
      }
    }
  }
`
