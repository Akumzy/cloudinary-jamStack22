import Editor from "../components/Editor";
import { PlusIcon, SearchIcon, SendIcon } from "../components/icons/images";
import { UserComponent } from "../components/Navigation";

export default function AppScreen() {
  return (
    <div className="bg-[#FAFAFB] min-h-screen h-full flex ">
      <div className="w-[324px] bg-[#120F13] text-white">
        <div className="w-full h-[60px] px-[27px] flex py-[17px] boxShadow justify-between items-center mb-5 ">
          <span className="font-bold text-[18px] text-[#E0E0E0]">Channels</span>
          <div>
            <PlusIcon />
          </div>
        </div>
        <div className="mx-[27px] mb-9 flex items-center space-x-1 bg-[#3C393F] rounded-lg px-2 ">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-inherit outline-none p-2 text-[#828282] "
          />
        </div>
        <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
          <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
            FD
          </div>
          <span className="font-medium text-[15px] text-[#E0E0E0] uppercase flex-1 ">
            Front-end Developers
          </span>
        </div>
        <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
          <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
            BD
          </div>
          <span className="font-medium text-[15px] text-[#E0E0E0] uppercase flex-1 ">
            back-end Developer
          </span>
        </div>
        <div className="pl-[27px] mb-5 flex items-center cursor-pointer">
          <div className="w-[42px] h-[42px] font-semibold text-[18px] flex items-center justify-center bg-[#252329] text-white rounded-lg mr-3 ">
            R
          </div>
          <span className="font-medium text-[15px] text-[#E0E0E0] uppercase flex-1 ">
            Random
          </span>
        </div>

        <div className="flex items-center w-fit space-x-4 absolute bottom-0 p-[27px]  ">
          <div className="bg-slate-900 rounded-full w-[42px] h-[42px] hidden md:block"></div>
          <p className="font-bold text-[18px] text-[#828282] hidden md:block">
            Ezeugo Obieze
          </p>
          <UserComponent />
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
    </div>
  );
}
