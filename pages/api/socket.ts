// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { Server } from "Socket.IO"
import prisma from "../../lib/prisma"

type Data = {
  name: string
}

let users: string[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //@ts-ignore
  if (res.socket?.server?.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    //@ts-ignore
    const io = new Server(res.socket?.server)
    //@ts-ignore
    res.socket?.server?.io = io
    //get user from session next.js
    const session = await getSession({ req })
    console.log("user session", session)
    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    io.use((socket, next) => {
      const sessionID = socket.handshake.auth.sessionID
      if (sessionID) {
        // find existing session
        // const session = sessionStore.findSession(sessionID)
        // if (session) {
        //   socket.sessionID = sessionID
        //   socket.userID = session.userID
        //   socket.username = session.username
        //   return next()
        // }
      }
      const username = socket.handshake.auth.username
      if (!username) {
        return next(new Error("invalid username"))
      }
      //@ts-ignore
      socket.username = username
      next()
    })

    const user = session.user

    const userChannels = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            user: {
              id: session.user.userId,
            },
          },
        },
      },
    })

    io.on("connection", (socket) => {
      console.log("a user connected")

      //get users chatroom id
      const userChannelsIds = userChannels.map((channel) => channel.id)
      userChannelsIds.forEach((channelId) => {
        socket.join(channelId)
      })

      socket.on("join_channel", async (channelId: string) => {
        //ensure user is not already in channel
        if (userChannelsIds.includes(channelId)) {
          return
        }

        const channel = await prisma.chatRoom.update({
          where: { id: channelId },
          data: {
            members: {
              create: {
                user: {
                  connect: {
                    id: user.userId,
                  },
                },
              },
            },
          },
        })

        if (channel) {
          socket.join(channelId)
          socket.broadcast.to(channelId).emit("joined_channel", {
            channelId,
            message: `${user.name} joined the channel`,
          })
        }
      })

      socket.on("new_channel_message", async (data: Message) => {
        const channel = await prisma.chatRoom.update({
          where: { id: data.roomId },
          data: {
            messages: {
              create: {
                text: data.text,
                isDefault: data.isDefault,
                user: {
                  connect: {
                    id: user.userId,
                  },
                },
              },
            },
          },
        })

        if (channel) {
          socket.broadcast.to(data.roomId).emit("channel_message", {
            data,
          })
        }
      })

      socket.on("create_channel", async (data: ChatRoom) => {
        const channel = await prisma.chatRoom.create({
          data: {
            name: data.name,
            description: data.description,
            creatorId: user.userId,
            members: {
              create: {
                user: {
                  connect: {
                    id: user.userId,
                  },
                },
              },
            },
          },
        })

        if (channel) {
          socket.broadcast.emit("new_channel", {
            data,
          })
        }
      })

      console.log("users", users)
      socket.emit("users", users)
      // notify existing users
      socket.broadcast.emit("user_connected", {
        userID: socket.id,
        //@ts-ignore
        username: socket.username,
      })
    })
  }

  res.end()
}
