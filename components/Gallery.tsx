import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { CancelIcon } from "./icons/images";
import ImageRender from "./ImageRender";

type Props = {
  imageObject: imageObject;
  visible: boolean;
  onClose: () => void;
};
export default function Gallery(props: Props) {
  const { imageObject, visible, onClose } = props;
  const MAX_WIDTH = React.useMemo(() => {
    const { innerWidth } = window;
    return Math.round(innerWidth * 0.8);
  }, []);
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="max-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="fixed top-8 right-16 z-40 ">
            <button className="rounded-full " onClick={onClose}>
              <CancelIcon />
            </button>
          </div>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block text-center align-middle transition-all transform shadow-xl ">
              <ImageRender
                imageObject={imageObject}
                MAX_WIDTH={MAX_WIDTH}
                isGallery={true}
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
