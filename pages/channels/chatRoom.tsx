import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Editor from "../../components/Editor";
import {
  CloseMenuIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
} from "../../components/icons/images";
import MobileMenuDrawer from "../../components/MobileMenuDrawer";
import { UserComponent } from "../../components/Navigation";
import NewChannel from "../../components/NewChannel";
import { listChannels } from "../../services/channels";
import { getAcronyms } from "../../utils/utils";
import { Props } from "../user-profile";

export default function AppScreen({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openModalMenu, setOpenModalMenu] = useState(false);
  const [channels, setChannels] = useState([]);

  const loadChannels = async () => {
    const { data, error } = await listChannels();
    if (error) {
      console.error(error);
      return;
    }
    // console.log(data);
    setChannels(data);
  };
  useEffect(() => {
    loadChannels();
  }, [channels]);

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
          {channels.map((channel: any) => {
            return (
              <div key={channel.id}>
                <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
                  <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-purple-light-purple text-white rounded-lg mr-3 uppercase ">
                    {getAcronyms(channel.name)}
                  </div>
                  <span className="font-medium text-sm text-white-light uppercase flex-1 ">
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
        />
      ) : null}

      <div className="bg-purple-light-purple flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex-1 flex flex-col ">
          <div className="flex items-center px-4 md:px-0 ">
            <div onClick={menuOpen} className="cursor-pointer md:hidden block">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-[18px] text-white-light ">
              Welcome to JamStack-Chat Hub
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
          <div className="px-[27px] py-10 bg-black flex-1 ">
            <div>sada</div>
          </div>
        </main>

        <footer className=" bg-[#312933] w-full px-[27px] py-4 min-h-[62px]  ">
          <div className=" bg-purple-off-purple px-[17px] py-2  flex justify-between items-center rounded-lg">
            <Editor />
            <button className="hover:rounded-full hover:bg-white w-8 h-8 justify-center p-2 flex items-center hover:text-green-400 text-white ">
              <SendIcon />
            </button>
          </div>
        </footer>
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
