import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChannelRoomsDrawer from "../../components/ChannelRoomsDrawer";
import Editor from "../../components/Editor";
import {
  CloseMenuIcon,
  LeftArrowIcon,
  MenuIcon,
  SendIcon,
} from "../../components/icons/images";
import { UserComponent } from "../../components/Navigation";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function ChatRoom() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openModalMenu, setOpenModalMenu] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data: channelDetail, error } = useSWR(`/api/channel/${id}`, fetcher);
  const channelMembers = channelDetail?.members;
  const channelCreator = channelMembers
    ? channelMembers.find(
        (member: any) => member.userId === channelDetail.creatorId
      ).user
    : null;
  const { data, status } = useSession();
  const user = data?.user;
  const isChannelMember = channelMembers?.some(
    (member: any) => member.userId === user?.userId
  );
  function closeMenuModal() {
    setOpenModalMenu(false);
    setOpenMenu(false);
  }

  function openMenuModal() {
    setOpenModalMenu(true);
  }
  function menuOpen() {
    openMenuModal();
    setOpenMenu(true);
  }
  function menuClose() {
    closeMenuModal();
    setOpenMenu(false);
  }

  return (
    <div className="bg-white-offwhite min-h-screen h-full flex ">
      <div className="w-[324px] bg-[#120F13] text-white hidden md:block ">
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
            created by: <span>{channelCreator?.name}</span>
          </p>
        </div>
        <div className="h-[calc(100vh-282px)] mx-[27px] flex flex-col">
          <p className="font-bold text-lg text-white-light uppercase mb-6">
            members
          </p>
          {channelMembers &&
            channelMembers.map((member: any) => {
              return (
                <div key={member.userId} className="flex-1 overflow-y-auto">
                  <div className="flex items-center w-full space-x-4 mb-3">
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
                        `${data?.user ? "bg-green-800" : "bg-red-800"} ` +
                        "rounded-full w-2 h-2"
                      }
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="rounded-full w-8 h-8 overflow-hidden hidden md:block">
              <img
                src={data?.user.image}
                className="w-full h-full block"
                alt="user image"
              />
            </div>
            <p className="font-bold w-40 text-sm text-blue-off-blue hidden md:block uppercase truncate text-ellipsis ">
              {data?.user.name}
            </p>
          </div>
          <div className="flex items-center px-1 bg-white rounded-full h-8 w-8">
            <UserComponent />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu ? (
        <ChannelRoomsDrawer
          isOpenModal={openModalMenu}
          closeModal={closeMenuModal}
          name={data?.user.name}
          image={data?.user.image}
          channelDetail={channelDetail}
          creatorDetails={channelCreator}
          user={data?.user}
        />
      ) : null}

      <div className="bg-purple-light-purple flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex-1 flex flex-col ">
          <div className="flex items-center px-4 md:px-0 ">
            <div onClick={menuOpen} className="cursor-pointer md:hidden block">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-lg text-white-light ">
              {channelDetail && channelDetail.name}
            </div>
            {openMenu ? (
              <div
                onClick={menuClose}
                className="cursor-pointer md:hidden block hover:bg-[#0B090C] rounded-full "
              >
                <CloseMenuIcon />
              </div>
            ) : null}
          </div>
          <div className="px-[27px] py-10 bg-[#0B090C] flex-1 ">
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={data?.user.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {data?.user.name}
                  </span>
                  <span className="font-medium text-sm">
                    yesterday at 1:29PM
                  </span>
                </div>
                <div>
                  <p className="text-base font-medium text-white-light">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Quae, et vero debitis nesciunt officia numquam?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className=" bg-[#312933] w-full px-[27px] py-4 min-h-[62px]  ">
          {!isChannelMember ? (
            <div className="bg-purple-off-purple text-white-light w-full px-[27px] py-4 min-h-[62px]">
              <div className="flex ">
                <p className="text-lg">
                  You are currently not a member of this channel! Click
                  <span className="underline text-blue-700 cursor-pointer font-bold mx-2 ">
                    Join Channel
                  </span>
                  to join.
                </p>
              </div>
            </div>
          ) : (
            <div className=" bg-purple-off-purple px-[17px] py-2 flex justify-between items-center rounded-lg ">
              <Editor />
              <button className="hover:rounded-full hover:bg-white w-8 h-8 justify-center p-2 flex items-center hover:text-green-400 text-white ">
                <SendIcon />
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
