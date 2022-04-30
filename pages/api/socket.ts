import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { Server as NetServer } from "http"
import { getSession } from "next-auth/react"
import prisma from "../../lib/prisma"
import { NextApiResponseServerIO } from "../../types/socket"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const session = await getSession({ req })
  console.log("user logged in", session?.user.email)
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const user = session.user
  if (!res.socket.server.io) {
    console.log("New Socket.io server...")
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    })
    io.on("connection", async (socket) => {
      socket.on("set_active", async (data: Active, ack: Function) => {
        console.log("data", data)
        console.log("user join", data.user.email)
        try {
          const userChannels = await prisma.chatRoom.findMany({
            where: {
              members: {
                some: {
                  user: {
                    id: data.user.userId,
                  },
                },
              },
            },
          })
          const userChannelsIds = userChannels.map((channel: any) => channel.id)
          userChannelsIds.forEach((channelId: any) => {
            socket.join(channelId + "")
            socket.broadcast.to(channelId + "").emit("active", data.user)
          })
          ack(null, userChannelsIds)
        } catch (error) {
          ack("something went wrong")
        }
      })

      socket.on("join_channel", async (data: JoinChannel, ack: Function) => {
        console.log("joing channel")
        try {
          const newChannelMember = await prisma.chatRoomMember.create({
            data: {
              user: {
                connect: {
                  id: +data.userId,
                },
              },
              chatRoom: {
                connect: {
                  id: +data.channelId,
                },
              },
            },
            include: {
              user: true,
            },
          })
          socket.join(data.channelId + "")
          socket.broadcast.to(data.channelId + "").emit("new_member", {
            newChannelMember,
            channelId: data.channelId,
          })
          ack(null, newChannelMember)
        } catch (error) {
          console.error(error)
          ack("something went wrong")
        }
      })
    })

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io
  }
  res.end()
}
