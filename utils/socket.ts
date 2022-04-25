import io from "Socket.IO-client"
import axios from "axios"

let socket: any

export const socketInitializer = async (username: string): Promise<void> => {
  await axios("/api/socket")
  socket = io()

  onUsernameSelection(username)

  socket?.onAny((event: any, ...args: any) => {
    console.log(event, args)
  })
  socket?.on("connect", () => {
    console.log("connected")
  })

  socket.on("connect_error", (err: any) => {
    console.error("connect_error", err)
  })
}

export const onUsernameSelection = (username: string): void => {
  if (!socket) return
  socket.auth = { username }
  socket.connect()
}

export default socket
