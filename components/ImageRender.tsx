import React from "react"
import { getPublicId } from "../utils/utils"
import { AdvancedImage } from "@cloudinary/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { fill, limitFill, limitFit } from "@cloudinary/url-gen/actions/resize"

type Props = {
  imageObject: imageObject
  MAX_WIDTH?: number
  isGallery?: boolean
}
export default function ImageRender(props: Props) {
  const { imageObject, MAX_WIDTH = 320, isGallery } = props
  const { width, height, imageUrl } = imageObject

  const cld = new Cloudinary({
    cloud: {
      cloudName: "codewithwhyte",
    },
    url: {
      secure: true,
    },
  })
  const imageWidth = width > MAX_WIDTH ? MAX_WIDTH : width
  const imageCalcHeight = height > MAX_WIDTH ? MAX_WIDTH : height
  const imageHeight = React.useMemo(
    () => Math.round(isGallery ? imageWidth * (height / width) : imageCalcHeight),
    [width, height],
  )
  const imagePublicId = getPublicId(imageUrl ?? null)
  const myImage = cld.image(imagePublicId)

  return (
    <AdvancedImage
      className="py-2 rounded-xl"
      cldImg={myImage.resize(limitFit().width(imageWidth).height(imageHeight))}
    />
  )
}
