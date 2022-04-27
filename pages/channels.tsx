import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import {
  CloseMenuIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
} from "../components/icons/images";
import MobileMenuDrawer from "../components/MobileMenuDrawer";
import { UserComponent } from "../components/Navigation";
import NewChannel from "../components/NewChannel";
import { getAcronyms } from "../utils/utils";
import { Props } from "./user-profile";
import useSWR from "swr";
import { listChannelsFetcher } from "../services/channels";

export default function Channels({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openModalMenu, setOpenModalMenu] = useState(false);
  const [channels, setChannels] = useState([]);
  const router = useRouter();
  const { data: listChannels } = useSWR("listChannels", listChannelsFetcher);
  const [users, setUsers] = useState<any[]>([]);
  const { data, status } = useSession();

  // useEffect((): any => {
  //   if (status === "authenticated") {
  //     console.log("user", data)
  //     socketInitializer(data.user.userId)

  //     socket?.on("users", (users: any[]) => {
  //       users.forEach((user) => {
  //         user.self = user.userID === socket.id
  //         console.log("user socket", user)
  //       })
  //       // put the current user first, and then sort by username
  //       users = users.sort((a, b) => {
  //         if (a.self) return -1
  //         if (b.self) return 1
  //         if (a.username < b.username) return -1
  //         return a.username > b.username ? 1 : 0
  //       })
  //       setUsers(users)
  //       console.log("users", users)
  //     })

  //     socket?.on("user connected", (user: any) => {
  //       // this.users.push(user)
  //       const appUsers = [...users, user]
  //       const sortedUsers = appUsers.sort((a, b) => {
  //         if (a.self) return -1
  //         if (b.self) return 1
  //         if (a.username < b.username) return -1
  //         return a.username > b.username ? 1 : 0
  //       })
  //       setUsers([...sortedUsers])
  //       console.log("user connected", user)
  //     })
  //   }
  //   if (socket) {
  //     console.log("socket", socket)
  //   }
  //   return () => {
  //     socket?.off("connect_error")
  //     socket?.disconnect()
  //   }
  // }, [data, socket])
  // const initialState = useStore(
  //   (store: { initialState: any }) => ({
  //     initialState: store.initialState,
  //   }),
  //   shallow
  // );
  // console.log("initial: ", initialState);

  useEffect(() => {
    if (listChannels) {
      setChannels(listChannels);
    }
  }, [listChannels]);

  function closeMenuModal() {
    setOpenModalMenu(false);
    setOpenMenu(false);
  }

  function openMenuModal() {
    setOpenModalMenu(true);
  }

  function openChannelModal() {
    setIsOpen(true);
    setOpenModalMenu(false);
    setOpenMenu(false);
  }
  function closeChannelModal() {
    setIsOpen(false);
  }
  function menuOpen() {
    openMenuModal();
    setOpenMenu(true);
  }
  function menuClose() {
    closeMenuModal();
    setOpenMenu(false);
  }
  function onclickPush(id: string) {
    router.push(`/channels/${id}`);
  }
  return (
    <div className="bg-white-offwhite min-h-screen h-full flex ">
      <div className="w-[324px] bg-[#120F13] text-white hidden md:block ">
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
          {channels &&
            channels.map((channel: any) => {
              return (
                <div
                  onClick={() => onclickPush(channel.id)}
                  key={channel.id}
                  className=" hover:bg-purple-off-purple "
                >
                  <div className="pl-[27px] mb-2 flex items-center cursor-pointer">
                    <div className="my-1 w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-purple-light-purple text-white rounded-lg mr-3 uppercase ">
                      {getAcronyms(channel.name)}
                    </div>
                    <span className="font-medium text-sm text-white-light uppercase flex-1  ">
                      {channel.name}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="rounded-full w-8 h-8 overflow-hidden hidden md:block">
              <img
                src={user.image}
                className="w-full h-full block"
                alt="user image"
              />
            </div>
            <p className="font-bold w-40 text-sm text-blue-off-blue hidden md:block uppercase truncate text-ellipsis ">
              {user.name}
            </p>
          </div>
          <div className="flex items-center px-1 bg-white rounded-full h-8 w-8">
            <UserComponent />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {openMenu ? (
        <MobileMenuDrawer
          isOpenModal={openModalMenu}
          closeModal={closeMenuModal}
          openChannelModal={openChannelModal}
          name={user.name}
          image={user.image}
          channels={channels}
          onclickPush={onclickPush}
        />
      ) : null}

      <div className="bg-purple-light-purple flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex-1 flex flex-col ">
          <div className="flex items-center px-4 md:px-0 ">
            <div onClick={menuOpen} className="cursor-pointer md:hidden block">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-[18px] text-white-light ">
              JamStack-Chat Hub
            </div>
            {openMenu ? (
              <div
                onClick={menuClose}
                className="cursor-pointer md:hidden block "
              >
                <CloseMenuIcon />
              </div>
            ) : null}
          </div>
          <div className="px-[27px] py-10 bg-black flex-1 flex items-center ">
            <div className="text-center">
              <h2 className="font-bold text-2xl uppercase mb-5">
                Welcome to JamStack-Chat-Hub
              </h2>
              <p className="text-lg ">
                Kindly click on any Channel on the Sidebar to Join and Start
                discussing with like minds!
              </p>
              <p className="text-xl uppercase my-5">
                <em>Or...</em>
              </p>
              <p className="text-lg">
                Looking to assembly a community of your own, Click on the plus
                icon above to Create a Channel of your own!
              </p>
              <p>
                <strong className="text-lg">
                  All Channels must have descriptive Description...
                </strong>
              </p>
              <p className="animate-pulse text-4xl my-11">Salut...!</p>
            </div>
          </div>
        </main>
      </div>
      <NewChannel onClose={closeChannelModal} isOpen={isOpen} />
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
