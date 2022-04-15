import { CameraIcon, LeftArrowIcon } from "../components/icons/images";
import Navigation from "../components/Navigation";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { Session } from "inspector";
import { useRef, useState } from "react";

interface Props {
  user: User;
}

export default function EditProfile({ user }: Props) {
  const [editInfo, setEditInfo] = useState(false);
  const [userPhoto, setUserPhoto] = useState(user.image);
  const [userBio, setUserBio] = useState(
    " I am a Frontend Website Developer..."
  );
  const imageRef = useRef<any>(null);

  function editUserDetails() {
    setEditInfo(true);
    if (editInfo) {
      const details = {
        userBio,
      };
      setEditInfo(false);
    }
  }
  function changeBioInfo(event: any) {
    setUserBio(event.target.value);
  }
  function pickPhoto() {
    imageRef.current.click();
  }
  function handlePhotoUpload(event: any) {
    const uploadedPhoto = event.target.files[0];
    const imgUrl = URL.createObjectURL(uploadedPhoto);
    setUserPhoto(imgUrl);
  }
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
            <div
              onClick={editUserDetails}
              className="border-[1px] border-[#828282] w-[95px] rounded-xl "
            >
              <button className="w-full p-2 text-[#828282] font-medium text-base ">
                {editInfo ? "Save" : "Edit"}
              </button>
            </div>
          </div>
          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px] ">
              Photo
            </span>
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-lg overflow-hidden border-2 relative">
              <img
                className="w-full h-auto block"
                src={userPhoto}
                alt="user image"
              />
              <div className="absolute bg-transparent cursor-pointer">
                {editInfo ? (
                  <div onClick={pickPhoto}>
                    <CameraIcon />
                  </div>
                ) : null}
              </div>
              <input
                ref={imageRef}
                type="file"
                onChange={handlePhotoUpload}
                hidden
              />
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] cursor-not-allowed  ">
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
              {editInfo ? (
                <textarea
                  name="bioData"
                  id="bioData"
                  cols={30}
                  rows={3}
                  className="w-full p-4 outline-none border-2"
                  value={userBio}
                  onChange={changeBioInfo}
                ></textarea>
              ) : (
                <p className="font-medium text-[#333333] text-base cursor-not-allowed ">
                  {userBio}
                </p>
              )}
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center md:space-x-40 space-x-16 border-b-[1px] border-b-[#D3D3D3] md:border-b-0 cursor-not-allowed   ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">
              Email
            </span>
            <div>
              <p className="font-medium text-[#333333] text-[18px] cursor-not-allowed ">
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
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
}
