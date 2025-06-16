import React from "react"

import CmsButton from "../../components/Elements/CmsButton"
import { Image } from "../../components/Elements/Image"
import { Video } from "../../components/Elements/Video"
import PreformattedText from "../../components/Elements/PreformattedText"
import Card from "../../components/Elements/Card"
import Divider from "../../components/Elements/Divider"
import Gallery from "../../components/Elements/Gallery"
import MixedGallery from "../../components/Elements/MixedGallery"
import Quotes from "../../components/Elements/Quotes"
import Specification from "../../components/Elements/Specification"
import Text from "../../components/Elements/Text"
import Form from "../../components/Elements/Form"
import Countdown from "../../components/Elements/Countdown"

export const getElements = ({ type, elements = null, small = false }) =>
  elements?.map((row, index) => {
    switch (row.__typename) {
      case `${type}_Elements_Button`:
        return <CmsButton key={index} data={row} />
      case `${type}_Elements_Card`:
        return <Card key={index} data={row} small={small} />
      case `${type}_Elements_Divider`:
        return <Divider key={index} data={row} />
      case `${type}_Elements_Gallery`:
        return <Gallery key={index} data={row} />
      case `${type}_Elements_MixedGallery`:
        return <MixedGallery key={index} data={row} />
      case `${type}_Elements_Image`:
        return (
          <Image
            key={index}
            data={row}
            ignoreArtDirection={
              type.includes("Carousel") ||
              type.includes("CardCarousel") ||
              type.includes("FlexCarousel")
            }
          />
        )
      case `${type}_Elements_PreformattedText`:
        return <PreformattedText key={index} data={row} />
      case `${type}_Elements_Quotes`:
        return <Quotes key={index} data={row} />
      case `${type}_Elements_Specification`:
        return <Specification key={index} data={row} />
      case `${type}_Elements_Text`:
        return <Text key={index} data={row} />
      case `${type}_Elements_Video`:
        return <Video key={index} data={row} />
      case `${type}_Elements_Form`:
        return <Form key={index} data={row} />
      case `${type}_Elements_Countdown`:
        return <Countdown key={index} data={row} />
      default:
        throw new Error(`[Error] Unhandled element type ${row.__typename}`)
    }
  })
