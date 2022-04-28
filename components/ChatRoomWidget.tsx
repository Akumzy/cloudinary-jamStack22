import React, { Component } from "react";
import { CameraIcon } from "./icons/images";

type MyProps = {
  update: ({
    imageUrl,
    height,
    width,
  }: {
    imageUrl: string;
    height: number;
    width: number;
  }) => void;
};

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
          });
          console.log("new IMGurl", result.info);
        }
      }
    );
    document.getElementById("upload-icon")?.addEventListener(
      "click",
      function () {
        console.log("Eze");
        myWidget.open();
      },
      false
    );
  }

  render() {
    return (
      <button
        id="upload-icon"
        className="w-full h-full flex items-center justify-center"
      >
        <CameraIcon />
      </button>
    );
  }
}

export default ChatRoomWidget;
