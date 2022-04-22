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

    io.on("connection", (socket) => {
      // socket.on('connected', (userId:string) => {
      //    users[userId] = socket.id
      // })
      socket.on("input-change", (msg) => {
        socket.broadcast.emit("update-input", msg)
      })
    })
  }

  res.end()
}
