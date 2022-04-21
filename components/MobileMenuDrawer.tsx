import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getAcronyms } from "../utils/utils";
import { PlusIcon, SearchIcon } from "./icons/images";
import { UserComponent } from "./Navigation";

interface Props {
  isOpenModal: boolean;
  closeModal: () => void;
  name: string;
  image: string;
  openChannelModal: () => void;
  channels: Array<any>;
}
export default function MobileMenuDrawer({
  isOpenModal,
  closeModal,
  openChannelModal,
  name,
  image,
  channels,
}: Props) {
  return (
    <>
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto  "
          onClose={closeModal}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="-translate-x-full"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="translate-x-full"
              leaveFrom="opacity-60"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 " />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="-translate-x-full"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="translate-x-full"
              leaveFrom="opacity-60 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="w-5/6 h-screen overflow-hidden align-middle transition-all transform shadow-xl">
                <div className="w-full bg-[#120F13] text-white ">
                  <div className="w-full h-[60px] px-[27px] flex py-[17px] boxShadow justify-between items-center ">
                    <span className="font-bold text-[18px] text-white-light">
                      Channels
                    </span>
                    <div onClick={openChannelModal} className="cursor-pointer">
                      <PlusIcon />
                    </div>
                  </div>
                  <div className="h-[calc(100vh-120px)] py-5">
                    <div className="mx-[27px] mb-9 flex items-center space-x-1 bg-purple-off-purple rounded-lg px-2 ">
                      <SearchIcon />
                      <input
                        type="search"
                        placeholder="Search"
                        className="w-full bg-inherit outline-none p-2 text-blue-off-blue "
                      />
                    </div>
                    {channels.map((channel: any) => (
                      <div key={channel.id}>
                        <div className="pl-[27px] mb-5 flex items-center cursor-pointer uppercase">
                          <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-purple-light-purple text-white rounded-lg mr-3 ">
                            {getAcronyms(channel.name)}
                          </div>
                          <span className="font-medium text-sm text-white-light uppercase ">
                            {channel.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center  w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
                    <div className="flex items-center justify-end flex-1 mr-2 truncate text-ellipsis  ">
                      <p className="font-bold w-full text-sm text-right text-blue-off-blue uppercase ">
                        {name}
                      </p>
                    </div>
                    <div className="flex items-center rounded-full h-6 w-6">
                      <UserComponent image={image} />
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
