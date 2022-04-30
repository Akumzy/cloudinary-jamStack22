import React from "react"
import { getPublicId } from "../utils/utils"
import { AdvancedVideo } from "@cloudinary/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { fill, limitFill, limitFit } from "@cloudinary/url-gen/actions/resize"
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn"
import { Gravity } from "@cloudinary/url-gen/qualifiers"
import { AutoFocus } from "@cloudinary/url-gen/qualifiers/autoFocus"

type Props = {
  videoObject: videoObject
  MAX_WIDTH?: number
  isGallery?: boolean
}
export default function VideoRender(props: Props) {
  const { videoObject, MAX_WIDTH = 320, isGallery } = props
  const { width, height, videoUrl } = videoObject

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
  const imagePublicId = getPublicId(videoUrl ?? null)
  const myVideo = cld.video(imagePublicId)

  return (
    <AdvancedVideo
      cldVid={myVideo.resize(
        fill()
          .width(imageWidth)
          .height(imageHeight)
          .gravity(Gravity.autoGravity().autoFocus(AutoFocus.focusOn(FocusOn.faces()))),
      )}
      controls
    />
  )
}
