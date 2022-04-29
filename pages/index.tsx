import { useEffect, useState } from "react"
import { getProviders, getSession, signIn } from "next-auth/react"
import { GoogleIcon, LogoIcon, LogoIconLight, MoonIcon, SunIconBright, SunIconDark } from "../components/icons/images"
import { useRouter } from "next/router"

export default function Login({ providers }: any) {
  const [checked, setChecked] = useState<boolean>(true)
  const [pageTheme, setPageTheme] = useState<string>("dark")
  const [isLoading, setIsLoading] = useState(false)

  function signUserIn(provider: any) {
    setIsLoading(() => !isLoading)
    signIn(provider.id, {
      callbackUrl: "/channels",
    })
  }

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setChecked(true)
      localStorage.setItem("theme", "dark")
    } else {
      setChecked(false)
      setPageTheme("light")
      localStorage.setItem("theme", "light")
    }
  }, [])
  function setTheme() {
    if (pageTheme === "dark") {
      setPageTheme("light")
      localStorage.setItem("theme", "light")
    } else {
      setPageTheme("dark")
      localStorage.setItem("theme", "dark")
    }
  }
  return (
    <div className={`${checked ? "dark" : ""}`}>
      <div className="flex items-center w-full h-screen px-4 dark:bg-gray-800 ">
        <div className="px-[38px] py-[50px] w-full md:w-[380px] h-[400px] mx-auto rounded-3xl dark:bg-gray-800 bg-white border border-[#BDBDBD] ">
          <div className="flex items-center justify-center space-x-2 w-fit mb-7">
            {checked ? <LogoIconLight /> : <LogoIcon />}
            <p className="text-lg font-bold dark:text-white text-[#282051]">Jam-Stack-Chat</p>
          </div>
          <div className="w-[300px]  mb-[35px] dark:text-white">
            <p className="font text-lg font-medium leading-[25px] ">
              Join thousands of Develpers from around the world!
            </p>
          </div>
          {Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              onClick={() => signUserIn(provider)}
              className={
                `${isLoading ? "cursor-not-allowed text-gray-700" : ""} ` +
                "flex justify-center items-center border-2 rounded-3xl px-4 py-1 hover:border-green-200 shadow-xl mx-auto "
              }
            >
              <span className={`${isLoading ? "animate-pulse cursor-not-allowed" : ""}`}>
                <GoogleIcon />
              </span>
              <p className="text-lg font-medium dark:text-white">Sign in with {provider.name}</p>
            </button>
          ))}

          <div className="w-full my-4">
            <span className="flex justify-between w-24 mx-auto">
              {checked ? <SunIconBright /> : <SunIconDark />}
              <div className="mx-auto ">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  name="checkbox"
                  id="checkbox"
                  className="hidden"
                />
                <label htmlFor="checkbox" className="cursor-pointer">
                  <div
                    onClick={setTheme}
                    className={
                      `${!checked ? "bg-gray-800" : "bg-gray-600"} ` +
                      "w-9 h-5 flex items-center rounded-full transition-colors ease-in-out duration-200 "
                    }
                  >
                    <div
                      className={
                        `${!checked ? "translate-x-0 duration-200" : "bg-white translate-x-5 duration-200 "} ` +
                        "w-4 h-4 bg-white rounded-full shadow"
                      }
                    ></div>
                  </div>
                </label>
              </div>
              <MoonIcon />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  const session = await getSession(context)
  if (session && session.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/channels",
      },
    }
  }

  return {
    props: { providers, session },
  }
}

// http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2FuserProfile&error=OAuthCallback
