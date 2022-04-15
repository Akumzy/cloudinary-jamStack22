import { getSession } from "next-auth/react";
import { useState } from "react";
import Editor from "../components/Editor";
import { PlusIcon, SearchIcon, SendIcon } from "../components/icons/images";
import { UserComponent } from "../components/Navigation";
import NewChannel from "../components/NewChannel";
import { Props } from "./user-profile";

export default function AppScreen({ user }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#FAFAFB] min-h-screen h-full flex ">
      <div className="w-[324px] bg-[#120F13] text-white">
        <div className="w-full h-[60px] px-[27px] flex py-[17px] boxShadow justify-between items-center ">
          <span className="font-bold text-[18px] text-[#E0E0E0]">Channels</span>
          <div>
            <PlusIcon />
          </div>
        </div>

        <div className="h-[calc(100vh-120px)] py-5">
          <div className="mx-[27px] mb-9 flex items-center space-x-1 bg-[#3C393F] rounded-lg px-2 ">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-inherit outline-none p-2 text-[#828282] "
            />
          </div>
          <div>
            <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
              <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
                FD
              </div>
              <span className="font-medium text-sm text-[#E0E0E0] uppercase flex-1 ">
                Front-end Developers
              </span>
            </div>
            <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
              <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
                BD
              </div>
              <span className="font-medium text-sm text-[#E0E0E0] uppercase flex-1 ">
                back-end Developer
              </span>
            </div>
            <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
              <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
                R
              </div>
              <span className="font-medium text-sm text-[#E0E0E0] uppercase flex-1 ">
                Random
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full justify-between h-[60px]  px-[27px] py-[17px] bg-[#0B090C]  ">
          <div className="flex items-center space-x-4">
            <div className="rounded-full w-8 h-8 overflow-hidden hidden md:block">
              <img
                src={user.image}
                className="w-full h-auto block"
                alt="user image"
              />
            </div>
            <p className="font-bold w-40 text-sm text-[#828282] hidden md:block uppercase truncate text-ellipsis ">
              {user.name}
            </p>
          </div>
          <div className="flex items-center bg-white rounded-full h-6 w-6">
            <UserComponent />
          </div>
        </div>
      </div>

      <div className="bg-[#252329] flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex-1 flex flex-col ">
          <div className="h-[60px] boxShadow px-[27px] py-[17px] uppercase font-bold text-[18px] text-[#E0E0E0] ">
            Front-end Developers
          </div>
          <div className="px-[27px] py-10 bg-black flex-1 ">
            <div>sada</div>
          </div>
        </main>

        <footer className=" bg-[#312933]  w-full px-[27px] py-4 min-h-[62px]  ">
          <div className=" bg-[#3C393F] px-[17px] py-2  flex justify-between items-center rounded-lg">
            <Editor />
            <button className="hover:rounded-full hover:bg-white w-8 h-8 justify-center p-2 flex items-center hover:text-green-400 text-white ">
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>
      {isOpen ? <NewChannel /> : null}
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
