import io from "Socket.IO-client"
import axios from "axios"

let socket: any

export const socketInitializer = async (): Promise<void> => {
  await axios("/api/socket")
  socket = io()

  socket.on("connect", () => {
    console.log("connected")
  })

  // onUsernameSelection(username)
}

export const onUsernameSelection = (username: string): void => {
  if (!socket) return
  socket.auth = { username }
  socket.connect()
}

socket?.onAny((event: any, ...args: any) => {
  console.log(event, args)
})

export default socket
