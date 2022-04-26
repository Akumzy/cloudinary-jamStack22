import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { useStore } from "../store/appStore"
import axios from "axios"
import io from "Socket.IO-client"

let newsocket: any
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [users, setUsers] = useState<any[]>([])
  const setSocket = useStore((state: any) => state.setSocket)
  const socket = useStore((state: any) => state.socket)

  const onUsernameSelection = (username: string): void => {
    if (!socket) return
    socket.auth = { username }
    socket.connect()
  }

  useEffect(() => {
    if (!socket) return

    console.log("socket", socket)
    onUsernameSelection(pageProps.user.email)
    socket?.on("connect", () => {
      console.log("connected")
      const appUsers = [...users]
      const connectedUser = appUsers.map((user) => {
        if (user.self) {
          user.connected = true
        }
        return user
      })
      setUsers([...connectedUser])
      console.log("connected Users", users)
    })

    socket.on("disconnect", () => {
      const appUsers = [...users]
      const disconnectedUser = appUsers.map((user) => {
        if (user.self) {
          user.connected = false
        }
        return user
      })
      setUsers([...disconnectedUser])
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
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
      setUsers(users)
      console.log("users", users)
    })

    socket?.on("user_connected", (user: any) => {
      const appUsers = [...users, user]
      const sortedUsers = appUsers.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
      setUsers([...sortedUsers])
      console.log("user connected", users)
    })
  }, [socket])

  useEffect((): any => {
    if (pageProps.user) {
      if (!socket) {
        axios("/api/socket").then((res) => {
          newsocket = io()
          setSocket(newsocket)
          onUsernameSelection(pageProps.user.email)
        })
      }
    }

    return () => {
      socket?.off("connect_error")
      socket?.disconnect()
    }
  }, [pageProps.user])

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
