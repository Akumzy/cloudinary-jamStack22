import React, { Component } from "react"
import { toast } from "react-toastify"
import { CameraIcon, VideoUploadIcon } from "./icons/images"

type MyProps = {
  update: ({ videoUrl, height, width }: { videoUrl: string; height: number; width: number }) => void
}

class VideoUploadWidget extends Component<MyProps> {
  componentDidMount() {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "codewithwhyte",
        uploadPreset: "rluyfjmb",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          if (result.info.resource_type === "image") {
            toast.error("Please upload a video")
            return
          }
          this.props.update({
            videoUrl: result.info.secure_url,
            height: result.info.height,
            width: result.info.width,
          })
          console.log("new IMGurl", result.info)
        }
      },
    )
    document.getElementById("video-icon")?.addEventListener(
      "click",
      function () {
        myWidget.open()
      },
      false,
    )
  }

  render() {
    return (
      <button
        id="video-icon"
        className="flex items-center justify-center w-8 h-8 p-2 text-white hover:rounded-full hover:bg-black hover:text-green-400 "
      >
        <VideoUploadIcon />
      </button>
    )
  }
}

export default VideoUploadWidget
