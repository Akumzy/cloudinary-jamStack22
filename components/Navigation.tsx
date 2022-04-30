import { Menu } from "@headlessui/react"
import { ArrowDownIcon, GroupUserIcon, LogoIcon, LogoutIcon, UserIcon } from "./icons/images"
import { useFloating, shift, offset, flip } from "@floating-ui/react-dom"
import { signOut } from "next-auth/react"
import Link from "next/link"
import CreditModal from "./CreditModal"
import { useState } from "react"

interface imageProp {
  image?: string
}
export const UserComponent = ({ image }: imageProp) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "top-end",
    middleware: [shift(), offset(11), flip()],
  })
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Menu as="div" className={"relative inline-block "}>
        <Menu.Button ref={reference} className={"h-9 w-9 "}>
          <span className="hidden md:block">
            <ArrowDownIcon />
          </span>
          <div className="block w-8 h-8 overflow-hidden rounded-full md:hidden">
            <img src={image} className="block w-full h-full" alt="user image" />
          </div>
        </Menu.Button>
        <Menu.Items
          style={{ position: strategy, top: y ?? "", left: x ?? "" }}
          ref={floating}
          className="w-40 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="px-1 py-1 ">
            <Menu.Item>
              <Link href={"/user-profile"}>
                <button className="flex items-center w-full px-2 py-2 space-x-2 text-base font-normal text-gray-900 rounded-md group hover:bg-grey-light hover:bg-gray-400">
                  <UserIcon />
                  <span>My Profile</span>
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href={"/channels"}>
                <button className="flex items-center w-full px-2 py-2 space-x-2 text-base font-normal text-gray-900 rounded-md group hover:bg-grey-light hover:bg-gray-400">
                  <GroupUserIcon />
                  <span>Channels</span>
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => {
                  setOpen(true)
                }}
                className="flex items-center w-full px-2 py-2 space-x-2 text-base font-normal text-gray-900 rounded-md group hover:bg-grey-light hover:bg-gray-400"
              >
                <GroupUserIcon />
                <span>Credits</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" })
                }}
                className="flex items-center w-full px-2 py-2 space-x-2 text-base font-normal text-gray-900 rounded-md group hover:bg-grey-light hover:bg-gray-400"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
      <CreditModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default function Navigation({ name, image }: { name: string; image: string }) {
  return (
    <div className="flex justify-between ">
      <div className="flex items-center space-x-2 w-fit">
        <span>
          <LogoIcon />
        </span>
        <p className="text-lg font-bold text-[#282051]">Jam-Stack-Chat</p>
      </div>

      <div className="flex items-center space-x-4 w-fit ">
        <div className="hidden w-8 h-8 overflow-hidden rounded-full md:block">
          <img src={image} className="block w-full h-full" alt="user image" />
        </div>
        <p className="font-bold text-[#282051] hidden md:block uppercase">{name}</p>
        <UserComponent image={image} />
      </div>
    </div>
  )
}
