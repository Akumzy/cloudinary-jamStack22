import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { CloseMenuIcon, MenuIcon, PlusIcon, SearchIcon } from "../components/icons/images"
import MobileMenuDrawer from "../components/MobileMenuDrawer"
import { UserComponent } from "../components/Navigation"
import NewChannel from "../components/NewChannel"
import { getAcronyms } from "../utils/utils"
import { Props } from "./user-profile"
import useSWR, { mutate } from "swr"
import { toast } from "react-toastify"
import { listChannelsFetcher } from "../services/channels"
import { useStore } from "../store/appStore"

const updateFn = async (channel: any) => {
  const { data, error } = await listChannelsFetcher()
  if (error) console.error(error)
  return data
}

export default function Channels({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openModalMenu, setOpenModalMenu] = useState(false)
  const socket = useStore((state: any) => state.socket)
  const router = useRouter()
  const { data: channels } = useSWR("listChannels", listChannelsFetcher)

  useEffect(() => {
    if (socket) {
      socket.on("channelCreated", (channel: any) => {
        toast.success("New Channel Created")
        console.log("channelCreated", channel)
        const newchannel = [...(channels || []), channel]
        const options = { optimisticData: newchannel, rollbackOnError: true }
        mutate("listChannels", newchannel, options)
      })
    }
  }, [])

  function closeMenuModal() {
    setOpenModalMenu(false)
    setOpenMenu(false)
  }

  function openMenuModal() {
    setOpenModalMenu(true)
  }

  function openChannelModal() {
    setIsOpen(true)
    setOpenModalMenu(false)
    setOpenMenu(false)
  }
  function closeChannelModal() {
    setIsOpen(false)
  }
  function menuOpen() {
    openMenuModal()
    setOpenMenu(true)
  }
  function menuClose() {
    closeMenuModal()
    setOpenMenu(false)
  }
  function onclickPush(id: string) {
    router.push(`/channels/${id}`)
  }
  return (
    <div className="flex h-full min-h-screen bg-white-offwhite ">
      <div className="w-[324px] bg-[#120F13] text-white hidden md:block ">
        <div className="w-full h-[60px] px-[27px] flex py-[17px] boxShadow justify-between items-center ">
          <span className="font-bold text-[18px] text-white-light">Channels</span>
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
              className="w-full p-2 outline-none bg-inherit text-blue-off-blue "
            />
          </div>
          {channels &&
            channels.map((channel: any) => {
              return (
                <div onClick={() => onclickPush(channel.id)} key={channel.id} className=" hover:bg-purple-off-purple">
                  <div className="pl-[27px] mb-2 flex items-center cursor-pointer">
                    <div className="my-1 w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-purple-light-purple text-white rounded-lg mr-3 uppercase ">
                      {getAcronyms(channel.name)}
                    </div>
                    <span className="flex-1 text-sm font-medium uppercase text-white-light ">{channel.name}</span>
                  </div>
                </div>
              )
            })}
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="hidden w-8 h-8 overflow-hidden rounded-full md:block">
              <img src={user.image} className="block w-full h-full" alt="user image" />
            </div>
            <p className="hidden w-40 text-sm font-bold uppercase truncate text-blue-off-blue md:block text-ellipsis ">
              {user.name}
            </p>
          </div>
          <div className="flex items-center w-8 h-8 px-1 bg-white rounded-full">
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
        <main className="flex flex-col flex-1 ">
          <div className="flex items-center px-4 md:px-0 ">
            <div onClick={menuOpen} className="block cursor-pointer md:hidden">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-[18px] text-white-light ">
              JamStack-Chat Hub
            </div>
            {openMenu ? (
              <div onClick={menuClose} className="block cursor-pointer md:hidden ">
                <CloseMenuIcon />
              </div>
            ) : null}
          </div>
          <div className="px-[27px] py-10 bg-black flex-1 flex items-center justify-center ">
            <div className="text-center">
              <h2 className="mb-5 text-2xl font-bold uppercase">Welcome to JamStack-Chat-Hub</h2>
              <p className="text-lg ">
                Kindly click on any Channel on the Sidebar to Join and Start discussing with like minds!
              </p>
              <p className="my-5 text-xl uppercase">
                <em>Or...</em>
              </p>
              <p className="text-lg">
                Looking to assembly a community of your own, Click on the plus icon above to Create a Channel of your
                own!
              </p>
              <p>
                <strong className="text-lg">All Channels must have descriptive Description...</strong>
              </p>
              <p className="text-4xl animate-pulse my-11">Salut...!</p>
            </div>
          </div>
        </main>
      </div>
      <NewChannel onClose={closeChannelModal} isOpen={isOpen} />
    </div>
  )
}

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx)
  if (session && session.user) {
    return {
      props: {
        user: session.user,
      },
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  }
}
