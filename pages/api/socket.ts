// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { Server } from "Socket.IO"

type Data = {
  name: string
}

let users: string[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //@ts-ignore
  if (res.socket?.server?.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    //@ts-ignore
    const io = new Server(res.socket?.server)
    //@ts-ignore
    res.socket?.server?.io = io
    io.use((socket, next) => {
      const username = socket.handshake.auth.username
      if (!username) {
        return next(new Error("invalid username"))
      }
      //@ts-ignore
      socket.username = username
      next()
    })

    io.on("connection", (socket) => {
      console.log("a user connected")
      const users = []
      //@ts-ignore
      for (let [id, socket] of io.of("/").sockets) {
        users.push({
          userID: id,
          username: socket.username,
        })
      }
      console.log("users", users)
      socket.emit("users", users)
      // notify existing users
      socket.broadcast.emit("user connected", {
        userID: socket.id,
        //@ts-ignore
        username: socket.username,
      })
    })
  }

  res.end()
}
