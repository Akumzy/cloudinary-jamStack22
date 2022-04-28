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
          console.log("new IMGurl", result.info)
        }
      },
    )
    document.getElementById("upload-icon")?.addEventListener(
      "click",
      function () {
        console.log("Eze")
        myWidget.open()
      },
      false,
    )
  }

  render() {
    return (
      <button
        id="upload-icon"
        onClick={() => {
          console.log("i am clicked")
        }}
        className="hover:rounded-full hover:bg-black w-8 h-8 justify-center p-2 flex items-center hover:text-green-400 text-white "
      >
        <CameraIcon />
      </button>
    )
  }
}

export default ChatRoomWidget
