import { CameraIcon, LeftArrowIcon } from "../components/icons/images";
import Navigation from "../components/Navigation";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { Session } from "inspector";

interface Props {
  user: User;
}

export default function EditProfile({ user }: Props) {
  return (
    <div className="bg-[#FAFAFB] min-h-screen h-full">
      <div className="px-4 py-2  ">
        <Navigation name={user.name} image={user.image} />
      </div>
      <section className="pt-12 md:px-4 md:pb-24   ">
        <div className="text-center mb-6 md:mb-11">
          <p className="text-black text-4xl mb-2">Personal Info</p>
          <p className="text-[18px] text-black ">
            Basic info, like your name and photo
          </p>
        </div>
        <div className="md:border-2 md:border-[#E0E0E0] md:w-[700px] md:mx-auto md:rounded-xl">
          <div className="px-[22px] md:px-[50px] py-7 flex items-center justify-between border-b-[1px] border-b-[#D3D3D3] ">
            <div>
              <p className="font-normal text-2xl mb-1">Profile</p>
              <p className="text-[#828282] w-[180px] md:w-auto text-[13px] leading-4 font-medium mb-7 ">
                Some info maybe visible to other people
              </p>
            </div>
            <div className="border-[1px] border-[#828282] w-[95px] rounded-xl ">
              <button className="w-full p-2 text-[#828282] font-medium text-base ">
                Edit
              </button>
            </div>
          </div>
          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px] ">
              Photo
            </span>
            <div className="w-[72px] h-[72px] rounded-lg overflow-hidden">
              <img
                className="w-full h-auto block"
                src={user.image}
                alt="user image"
              />
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">
              Name
            </span>
            <div className="font-medium text-[#333333] text-[18px] ">
              <p className="">{user.name}</p>
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center md:space-x-40 space-x-16 border-b-[1px] border-b-[#D3D3D3] ">
            <div className="text-[#BDBDBD] uppercase text-[13px] font-medium  w-[43px]  ">
              Bio
            </div>
            <div className="flex-1  ">
              <p className="font-medium text-[#333333] text-base ">
                I am a Frontend Website Developer...
              </p>
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center md:space-x-40 space-x-16 border-b-[1px] border-b-[#D3D3D3] md:border-b-0  ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">
              Email
            </span>
            <div>
              <p className="font-medium text-[#333333] text-[18px] ">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>
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
  // return {
  //   props: {
  //     user: { name: "", image: "", email: "" },
  //   },
  // };
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
}
