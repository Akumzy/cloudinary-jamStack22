import { CameraIcon, LeftArrowIcon } from "../components/icons/images";
import Navigation from "../components/Navigation";
import Image from "next/image";

export default function EditProfile() {
  return (
    <>
      <div className="px-4 py-2 bg-[#FAFAFB] ">
        <Navigation />
      </div>
      <section className="pt-10 px-4 bg-[#FAFAFB]">
        <div className="mb-6 flex items-center cursor-pointer md:w-[700px] mx-auto">
          <LeftArrowIcon />
          <span className="text-[#2D9CDB] font-normal text-[18px] ">Back</span>
        </div>
        <div className="mb-24 border-2 border-[#E0E0E0] md:w-[700px] mx-auto rounded-xl py-8 px-12 ">
          <span>
            <p className="font-normal text-2xl mb-1">Change Info</p>
            <p className="text-[#828282] text-[13px] leading-[3.5px] font-medium mb-7 ">
              Changes will be reflected to every services
            </p>
          </span>
          <div className="flex space-x-8 items-center mb-8">
            <div className="relative flex items-center justify-center w-20 h-20 border-2 border-slate-900 rounded-xl">
              <div className="w-full h-full rounded-xl ">
                <Image
                  src={"/vercel.svg"}
                  width="100"
                  height="100"
                  alt="user image"
                />
              </div>
              <div className="absolute bg-transparent">
                <CameraIcon />
              </div>
            </div>
            <div>
              <input type="file" hidden />
              <button className="text-sm font-medium">CHANGE PHOTO</button>
            </div>
          </div>
          <div>
            <form action="">
              <label htmlFor="fullName">
                <p className="text-sm font-medium mb-1">Name</p>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Enter your name"
                  className="font-medium text-[13px] border-[1px] border-[#828282] rounded-xl outline-none md:w-[417px] px-4 py-2 mb-5 "
                />
              </label>
              <label htmlFor="bio">
                <p className="text-sm font-medium mb-1">Bio</p>
                <textarea
                  name="bio"
                  id="bio"
                  cols={30}
                  rows={3}
                  placeholder="Enter your bio"
                  className="font-medium text-[13px] border-[1px] border-[#828282] rounded-xl outline-none md:w-[417px] px-4 py-2 mb-5 "
                ></textarea>
              </label>
              <label htmlFor="email">
                <p className="text-sm font-medium mb-1">Email</p>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="font-medium text-[13px] border-[1px] border-[#828282] rounded-xl outline-none md:w-[417px] px-4 py-2 "
                />
              </label>
              <div className="w-[82px] mt-6">
                <button className="bg-[#2F80ED] p-2 w-full rounded-lg ">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
