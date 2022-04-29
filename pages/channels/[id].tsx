import { getSession, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import ChannelRoomsDrawer from "../../components/ChannelRoomsDrawer"
import Editor from "../../components/Editor"
import {
  CloseMenuIcon,
  ImageUploadIcon,
  LeftArrowIcon,
  MenuIcon,
  SendIcon,
  SpinnerIcon,
} from "../../components/icons/images"
import { UserComponent } from "../../components/Navigation"
import axios from "axios"
import useSWR, { useSWRConfig } from "swr"
import { useStore } from "../../store/appStore"
import format from "date-fns/format"
import { formattedTime, getNumberOfDays } from "../../utils/utils"
import ImageUploadModal from "../../components/ImageUploadModal"
import { v4 as uuid } from "uuid"
import ChatRoomWidget from "../../components/ChatRoomWidget"
import Script from "next/script"
import ImageRender from "../../components/ImageRender"
import Gallery from "../../components/Gallery"

const fetcher = (url: string) => axios.get(url).then((res) => res.data)
const messageFetcher = (url: string) => axios.get(url).then((res) => res.data)
const updateChat = (data: any, message: any) =>
  axios.post("/api/messages/create", data).then((res) => [...message, res.data])

interface IncommingMessage {
  id: string
  createdAt: string
  image?: {
    width: number
    height: number
    imageUrl: string
  }
  text?: string
  userId: string
  roomId: string
  isDefault: boolean
}
export default function ChatRoom({ user }: any) {
  const [uploadPhoto, setUploadPhoto] = useState({
    imageUrl: "",
    height: 0,
    width: 0,
  })
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openModalMenu, setOpenModalMenu] = useState(false)
  // const [imageUploadModal, setImageUploadModal] = useState<boolean>(false)
  const { id } = router.query
  const [editorContent, setEditorContent] = useState("")
  const socket = useStore((state: any) => state.socket)
  const { data: channelDetail, error } = useSWR(`/api/channel/${id}`, fetcher)
  const { data: channelMessages, error: messageError } = useSWR(`/api/messages/${id}`, messageFetcher)
  const channelMembers = useMemo(() => channelDetail?.members, [channelDetail])
  const messageRef = useRef<HTMLDivElement>(null)
  const [editor, setEditor] = useState<any>(null)
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false)
  const [modalEditor, setModalEditor] = useState<any>(null)
  const [activeImage, setActiveImage] = useState<imageObject | null>(null)
  const channelCreator = useMemo(() => {
    return channelMembers ? channelMembers.find((member: any) => member.userId === channelDetail.creatorId).user : null
  }, [channelDetail])
  const isChannelMember = useMemo(
    () => channelMembers?.some((member: any) => member.userId === user?.userId),
    [channelDetail],
  )
  function closeMenuModal() {
    setOpenModalMenu(false)
    setOpenMenu(false)
  }

  function scrollToBottom() {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }
  useEffect(() => {
    if (socket) {
      socket?.on("new_member", ({ newChannelMember, channelId }: any) => {
        if (channelId === channelDetail?.id) {
          console.log("joined channel", newChannelMember)
          const newchannel = {
            ...channelDetail,
            members: [...channelDetail.members, newChannelMember],
          }
          const options = { optimisticData: newchannel, rollbackOnError: true }
          mutate(`/api/channel/${id}`, fetcher, options)
        }
      })
      socket.on("new_message", (chatRoomMessage: any) => {
        if (chatRoomMessage.roomId === channelDetail?.id) {
          const newMessages = [...channelMessages, chatRoomMessage]
          const options = {
            optimisticData: newMessages,
            rollbackOnError: true,
          }
          mutate(`/api/messages/${id}`, messageFetcher, options)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (Array.isArray(channelMessages)) {
      scrollToBottom()
    }
  }, [channelMessages])

  function openMenuModal() {
    setOpenModalMenu(true)
  }
  function menuOpen() {
    openMenuModal()
    setOpenMenu(true)
  }
  function menuClose() {
    closeMenuModal()
    setOpenMenu(false)
  }

  function handleJoinChannel() {
    setIsLoading(true)
    console.log("join channel")
    socket?.emit("join_channel", { channelId: id, userId: user?.userId }, (error: any, channelMember: any) => {
      if (error) {
        console.error("error joining channel", error)
        setIsLoading(false)
      } else {
        console.log("joined channel", channelMember)
        if (channelMember.chatRoomId === channelDetail?.id) {
          const newchannel = {
            ...channelDetail,
            members: [...channelDetail.members, channelMember],
          }
          const options = {
            optimisticData: newchannel,
            rollbackOnError: true,
          }
          mutate(`/api/channel/${id}`, newchannel, options)
          setIsLoading(false)
        }
      }
    })
    console.log("channelDetail", channelDetail)
  }

  // console.log("channel messages", channelMessages)

  const getChatMemberInfo = (userId: string): User => {
    return channelMembers?.find((member: any) => member.userId === userId).user
  }

  const handleSendMessage = async () => {
    setIsMessageLoading(true)
    // console.log(modalEditor.getText(), "text")
    const messagetext = modalEditor?.getText() ?? editorContent
    try {
      const postData = {
        channelId: id,
        text: messagetext,
        image: uploadPhoto,
      }
      const message = {
        roomId: id,
        text: messagetext,
        image: uploadPhoto,
        createdAt: new Date().toISOString(),
        isDefault: false,
        id: uuid(),
        userId: user?.userId,
      }
      const newmessage = [...channelMessages, message]
      const options = { optimisticData: newmessage, rollbackOnError: true }
      mutate(`/api/messages/${id}`, updateChat(postData, channelMessages), options)

      modalEditor?.commands?.clearContent(true)
      setUploadPhoto({
        imageUrl: "",
        height: 0,
        width: 0,
      })
      editor.commands.clearContent(true)
    } catch (error) {
      console.error("error sending message", error)
    }
    setIsMessageLoading(false)
  }

  const closeImageUploadModal = () => {
    setUploadPhoto({
      imageUrl: "",
      height: 0,
      width: 0,
    })
  }
  const imageRef = useRef<HTMLImageElement>(null)
  function imageClicked() {
    console.log("this image was clicked", imageRef.current)
  }
  return (
    <div className="flex h-full min-h-screen bg-white-offwhite ">
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />
      <div className="w-[324px] bg-[#120F13] text-white hidden md:block ">
        <div className="w-full h-[60px] px-[27px] py-[17px] boxShadow ">
          <Link href="/channels">
            <div className="flex items-center text-lg font-bold cursor-pointer text-white-light w-fit">
              <LeftArrowIcon />
              All Channels
            </div>
          </Link>
        </div>
        <div className="mt-[25px] mx-[27px] mb-4 h-[120px] ">
          <p className="mb-2 text-lg font-bold uppercase w-fit text-white-light ">
            {channelDetail && channelDetail.name}
          </p>
          <p className="mb-2 font-mono text-base font-normal text-justify text-white-light">
            {channelDetail && channelDetail.description}
          </p>
          <p className="font-mono text-sm italic font-medium text-blue-off-blue">
            created by: <span>{channelCreator?.name}</span>
          </p>
        </div>
        <div className="h-[calc(100vh-282px)] mx-[27px] flex flex-col">
          <p className="mb-6 text-lg font-bold uppercase text-white-light">members</p>
          <div className="flex-1 overflow-y-auto ">
            {channelMembers &&
              channelMembers.map((member: any) => {
                return (
                  <div key={member.userId} className="flex items-center w-full mb-3 space-x-3 ">
                    <div className="w-8 h-8 overflow-hidden border-2 rounded-lg">
                      <img src={member.user.image} alt={`${member.user.name}'s image`} className="w-full h-full" />
                    </div>
                    <div
                      className="text-base font-medium capitalize w-fit text-blue-off-blue "
                      title={`${member.user.name}`}
                    >
                      <p className="w-[200px] truncate text-ellipsis">{member.user.name}</p>
                    </div>
                    {/* <div
                      className={
                        `${user ? "bg-green-800" : "bg-red-800"} ` +
                        "rounded-full w-2 h-2"
                      }
                    ></div> */}
                  </div>
                )
              })}
          </div>
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="hidden w-8 h-8 overflow-hidden rounded-full md:block">
              <img src={user?.image} className="block w-full h-full" alt={`${user?.name}'s image`} />
            </div>
            <p className="hidden w-40 text-sm font-bold uppercase truncate text-blue-off-blue md:block text-ellipsis ">
              {user?.name}
            </p>
          </div>
          <div className="flex items-center w-8 h-8 px-1 bg-white rounded-full">
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
            <div onClick={menuOpen} className="block cursor-pointer md:hidden">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-lg text-white-light ">
              {channelDetail && channelDetail.name}
            </div>
            {openMenu ? (
              <div onClick={menuClose} className="cursor-pointer md:hidden block hover:bg-[#0B090C] rounded-full ">
                <CloseMenuIcon />
              </div>
            ) : null}
          </div>
          <div className="scroll-bar px-[27px] flex-1 py-10 bg-[#0B090C] overflow-y-auto ">
            {channelMembers &&
              Array.isArray(channelMessages) &&
              channelMessages.map((message: IncommingMessage) => {
                const { image, name } = getChatMemberInfo(message.userId)
                return (
                  <div key={message.id} className="flex mb-4 space-x-[16px]  ">
                    <div className="rounded-[7px] w-11 h-11 overflow-hidden hidden md:block">
                      <img src={image} className="block w-full h-full" alt="user image" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-4 text-blue-off-blue ">
                        <span className="text-base font-medium capitalize ">{name}</span>
                        <span className="flex space-x-1 text-xs font-normal">
                          <span>{formattedTime(message.createdAt)}</span>
                          {!getNumberOfDays(message.createdAt) ? (
                            <div className="flex space-x-1">
                              <span>at</span>
                              <span>{format(new Date(message.createdAt), "hh:mm a")}</span>
                            </div>
                          ) : null}
                        </span>
                      </div>
                      <div
                        className={
                          `${message.image?.imageUrl ? "max-w-[330px]" : "max-w-2/3"} ` +
                          "bg-purple-light-purple p-2 rounded-lg"
                        }
                      >
                        <div>
                          {message.image?.imageUrl ? (
                            <a
                              onClick={(ev) => {
                                ev.preventDefault()
                                setActiveImage(message.image as any)
                              }}
                            >
                              <ImageRender imageObject={message.image} />
                            </a>
                          ) : null}
                          <p className="font-mono text-sm font-normal text-white-light">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            <div className="float-left clear-both " ref={messageRef}></div>
          </div>
        </main>

        <footer className=" bg-[#312933] w-full px-[27px] py-4 min-h-[62px]  ">
          {!isChannelMember ? (
            <div className="bg-purple-off-purple text-white-light w-full px-[27px] py-4 min-h-[62px]">
              <div className="flex items-center justify-center text-lg">
                <p className="hidden lg:flex">You are currently not a member of this channel! Click</p>
                {isLoading ? (
                  <div className="mx-2 w-fit h-fit">
                    <SpinnerIcon />
                  </div>
                ) : (
                  <span onClick={handleJoinChannel} className="mx-2 font-bold text-blue-700 underline cursor-pointer ">
                    Join Channel
                  </span>
                )}
                <p className="hidden lg:flex">to join.</p>
              </div>
            </div>
          ) : (
            <div className=" bg-purple-off-purple px-[17px] py-2 flex justify-between items-center rounded-lg ">
              <Editor setTextEditor={setEditor} setEditorContent={setEditorContent} />

              <ChatRoomWidget update={setUploadPhoto} />
              <button
                disabled={!editorContent.trim() || isMessageLoading}
                onClick={handleSendMessage}
                className="flex items-center justify-center w-8 h-8 p-2 text-white hover:rounded-full hover:bg-white hover:text-green-400 "
              >
                {isMessageLoading ? <SpinnerIcon /> : <SendIcon />}
              </button>
            </div>
          )}
        </footer>
        <ImageUploadModal
          setEditor={setModalEditor}
          handleUpload={handleSendMessage}
          imgUrl={uploadPhoto.imageUrl}
          isOpen={uploadPhoto.imageUrl ? true : false}
          onClose={closeImageUploadModal}
        />
      </div>
      {!!activeImage && <Gallery imageObject={activeImage} visible={true} onClose={() => setActiveImage(null)} />}
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
