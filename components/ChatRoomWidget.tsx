import React, { Component } from "react"
import { CameraIcon } from "./icons/images"

type MyProps = {
  update: ({ imageUrl, height, width }: { imageUrl: string; height: number; width: number }) => void
}

class ChatRoomWidget extends Component<MyProps> {
  componentDidMount() {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "codewithwhyte",
        uploadPreset: "rluyfjmb",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          this.props.update({
            imageUrl: result.info.secure_url,
            height: result.info.height,
            width: result.info.width,
          })
          // console.log("new IMGurl", result.info)
        }
      },
    )
    document.getElementById("upload-icon")?.addEventListener(
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
        id="upload-icon"
        className="flex items-center justify-center w-8 h-8 p-2 text-white hover:rounded-full hover:bg-black hover:text-green-400 "
      >
        <CameraIcon />
      </button>
    )
  }
}

export default ChatRoomWidget
