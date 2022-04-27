import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { LeftArrowIcon } from "./icons/images";
import { UserComponent } from "./Navigation";

interface Props {
  isOpenModal: boolean;
  closeModal: () => void;
  name: any;
  image: any;
  channelDetail: any;
  creatorDetails: any;
  user: any;
}
export default function ChannelRoomsDrawer({
  isOpenModal,
  closeModal,
  name,
  image,
  channelDetail,
  creatorDetails,
  user,
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
                  <div className="w-full h-[60px] px-[27px] py-[17px] boxShadow ">
                    <Link href="/channels">
                      <div className="flex items-center font-bold text-lg text-white-light cursor-pointer w-fit">
                        <LeftArrowIcon />
                        All Channels
                      </div>
                    </Link>
                  </div>
                  <div className="mt-[25px] mx-[27px] mb-4 h-[120px] ">
                    <p className="w-fit uppercase text-lg font-bold text-white-light mb-2 ">
                      {channelDetail && channelDetail.name}
                    </p>
                    <p className="text-justify text-base font-normal text-white-light mb-2">
                      {channelDetail && channelDetail.description}
                    </p>
                    <p className="text-sm text-blue-off-blue italic font-medium">
                      created by: <span>{creatorDetails?.name}</span>
                    </p>
                  </div>

                  <div className="h-[calc(100vh-282px)] mx-[27px] flex flex-col">
                    <p className="font-bold text-left text-lg text-white-light uppercase mb-6">
                      members
                    </p>
                    <div className="flex-1 overflow-y-auto">
                      {channelDetail &&
                        channelDetail.members.map((member: any) => (
                          <div
                            key={member.userId}
                            className="flex items-center w-full space-x-6 mb-3"
                          >
                            <div className="w-10 h-10 border-2 rounded-lg">
                              <img
                                src={member.user.image}
                                alt={`${member.user.name}'s image`}
                                className="w-full h-full"
                              />
                            </div>
                            <div className="w-fit text-blue-off-blue font-bold text-lg capitalize">
                              <p>{member.user.name}</p>
                            </div>
                            <div
                              className={
                                `${user ? "bg-green-800" : "bg-red-800"} ` +
                                "rounded-full w-2 h-2"
                              }
                            ></div>
                          </div>
                        ))}
                    </div>
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
