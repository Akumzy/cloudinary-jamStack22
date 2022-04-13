import { CameraIcon } from "../components/icons/images";
import Navigation from "../components/Navigation";
import Image from "next/image";

export default function EditProfile() {
  return (
    <>
      <div className="px-4 py-2 bg-slate-600 ">
        <Navigation />
      </div>
      <div className="mt-16 border-2 border-[#E0E0E0] w-[850px] mx-auto rounded-xl ">
        <span>
          <p>Change Info</p>
          <p>Changes will be reflected to every services</p>
        </span>
        <div className="flex space-x-4 items-center">
          <div className="relative flex items-center justify-center w-20 h-20 border-2 border-slate-900 rounded-xl">
            <div className="bg-red-900 w-full h-full rounded-xl border-2 border-slate-900">
              <Image
                src={"/vercel.svg"}
                width="100"
                height="100"
                alt="user image"
                // className="relative"
              />
            </div>
            <div className="absolute">
              <CameraIcon />
            </div>
          </div>
          <div>
            <input type="file" hidden />
            <button className="text-sm font-medium">CHANGE PHOTO</button>
          </div>
        </div>
      </div>
    </>
  );
}
