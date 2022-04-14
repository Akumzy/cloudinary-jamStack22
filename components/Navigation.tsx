import { Menu } from "@headlessui/react"
import Image from "next/image"
import { ArrowDownIcon, GroupUserIcon, LogoIcon, LogoutIcon, UserIcon } from "./icons/images"

const UserComponent = () => {
  return (
    <div>
      <Menu as="div" className={"relative inline-block "}>
        <Menu.Button className={"h-9 w-9 "}>
          <span className="hidden md:block">
            <ArrowDownIcon />
          </span>
          <div className="block md:hidden bg-slate-900 rounded-full p-2 w-8 h-8"></div>
        </Menu.Button>
        <Menu.Items
          style={{ position: "absolute" }}
          className=" right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="px-1 py-1 ">
            <Menu.Item>
              <button className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base">
                <UserIcon />
                <span>My Profile</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base">
                <GroupUserIcon />
                <span>Group Chat</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base">
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  )
}

export default function Navigation({ name, image }: { name: string; image: string }) {
  return (
    <div className="flex justify-between ">
      <div className="flex items-center w-fit space-x-2">
        <span>
          <LogoIcon />
        </span>
        <p className="text-lg font-bold text-[#282051]">Jam-Stack-Chat</p>
      </div>

      <div className="flex items-center w-fit space-x-4 ">
        <div className="overflow-hidden rounded-full w-8 h-8 hidden md:block">
          <img src={image} className="w-full h-auto block" alt="user image" />
        </div>
        <p className="font-bold text-[#282051] hidden md:block">{name}</p>
        <UserComponent />
      </div>
    </div>
  )
}
