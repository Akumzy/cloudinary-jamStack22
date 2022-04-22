import { getSession } from "next-auth/react";
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
// import MobileMenuDrawer from "../../components/MobileMenuDrawer";
import { UserComponent } from "../../components/Navigation";
import { getChannelById } from "../../services/channels";
import { Props } from "../user-profile";

export default function ChatRoom({ user }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openModalMenu, setOpenModalMenu] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const loadChannelDetails = async () => {
    if (id) {
      const channelDetails = await getChannelById(id as string);
      console.log(channelDetails);
    }
  };
  useEffect(() => {
    loadChannelDetails();
  }, [id]);

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
            front-end Develpers
          </p>
          <p className="text-justify text-base font-normal text-white-light mb-2">
            Pellentesque sagittis elit enim, sit amet ultrices tellus accumsan
            quis.
          </p>
          <p className="text-sm text-blue-off-blue italic font-medium">
            created by: <span>Felistus Obieze</span>
          </p>
        </div>

        <div className="h-[calc(100vh-297px)] mx-[27px] flex flex-col">
          <p className="font-bold text-lg text-white-light uppercase mb-6">
            members
          </p>
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center w-full space-x-6 mb-3">
              <div className="w-10 h-10 border-2 rounded-lg">
                <img
                  src="/vercel.svg"
                  alt="member image"
                  className="w-full h-full"
                />
              </div>
              <div className="w-fit text-blue-off-blue font-bold text-lg">
                <p>Ezeugo Obieze</p>
              </div>
            </div>
            <div className="flex items-center w-full space-x-6 mb-3">
              <div className="w-10 h-10 border-2 rounded-lg">
                <img
                  src="/vercel.svg"
                  alt="member image"
                  className="w-full h-full"
                />
              </div>
              <div className="w-fit text-blue-off-blue font-bold text-lg">
                <p>Ezeugo Obieze</p>
              </div>
            </div>
            <div className="flex items-center w-full space-x-6 mb-3">
              <div className="w-10 h-10 border-2 rounded-lg">
                <img
                  src="/vercel.svg"
                  alt="member image"
                  className="w-full h-full"
                />
              </div>
              <div className="w-fit text-blue-off-blue font-bold text-lg">
                <p>Ezeugo Obieze</p>
              </div>
            </div>
            <div className="flex items-center w-full space-x-6 mb-3">
              <div className="w-10 h-10 border-2 rounded-lg">
                <img
                  src="/vercel.svg"
                  alt="member image"
                  className="w-full h-full"
                />
              </div>
              <div className="w-fit text-blue-off-blue font-bold text-lg">
                <p>Ezeugo Obieze</p>
              </div>
            </div>
            <div className="flex items-center w-full space-x-6 mb-3">
              <div className="w-10 h-10 border-2 rounded-lg">
                <img
                  src="/vercel.svg"
                  alt="member image"
                  className="w-full h-full"
                />
              </div>
              <div className="w-fit text-blue-off-blue font-bold text-lg">
                <p>Ezeugo Obieze</p>
              </div>
            </div>
          </div>
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
        <ChannelRoomsDrawer
          isOpenModal={openModalMenu}
          closeModal={closeMenuModal}
          name={user.name}
          image={user.image}
        />
      ) : null}

      <div className="bg-purple-light-purple flex-1 text-white w-[calc(100vw-324px)] flex flex-col h-screen ">
        <main className="flex-1 flex flex-col ">
          <div className="flex items-center px-4 md:px-0 ">
            <div onClick={menuOpen} className="cursor-pointer md:hidden block">
              <MenuIcon />
            </div>
            <div className="w-full h-[60px] px-[27px] py-[17px] uppercase font-bold text-lg text-white-light ">
              front-end Develpers
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
