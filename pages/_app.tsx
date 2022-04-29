import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useStore } from "../store/appStore"
import axios from "axios"

import io from "socket.io-client"

let newsocket: any
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [users, setUsers] = useState<any[]>([])
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
    })

    socket?.on("users", (users: any[]) => {
      console.log("socket on users")
      users.forEach((user) => {
        user.self = user.userID === socket.id
        console.log("user socket", user)
      })
      // put the current user first, and then sort by username
      users = users.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.userID < b.userID) return -1
        return a.userID > b.userID ? 1 : 0
      })
      setUsers(users)
      console.log("users", users)
    })

    socket?.on("user_connected", (user: any) => {
      console.log("user connected")
      console.log(user.user)
    })
  }, [socket])

  useEffect((): any => {
    if (pageProps.user) {
      if (!socket) {
        axios.get("/api/socket")
        newsocket = io(`${location.origin}/api/socket`).connect()
        setSocket(newsocket)
      }
    }

    return () => {
      socket?.off("connect_error")
      // socket?.disconnect()
    }
  }, [pageProps.user])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
