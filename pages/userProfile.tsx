import { CameraIcon, LeftArrowIcon } from "../components/icons/images";
import Navigation from "../components/Navigation";
import Image from "next/image";

export default function EditProfile() {
  return (
    <>
      <div className="px-4 py-2 bg-[#FAFAFB] ">
        <Navigation />
      </div>
      <section className="pt-6 px-4 bg-[#FAFAFB] ">
        <div className="text-center mb-11">
          <p className="text-black text-4xl mb-2">Personal Info</p>
          <p className="text-[18px] text-black ">
            Basic info, like your name and photo
          </p>
        </div>
        <div className="mb-24 border-2 border-[#E0E0E0] md:w-[700px] mx-auto rounded-xl">
          <div className="px-[50px] py-7 flex items-center justify-between border-b-[1px] border-b-[#D3D3D3] ">
            <div>
              <p className="font-normal text-2xl mb-1">Profile</p>
              <p className="text-[#828282] text-[13px] leading-[3.5px] font-medium mb-7 ">
                Some info maybe visible to other people
              </p>
            </div>
            <div className="border-[1px] border-[#828282] w-[95px] rounded-xl ">
              <button className="w-full p-2 text-[#828282] font-medium text-base ">
                Edit
              </button>
            </div>
          </div>
          <div className="px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px] ">
              Photo
            </span>
            <div className="w-[72px] h-[72px] rounded-lg ">
              <Image
                src={"/vercel.svg"}
                width="100"
                height="100"
                alt="user image"
              />
            </div>
          </div>

          <div className="px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">
              Name
            </span>
            <div className="font-medium text-[#333333] text-[18px] ">
              <p className="">Ezeugo Obieze </p>
            </div>
          </div>

          <div className="px-[50px] py-6 flex items-center space-x-40 border-b-[1px] border-b-[#D3D3D3] ">
            <div className="text-[#BDBDBD] uppercase text-[13px] font-medium  w-[43px]  ">
              Bio
            </div>
            <div className="font-medium text-[#333333] text-base flex-1  ">
              <p className=" ">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos
                vitae neque, dolore illum expedita consectetur nemo
                exercitationem quidem dolorum ipsam, maiores maxime hic. Beatae!
              </p>
            </div>
          </div>

          <div className="px-[50px] py-6 flex items-center space-x-40  ">
            <span className="text-[#BDBDBD] uppercase text-[13px] font-medium w-[43px]  ">
              Email
            </span>
            <div className="font-medium text-[#333333] text-[18px] ">
              <p className="">ezeugoobieze@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
