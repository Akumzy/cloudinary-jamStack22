import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { createChannel } from "../services/channels"
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}
export default function NewChannel({ onClose, isOpen }: ModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, description } = formData
    if (!name || !description) return
    setIsLoading(true)
    const { data, error } = await createChannel(formData)
    if (error) {
      setIsLoading(false)
      window.alert("something went wrong creating channel")
      console.error(error)
      return
    }
    setIsLoading(false)
    console.log(data)
    onClose()
  }

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
              <form
                onSubmit={handleFormSubmit}
                className="inline-block w-full h-[360px] max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#120F13] shadow-xl rounded-2xl"
              >
                <Dialog.Title as="h3" className="leading-6 text-[18px] font-bold text-[#F2F2F2] uppercase">
                  New Channel
                </Dialog.Title>
                <div className="w-full my-[26px] ">
                  <input
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    className="w-full font-medium text-white text-[18px] text[#828282] py-3 px-4 bg-[#3C393F] rounded-lg outline-none"
                    placeholder="Channel Name"
                  />
                </div>
                <div className="w-full mb-[21px]">
                  <textarea
                    name="description"
                    cols={30}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full h-[115px] text-white font-medium text-[18px] text[#828282] py-3 px-4 bg-[#3C393F] rounded-lg outline-none"
                    placeholder="Channel Description"
                  ></textarea>
                </div>

                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-[100px] disabled:opacity-50 h-10 inline-flex items-center justify-center px-4 py-2 text-[18px] font-medium text-[#F2F2F2] bg-[#2F80ED] border border-transparent rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
