const { extractContent } = require("./extractContent")

function extractSection(meta, layouts) {
  const res = layouts?.reduce((acc, curr, idx) => {
    const objectPrefix = `${meta.id}-${idx}`

    switch (curr.__typename) {
      case `WpTemplate_2021Default_Acf2021_Layouts_Accordion`: {
        const data = extractContent(
          objectPrefix,
          meta,
          curr.__typename,
          curr.elements
        )

        return data && data.length > 0 ? [...acc, ...data] : acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_Banner`: {
        const data = extractContent(
          objectPrefix,
          meta,
          curr.__typename,
          curr.elements
        )

        return data && data.length > 0 ? [...acc, ...data] : acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_Carousel`: {
        const data = curr.slides?.reduce((slideAcc, slideCurr, slideIdx) => {
          const slideObjectPrefix = `${objectPrefix}-${slideIdx}`
          const slideData = extractContent(
            slideObjectPrefix,
            meta,
            slideCurr.__typename,
            slideCurr.elements
          )

          return slideData && slideData.length > 0
            ? [...slideAcc, ...slideData]
            : slideAcc
        }, [])

        return data && data.length > 0 ? [...acc, ...data] : acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_CardCarousel`: {
        // Card carousels only return links to other pages,
        // so we shouldn't index their data
        return acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_Columns`: {
        const data = curr.columns?.reduce((colAcc, colCurr, colIdx) => {
          const colObjectPrefix = `${objectPrefix}-${colIdx}`
          const colData = extractContent(
            colObjectPrefix,
            meta,
            `${curr.__typename}_columns`,
            colCurr.elements
          )

          return colData && colData.length > 0
            ? [...colAcc, ...colData]
            : colAcc
        }, [])

        return data && data.length > 0 ? [...acc, ...data] : acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_FiveColumn`: {
        const data = curr.columns?.reduce((colAcc, colCurr, colIdx) => {
          const colObjectPrefix = `${objectPrefix}-${colIdx}`
          const colData = extractContent(
            colObjectPrefix,
            meta,
            `${curr.__typename}_columns`,
            colCurr.elements
          )

          return colData && colData.length > 0
            ? [...colAcc, ...colData]
            : colAcc
        }, [])

        return data && data.length > 0 ? [...acc, ...data] : acc
      }
      case `WpTemplate_2021Default_Acf2021_Layouts_FlexCarousel`: {
        const data = curr.slides?.reduce((slideAcc, slideCurr, slideIdx) => {
          const slideObjectPrefix = `${objectPrefix}-${slideIdx}`
          const slideThumbnailData = extractContent(
            slideObjectPrefix,
            meta,
            slideCurr.thumbnail.__typename,
            slideCurr.thumbnail.elements
          )
          const slideContentData = extractContent(
            slideObjectPrefix,
            meta,
            slideCurr.content.__typename,
            slideCurr.content.elements
          )

          const slideData = [...slideThumbnailData, ...slideContentData]

          return slideData && slideData.length > 0
            ? [...slideAcc, ...slideData]
            : slideAcc
        }, [])

        return data ? [...acc, ...data] : acc
      }
      default:
        return acc
    }
  }, [])

  return res
}

exports.extractSection = extractSection
