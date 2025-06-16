import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useInView } from "react-intersection-observer"
import { useProduct, useCachedProductData } from "../../hooks/useProductData"
import { useProductContent } from "../../hooks/useProductContent"
import { getProductIdByCurrency, trackPDPView } from "../../utils/analytics/gtag"
import { Desktop, Mobile } from "../Elements/Responsive"
import { Container, Content, DetailContainer, InfoContainer } from "./Container"
import Gallery from "./Gallery"
import { Collection } from "./Collection"
import { Name } from "./Name"
import { Price } from "./Price"
import Stock from "./Stock"
import Buy from "./Buy"
import FreeShipping from "./FreeShipping"
import Description from "./Description"
import Variations from "./Variations"
import Customize from "./Customize"
import ProductBar from "../Layout/ProductBar"
import SizeChart from "./SizeChart"

function Detail({ theme }) {
  const {
    product,
    type,
    kind,
    colour,
    isCustomizable,
    isPreOrder,
    isSpecialEdition,
    regularVariations,
    // engravedVariations,
  } = useProductContent()
  // STATIC DATA from Gatsby
  const {
    collections,
    productFeatures,
    productStatuses: { nodes: productStatuses },
    name,
    description,
    databaseId,
    // variations,
  } = product

  const {
    state: { selectedVariation, selectedCustomization },
    setVariation,
    setError,
  } = useProduct()

  // STATIC DATA from Store
  const {
    price: cachedPrice,
    stockStatus: cachedStockStatus,
    stockQuantity: cachedStockQuantity,
    currency,
  } = useCachedProductData(
    (type === "variable" && selectedVariation) || databaseId
  )

  const [productBarRoot, setProductBarRoot] = useState()
  const [pdpContentMidRef, showProductBar] = useInView({
    rootMargin: "-50% 0px -50% 0px",
  })
  const [pdpContentTopRef, pdpContentTopInView] = useInView({
    rootMargin: "100% 0px -100% 0px",
  })
  const [footerRef, footerInView] = useInView()

  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setProductBarRoot(document.querySelector("#product-bar"))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const pdpContainerEl =
      typeof window !== "undefined" && document.querySelector("#pdp-container")

    pdpContainerEl && pdpContentMidRef(pdpContainerEl)
  }, [pdpContentMidRef])

  useEffect(() => {
    const pdpContentEl =
      typeof document !== "undefined" &&
      document.querySelector("#pdp-container")

    if (pdpContentEl) {
      pdpContentTopRef(pdpContentEl)
    }
  }, [pdpContentTopRef])

  useEffect(() => {
    const footerEl =
      typeof document !== "undefined" && document.querySelector("#main-footer")

    footerEl && footerRef(footerEl)
  }, [footerRef])

  useEffect(() => {
    trackPDPView({ ...product, uri: window?.location?.pathname }, currency)
  }, [])

  useEffect(() => {
    // For metal watches, default selection to the first regular variant

    if (type === "variable" && kind === "metal" && selectedVariation === 0) {
      const [regularVariant, _rest] = regularVariations
      process.env.NODE_ENV === "development" &&
        console.log(
          `[DEBUG] the regular variant of this metal watch is `,
          regularVariant?.databaseId
        )

      setVariation(regularVariant?.databaseId, "")
    }

    // Resets the selected variation when the detail component is unmounted
    // return () => setVariation(0, "")
  }, [kind, type, selectedVariation, regularVariations, setVariation])

  const mobileFixed = pdpContentTopInView && !footerInView

  process.env.NODE_ENV === "development" &&
    console.log("[rerender] Product Detail Component")

  return (
    <>
      {productBarRoot &&
        createPortal(
          <Desktop>
            {showProductBar && (
              <ProductBar product={product}>
                <Buy
                  type={type}
                  selected={{
                    productId: databaseId,
                    variationId: selectedVariation,
                  }}
                  selectedQty={1}
                  stockStatus={cachedStockStatus}
                  stockQuantity={cachedStockQuantity}
                  extraData={JSON.stringify({ dateAdded: new Date() })}
                >
                  {isPreOrder ? `Pre-Order` : `Add To Bag`}
                </Buy>
              </ProductBar>
            )}
          </Desktop>,
          productBarRoot
        )}
      <DetailContainer>
        <InfoContainer>
          {collections?.nodes?.map(collection => (
            <Collection key={collection.name} theme={theme}>
              {collection.name}
            </Collection>
          ))}
          <Name id={getProductIdByCurrency(currency, product.id)} theme={theme}>{name}</Name>
          <Price theme={theme}>
            {`${cachedPrice || ``}${cachedPrice && ` ${currency}`}`}
            <Stock
              theme={theme}
              special={isSpecialEdition}
              stockStatus={cachedStockStatus}
              stockQuantity={cachedStockQuantity}
            />
          </Price>
          <div
            css={`
              /* min-height: 70px; */
              padding: 25px 0 30px;
            `}
          >
            <Mobile>
              {cachedStockStatus === "OUT_OF_STOCK" ? null : type ===
                  "variable" && kind === "leather" ? (
                <Variations
                  theme={theme}
                  showTitle={true}
                  variations={regularVariations}
                />
              ) : (
                <SizeChart theme={theme} hasCustomizations={false} />
              )}
              {isCustomizable && cachedStockStatus !== "OUT_OF_STOCK" && (
                <Customize theme={theme} flex />
              )}
              <Buy
                main
                theme={theme}
                type={type}
                selected={{
                  productId: databaseId,
                  variationId: selectedVariation,
                }}
                selectedQty={1}
                stockStatus={cachedStockStatus}
                stockQuantity={cachedStockQuantity}
                fixed={mobileFixed}
                extraData={JSON.stringify({ dateAdded: new Date() })}
              >
                {isPreOrder ? `Pre-Order` : `Add To Bag`}
              </Buy>
            </Mobile>
            <Desktop>
              {cachedStockStatus === "OUT_OF_STOCK" ? null : type ===
                  "variable" && kind === "leather" ? (
                <Variations theme={theme} variations={regularVariations} />
              ) : (
                <SizeChart theme={theme} />
              )}
              {isCustomizable && cachedStockStatus !== "OUT_OF_STOCK" && (
                <Customize
                  flex
                  theme={theme}
                  product={product}
                  selectedVariation={selectedVariation}
                />
              )}
              <Buy
                main
                theme={theme}
                type={type}
                selected={{
                  productId: databaseId,
                  variationId: selectedVariation,
                }}
                selectedQty={1}
                stockStatus={cachedStockStatus}
                stockQuantity={cachedStockQuantity}
                extraData={JSON.stringify({ dateAdded: new Date() })}
              >
                {isPreOrder ? `Pre-Order` : `Add To Bag`}
              </Buy>
            </Desktop>
            <FreeShipping theme={theme} />
            <Description
              theme={theme}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </InfoContainer>
      </DetailContainer>
    </>
  )
}

export default function ProductDetail({ productFields }) {
  // OLD: gallery, NEW: mediaGallery
  const { gallery, mGallery: mediaGallery, theme } = productFields

  return (
    <>
      <Container theme={theme}>
        <Content>
          <Gallery gallery={gallery} mediaGallery={mediaGallery} />
          <Detail theme={theme} />
        </Content>
      </Container>
    </>
  )
}
