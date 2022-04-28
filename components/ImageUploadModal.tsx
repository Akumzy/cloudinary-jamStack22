import { Dialog, Transition } from "@headlessui/react";
import Script from "next/script";
import { Fragment, useState } from "react";
import ChatRoomWidget from "./ChatRoomWidget";
import { AdvancedImage } from "@cloudinary/react";
import Editor from "./Editor";
import { getPublicId } from "../utils/utils";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadPhoto: {
    imageUrl: string;
    height: number;
    width: number;
  };
  setUploadPhoto: (uploadPhoto: any) => void;
}
export default function ImageUploadModal({
  onClose,
  isOpen,
  uploadPhoto,
  setUploadPhoto,
}: ModalProps) {
  const [editorContent, setEditorContent] = useState("");
  // const [uploadPhoto, setUploadPhoto] = useState({
  //   imageUrl: "",
  //   height: 0,
  //   width: 0,
  // });
  const cld = new Cloudinary({
    cloud: {
      cloudName: "codewithwhyte",
    },
    url: {
      secure: true,
    },
  });
  const imagePublicId = getPublicId(uploadPhoto.imageUrl);
  const myImage = cld.image(imagePublicId);
  myImage.resize(fill().width(400).height(300));

  // function sendImageDetails() {
  //   const imageDetails = {
  //     imageUrl: uploadPhoto.imageUrl,
  //     height: uploadPhoto.height,
  //     width: uploadPhoto.width,

  //   }
  // }

  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full h-auto max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#120F13] shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="leading-6 text-[18px] font-bold text-[#F2F2F2] uppercase text-center"
                >
                  Upload Image
                </Dialog.Title>
                <div className="w-full h-[300px] my-4 text-center relative  ">
                  {uploadPhoto.imageUrl ? (
                    <div className="w-full h-full ">
                      <AdvancedImage cldImg={myImage} />
                    </div>
                  ) : (
                    <ChatRoomWidget update={setUploadPhoto} />
                  )}
                </div>
                <div className="rounded-lg w-full mb-4 px-2 py-2 bg-white-cream">
                  {/* <Editor setEditorContent={setEditorContent} /> */}
                </div>
                <div className="w-fit mx-auto">
                  <button className=" bg-green-800 px-4 py-1 rounded-lg text-white-cream font-medium capitalize">
                    upload
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
