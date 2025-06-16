const sanitizeHtml = require("sanitize-html")

function extractContent(prefix, meta, type, content) {
  if (Array.isArray(content) && content?.length > 0) {
    const res = content?.reduce((acc, curr, contentIdx) => {
      const objectID = `${prefix}-${contentIdx}`

      switch (curr.__typename) {
        case `${type}_Elements_Button`: {
          // Extracts the text of the button for indexing
          const content = {
            objectID,
            ...meta,
            text: sanitizeHtml(curr.text.content, {
              allowedTags: [],
              allowedAttributes: {},
            }),
          }

          return [...acc, content]
        }
        case `${type}_Elements_Card`: {
          // Extracts the headline and description of the card for indexing

          const isNewTemplate =
            curr.card?.template?.__typename === "WpTemplate_2021Default"

          const related = isNewTemplate
            ? curr.card?.template?.ACF2021?.related
            : curr.card?.template?.ACF?.related

          const content = [
            {
              objectID,
              ...meta,
              text: sanitizeHtml(related?.headline, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            },
            {
              objectID,
              ...meta,
              text: sanitizeHtml(related?.description, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            },
          ]
          return [...acc, ...content]
        }
        // case `${type}_Elements_Divider`:
        // case `${type}_Elements_Gallery`:
        // case `${type}_Elements_Image`:
        case `${type}_Elements_PreformattedText`: {
          // Extracts the text content for indexing
          const textArray = curr?.content?.split("\n")

          if (textArray?.length > 1) {
            const content = textArray.reduce((textAcc, textCurr, textIdx) => {
              const textContent = {
                objectID: `${objectID}-${textIdx}`,
                ...meta,
                text: sanitizeHtml(textCurr, {
                  allowedTags: [],
                  allowedAttributes: {},
                }),
              }

              return [...textAcc, textContent]
            }, [])
            return content.length > 0 ? [...acc, ...content] : acc
          } else {
            const singleContent = {
              objectID,
              ...meta,
              text: sanitizeHtml(curr.content, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            }

            return [...acc, singleContent]
          }
        }
        case `${type}_Elements_Quotes`: {
          // Extracts the text content from list
          const content = curr.list?.reduce((listAcc, listCurr, listIdx) => {
            const listObjectID = `${objectID}-${listIdx}`
            const listTextContent = {
              objectID: listObjectID,
              ...meta,
              text: sanitizeHtml(listCurr.text, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            }

            return [...listAcc, listTextContent]
          }, [])

          return [...acc, ...content]
        }
        case `${type}_Elements_Specification`: {
          // Extracts the text content from list
          const content = curr.list?.reduce((listAcc, listCurr, listIdx) => {
            const listObjectID = `${objectID}-${listIdx}`
            const listTitleContent = {
              objectID: listObjectID,
              ...meta,
              text: sanitizeHtml(listCurr.title.content, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            }
            const listDescContent = {
              objectID: listObjectID,
              ...meta,
              text: sanitizeHtml(listCurr.description.content, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            }

            return [...listAcc, listTitleContent, listDescContent]
          }, [])

          return [...acc, ...content]
        }
        case `${type}_Elements_Text`: {
          // Extracts the text content for indexing

          const textArray = curr?.content?.split("\n")

          if (textArray?.length > 1) {
            const content = textArray.reduce((textAcc, textCurr, textIdx) => {
              const textContent = {
                objectID: `${objectID}-${textIdx}`,
                ...meta,
                text: sanitizeHtml(textCurr, {
                  allowedTags: [],
                  allowedAttributes: {},
                }),
              }

              return [...textAcc, textContent]
            }, [])
            return content.length > 0 ? [...acc, ...content] : acc
          } else {
            const singleContent = {
              objectID,
              ...meta,
              text: sanitizeHtml(curr.content, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            }

            return [...acc, singleContent]
          }
        }
        // case `${type}_Elements_Video`:
        // case `${type}_Elements_Form`:
        default:
          return acc
      }
    }, [])

    return res
  } else return
}

exports.extractContent = extractContent
