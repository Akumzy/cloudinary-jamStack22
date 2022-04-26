import create from "zustand"
import io, { Socket } from "Socket.IO-client"
import axios from "axios"

export const useStore = create((set, get: any) => ({
  socket: null,
  channels: [],
  setChannel: (channel: ChatRoom[]) => set((state) => ({ ...state, channel })),
  setSocket: (socket: Socket) => set((state) => ({ ...state, socket })),
}))
// const onUsernameSelection = (username: string): void => {
//   if (!socket) return
//   socket.auth = { username }
//   socket.connect()
// }
//  const socketInitializer = async (username: string): Promise<void> => {
//    await axios("/api/socket")
//    socket = io()
//    setSocket(socket)
//    console.log("state", socketState)
//    setEze("wonderful")

//    onUsernameSelection(username)

//    socket?.onAny((event: any, ...args: any) => {
//      console.log(event, args)
//    })
//    socket?.on("connect", () => {
//      console.log("connected")
//      const appUsers = [...users]
//      const connectedUser = appUsers.map((user) => {
//        if (user.self) {
//          user.connected = true
//        }
//        return user
//      })
//      setUsers([...connectedUser])
//      console.log("connected Users", users)
//    })

//    socket.on("disconnect", () => {
//      const appUsers = [...users]
//      const disconnectedUser = appUsers.map((user) => {
//        if (user.self) {
//          user.connected = false
//        }
//        return user
//      })
//      setUsers([...disconnectedUser])
//    })

//    socket?.on("connect_error", (err: any) => {
//      console.error("connect_error", err)
//    })

//    socket?.on("users", (users: any[]) => {
//      console.log("socket on users")
//      users.forEach((user) => {
//        user.self = user.userID === socket.id
//        console.log("user socket", user)
//      })
//      // put the current user first, and then sort by username
//      users = users.sort((a, b) => {
//        if (a.self) return -1
//        if (b.self) return 1
//        if (a.username < b.username) return -1
//        return a.username > b.username ? 1 : 0
//      })
//      setUsers(users)
//      console.log("users", users)
//    })

//    socket?.on("user_connected", (user: any) => {
//      const appUsers = [...users, user]
//      const sortedUsers = appUsers.sort((a, b) => {
//        if (a.self) return -1
//        if (b.self) return 1
//        if (a.username < b.username) return -1
//        return a.username > b.username ? 1 : 0
//      })
//      setUsers([...sortedUsers])
//      console.log("user connected", users)
//    })

//    socket.on("joined_channel", ({ channelId, message }: { channelId: string; message: string }) => {
//      console.log("joined channel", channelId)
//    })

//    if (socket) {
//      console.log("socket", socket)
//    }
//  }
