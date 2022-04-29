import Navigation from "../components/Navigation"
import Script from "next/script"
import { getSession } from "next-auth/react"
import { useState } from "react"
import { updateUserProfile } from "../services/profile"
import CloudinaryUploadWidget from "../components/CloudinaryWidget"

export interface Props {
  user: User
}

export default function EditProfile({ user }: Props) {
  const [editInfo, setEditInfo] = useState(false)
  const [userPhoto, setUserPhoto] = useState(user.image)
  const [userBio, setUserBio] = useState(user.bio)

  function editUserDetails() {
    setEditInfo(true)
    if (editInfo) {
      setEditInfo(false)
    }
  }
  function changeBioInfo(event: any) {
    setUserBio(event.target.value)
  }

  async function handleProfileUpdate() {
    if (!userBio) return
    const { data, error } = await updateUserProfile(userBio)
    if (data) {
      setUserPhoto(data.image)
      setUserBio(data.bio)
    }
    setEditInfo(false)
  }

  function handleButtonToggle() {
    if (editInfo) {
      handleProfileUpdate()
    } else {
      editUserDetails()
    }
  }

  return (
    <div className="h-full min-h-screen bg-white-offwhite">
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />
      <div className="px-4 py-2 ">
        <Navigation name={user.name} image={userPhoto} />
      </div>
      <section className="pt-12 md:px-4 md:pb-24 ">
        <div className="mb-6 text-center md:mb-11">
          <p className="mb-2 text-4xl text-black">Personal Info</p>
          <p className="text-[18px] text-black ">Basic info, like your name and photo</p>
        </div>
        <div className="md:border-2 md:border-white-light md:w-[700px] md:mx-auto md:rounded-xl">
          <div className="px-[22px] md:px-[50px] py-7 flex items-center justify-between border-b-[1px] border-b-white-cream ">
            <div>
              <p className="mb-1 text-2xl font-normal">Profile</p>
              <p className="text-[#828282] w-[180px] md:w-auto text-[13px] leading-4 font-medium mb-7 ">
                Some info maybe visible to other people
              </p>
            </div>
            <div onClick={handleButtonToggle} className="border-[1px] border-[#828282] w-[95px] rounded-xl ">
              <button className="w-full p-2 text-[#828282] font-medium text-base ">{editInfo ? "Save" : "Edit"}</button>
            </div>
          </div>
          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px] ">Photo</span>
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-lg overflow-hidden border-2 relative">
              <img className="block w-full h-full" src={userPhoto} alt="user image" />
              <div className="absolute bg-transparent cursor-pointer">
                {editInfo ? <CloudinaryUploadWidget update={setUserPhoto} /> : null}
              </div>
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] cursor-not-allowed  ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">Name</span>
            <div className="font-medium text-[#333333] text-[18px] ">
              <p className="">{user.name}</p>
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center md:space-x-40 space-x-16 border-b-[1px] border-b-[#D3D3D3] ">
            <div className="text-[#BDBDBD] uppercase text-[13px] font-medium  w-[43px]  ">Bio</div>
            <div className="flex-1 ">
              {editInfo ? (
                <textarea
                  name="bioData"
                  id="bioData"
                  cols={30}
                  rows={3}
                  placeholder="Tell us about yourself eg. I'm a developer"
                  className="w-full p-4 border-2 outline-none"
                  value={userBio}
                  onChange={changeBioInfo}
                ></textarea>
              ) : (
                <p className="font-medium text-[#333333] text-base cursor-not-allowed ">{userBio}</p>
              )}
            </div>
          </div>

          <div className="px-[22px] md:px-[50px] py-6 flex items-center md:space-x-40 space-x-16 border-b-[1px] border-b-[#D3D3D3] md:border-b-0 cursor-not-allowed   ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">Email</span>
            <div>
              <p className="font-medium text-[#333333] text-[18px] cursor-not-allowed ">{user.email}</p>
            </div>
          </div>
        </div>
      </section>
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
