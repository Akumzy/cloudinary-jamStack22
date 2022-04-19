import { Menu } from "@headlessui/react";
import Image from "next/image";
import {
  ArrowDownIcon,
  GroupUserIcon,
  LogoIcon,
  LogoutIcon,
  UserIcon,
} from "./icons/images";
import { useFloating, shift, offset, flip } from "@floating-ui/react-dom";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface imageProp {
  image?: string;
}
export const UserComponent = ({ image }: imageProp) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "top-end",
    middleware: [shift(), offset(8), flip()],
  });

  return (
    <div>
      <Menu as="div" className={"relative inline-block "}>
        <Menu.Button ref={reference} className={"h-9 w-9 "}>
          <span className="hidden md:block">
            <ArrowDownIcon />
          </span>
          <div className="block md:hidden rounded-full overflow-hidden w-8 h-8">
            <img src={image} className="w-full h-auto block" alt="user image" />
          </div>
        </Menu.Button>
        <Menu.Items
          style={{ position: strategy, top: y ?? "", left: x ?? "" }}
          ref={floating}
          className=" w-40 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="px-1 py-1 ">
            <Menu.Item>
              <Link href={"/user-profile"}>
                <button className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base">
                  <UserIcon />
                  <span>My Profile</span>
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link href={"/chat-screen"}>
                <button className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base">
                  <GroupUserIcon />
                  <span>Chat Room</span>
                </button>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
                className="group space-x-2 hover:bg-grey-light hover:bg-gray-400 font-normal text-gray-900 flex rounded-md items-center w-full px-2 py-2 text-base"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default function Navigation({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
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
        <p className="font-bold text-[#282051] hidden md:block uppercase">
          {name}
        </p>
        <UserComponent image={image} />
      </div>
    </div>
  );
}
