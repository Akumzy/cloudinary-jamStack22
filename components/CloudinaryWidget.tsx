import React, { Component } from "react"
import { CameraIcon } from "./icons/images"
import axios from "axios"

type MyProps = {
  update: (imgUrl: string) => void
}

class CloudinaryUploadWidget extends Component<MyProps> {
  componentDidMount() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "codewithwhyte",
        uploadPreset: "rluyfjmb",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const imgUrl = result.info.secure_url
          console.log("new IMGurl", result.info)
          axios
            .patch("/api/user/updatephoto", {
              image: imgUrl,
            })
            .then((res) => {
              this.props.update(imgUrl)
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
    )
    document.getElementById("upload_widget")?.addEventListener(
      "click",
      function () {
        myWidget.open()
      },
      false,
    )
  }

  render() {
    return (
      <button id="upload_widget">
        <CameraIcon />
      </button>
    )
  }
}

export default CloudinaryUploadWidget
