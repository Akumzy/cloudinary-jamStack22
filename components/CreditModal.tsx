import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}
export default function CreditModal({ onClose, isOpen }: ModalProps) {
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
              <div className="inline-block w-full  h-auto max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#120F13] shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="leading-6 text-[18px] font-bold text-[#F2F2F2] uppercase text-center">
                  Credits
                </Dialog.Title>
                <div className="w-full h-[100px] my-4 text-center relative  ">
                  <div className="flex justify-center w-full h-full text-lg font-extrabold text-white ">
                    <p>
                      This UI is heavily insipired by{" "}
                      <a className="text-red-300 " target={"_blank"} rel="noreferrer" href="https://devchallenges.io/">
                        Dev challenges
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
