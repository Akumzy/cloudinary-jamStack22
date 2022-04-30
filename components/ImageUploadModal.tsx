import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { AdvancedImage } from "@cloudinary/react"
import Editor from "./Editor"
import { getPublicId } from "../utils/utils"
import { limitFit } from "@cloudinary/url-gen/actions/resize"
import { Cloudinary } from "@cloudinary/url-gen"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  imgUrl: string
  handleUpload: (content: string) => void
}
export default function ImageUploadModal({ onClose, isOpen, imgUrl, handleUpload }: ModalProps) {
  const [editorContent, setEditorContent] = useState("")

  const cld = new Cloudinary({
    cloud: {
      cloudName: "codewithwhyte",
    },
    url: {
      secure: true,
    },
  })

  useEffect(() => {
    setEditorContent("")
  }, [imgUrl])
  const imagePublicId = getPublicId(imgUrl)
  const myImage = cld.image(imagePublicId)
  myImage.resize(limitFit().width(320))

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
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
            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                <Dialog.Title as="h3" className="leading-6 text-[18px] font-bold text-[#F2F2F2] uppercase text-center">
                  Upload Image
                </Dialog.Title>
                <div className="w-full h-[300px] my-4 text-center relative  ">
                  <div className="flex justify-center w-full h-full ">
                    <AdvancedImage cldImg={myImage} />
                  </div>
                </div>
                <div className="w-full px-2 py-2 mb-4 rounded-lg bg-white-cream">
                  <input
                    type={"text"}
                    value={editorContent}
                    onChange={({ target }) => setEditorContent(target.value)}
                    placeholder="write a comment..."
                    className="w-full text-black bg-transparent outline-none "
                  />
                </div>
                <div onClick={() => handleUpload(editorContent)} className="mx-auto w-fit">
                  <button className="px-4 py-1 font-medium capitalize bg-green-800 rounded-lg text-white-cream">
                    upload
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
