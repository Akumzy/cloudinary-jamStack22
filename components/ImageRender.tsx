import React from "react"
import { getPublicId } from "../utils/utils"
import { AdvancedImage } from "@cloudinary/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { limitFit } from "@cloudinary/url-gen/actions/resize"

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
  const imageHeight = React.useMemo(
    () => Math.round(isGallery ? imageWidth * (height / width) : width),
    [width, height],
  )
  const imagePublicId = getPublicId(imageUrl ?? null)
  const myImage = cld.image(imagePublicId)

  return <AdvancedImage cldImg={myImage.resize(limitFit().width(imageWidth).height(imageHeight))} />
}
