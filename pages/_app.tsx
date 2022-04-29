import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"
import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { useStore } from "../store/appStore"

import SocketIOClient from "socket.io-client"

let newsocket: any
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const setSocket = useStore((state: any) => state.setSocket)
  const socket = useStore((state: any) => state.socket)

  useEffect(() => {
    if (!socket) return

    console.log("socket", socket)
    socket?.on("connect", () => {
      console.log("connected")
      socket?.emit("set_active", { user: pageProps.user }, (error: any, data: any) => {
        if (error) {
          console.error("unable to join", error)
        } else {
          console.log("joined", data)
        }
      })
    })

    socket.on("disconnect", () => {
      console.log("disconnected")
    })

    socket?.on("connect_error", (err: any) => {
      console.error("connect_error", err)
      console.log("socket error")
    })

    socket?.on("user_connected", (user: any) => {
      console.log("user connected")
    })
  }, [socket])

  useEffect((): any => {
    if (pageProps.user) {
      if (!socket) {

        const socket = SocketIOClient(location.origin, {
          path: "/api/socket",
        }).connect()
        setSocket(socket)

      }
    }

    return () => {
      socket?.off("connect_error")
      socket?.disconnect()
    }
  }, [pageProps.user, socket])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  )
}
