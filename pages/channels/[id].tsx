import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ChannelRoomsDrawer from "../../components/ChannelRoomsDrawer";
import Editor from "../../components/Editor";
import {
  CloseMenuIcon,
  LeftArrowIcon,
  MenuIcon,
  SendIcon,
  Spinner,
} from "../../components/icons/images";
import { UserComponent } from "../../components/Navigation";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { useStore } from "../../store/appStore";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function ChatRoom({ user }: any) {
  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openModalMenu, setOpenModalMenu] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const socket = useStore((state: any) => state.socket);
  const { data: channelDetail, error } = useSWR(`/api/channel/${id}`, fetcher);
  const channelMembers = useMemo(() => channelDetail?.members, [channelDetail]);
  const channelCreator = useMemo(() => {
    return channelMembers
      ? channelMembers.find(
          (member: any) => member.userId === channelDetail.creatorId
        ).user
      : null;
  }, [channelDetail]);

  const isChannelMember = useMemo(
    () => channelMembers?.some((member: any) => member.userId === user?.userId),
    [channelDetail]
  );
  function closeMenuModal() {
    setOpenModalMenu(false);
    setOpenMenu(false);
  }
  console.log("channelDetail", channelDetail);
  console.log("channelmembers", channelMembers);

  useEffect(() => {
    if (socket) {
      console.log("new socket2", socket.connected);
      socket?.on("new_member", ({ newChannelMember, channelId }: any) => {
        // console.log("channel info", channel)
        if (channelId === channelDetail?.id) {
          console.log("joined channel", newChannelMember);
          const newchannel = {
            ...channelDetail,
            members: [...channelDetail.members, newChannelMember],
          };
          const options = { optimisticData: newchannel, rollbackOnError: true };
          mutate(`/api/channel/${id}`, newchannel, options);
        }
      });
    }
  }, []);

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

  function handleJoinChannel() {
    setIsLoading(true);
    console.log("join channel");
    socket?.emit(
      "join_channel",
      { channelId: id, userId: user?.userId },
      (error: any, channelMember: any) => {
        if (error) {
          console.error("error joining channel", error);
          setIsLoading(false);
        } else {
          console.log("joined channel", channelMember);
          if (channelMember.chatRoomId === channelDetail?.id) {
            const newchannel = {
              ...channelDetail,
              members: [...channelDetail.members, channelMember],
            };
            const options = {
              optimisticData: newchannel,
              rollbackOnError: true,
            };
            mutate(`/api/channel/${id}`, newchannel, options);
            setIsLoading(false);
          }
        }
      }
    );
    console.log("channelDetail", channelDetail);
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
          <div className="flex-1 overflow-y-auto ">
            {channelMembers &&
              channelMembers.map((member: any) => {
                return (
                  <div
                    key={member.userId}
                    className="flex items-center w-full space-x-4 mb-3 "
                  >
                    <div className="w-10 h-10 border-2 rounded-lg overflow-hidden">
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
                );
              })}
          </div>
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="rounded-full w-8 h-8 overflow-hidden hidden md:block">
              <img
                src={user?.image}
                className="w-full h-full block"
                alt={`${user?.name}'s image`}
              />
            </div>
            <p className="font-bold w-40 text-sm text-blue-off-blue hidden md:block uppercase truncate text-ellipsis ">
              {user?.name}
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
          name={user?.name}
          image={user?.image}
          channelDetail={channelDetail}
          creatorDetails={channelCreator}
          user={user}
        />
      ) : null}
      {/* second screen */}
      <div className="bg-purple-light-purple flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex flex-col h-[calc(100vh-78px)] ">
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
          <div className="scroll-bar px-[27px] flex-1 py-10 bg-[#0B090C] overflow-y-auto ">
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            {/* <div className="flex mb-9 space-x-[28px] ">
              <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                <img
                  src={user?.image}
                  className="w-full h-full block"
                  alt="user image"
                />
              </div>
              <div className="flex-1">
                <div className="flex space-x-4 text-blue-off-blue items-center">
                  <span className="capitalize font-bold text-lg ">
                    {user?.name}
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
            </div> */}
          </div>
        </main>

        <footer className=" bg-[#312933] w-full px-[27px] py-4 min-h-[62px]  ">
          {!isChannelMember ? (
            <div className="bg-purple-off-purple text-white-light w-full px-[27px] py-4 min-h-[62px]">
              <div className="text-lg  flex items-center">
                <p> You are currently not a member of this channel! Click</p>
                {isLoading ? (
                  <div className=" w-fit h-fit mx-2">
                    <Spinner />
                  </div>
                ) : (
                  <span
                    onClick={handleJoinChannel}
                    className="underline text-blue-700 cursor-pointer font-bold mx-2 "
                  >
                    Join Channel
                  </span>
                )}
                <p>to join.</p>
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

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  if (session && session.user) {
    return {
      props: {
        user: session.user,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
}
