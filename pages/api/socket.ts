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
  const session = await getSession({ req })
  console.log("first session", session?.user.userId)
  //@ts-ignore
  if (res.socket?.server?.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    //@ts-ignore
    const io = new Server(res.socket?.server)

    //@ts-ignore
    res.socket?.server?.io = io
  }
  //@ts-ignore
  res.socket?.server?.io.on("connection", async (socket) => {
    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = session.user
    console.log(user.userId)
    const userChannels = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            user: {
              id: user.userId,
            },
          },
        },
      },
    })
    console.log("userChannels", userChannels)
    //get users chatroom id
    const userChannelsIds = userChannels.map((channel) => channel.id)
    userChannelsIds.forEach((channelId) => {
      socket.join(channelId)
    })

    socket.on("join_channel", async ({ channelId, userId }: any, ack: Function) => {
      try {
        console.log("join_channel", channelId)
        console.log("userId", userId)
        //ensure user is not already in channel
        // if (userChannelsIds.includes(channelId)) {
        //   console.log("Already in channel")
        //   throw new Error("Already in channel")
        // }
        // const channel = await prisma.chatRoom.findUnique({
        //   where: {
        //     id: channelId,
        //   },
        // })
        // console.log("channelbyid", channel)

        //add new channel memebr to db
        // await prisma.chatRoom.update({
        //   where: {
        //     id: channelId,
        //   },
        //   data: {
        //     members: {
        //       connect: {
        //         user: {
        //           id: userId,
        //         },
        //       },
        //     },
        //   },
        // })

        // const channel = await prisma.chatRoom.update({
        //   where: { id: channelId },
        //   data: {
        //     members: {
        //       create: [
        //         {
        //           user: {
        //             connect: {
        //               id: userId,
        //             },
        //           },
        //           chatRoom: {
        //             connect: {
        //               id: channelId,
        //             },
        //           },
        //         },
        //       ],
        //     },
        //   },
        // })
        const channel = await prisma.chatRoomMember.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            chatRoom: {
              connect: {
                id: channelId,
              },
            },
          },
        })

        if (channel) {
          socket.join(channelId)
          socket.to(channelId).emit("joined_channel", {
            channelId,
            user: user,
            message: `${user.name} joined the channel`,
          })
        }
        ack(null, channel)
      } catch (error) {
        console.log(error)
        console.log("user channels", userChannelsIds)
        console.log("join_channel", channelId)
        ack("Unable to join channel")
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

    // console.log("users", users)
    // socket.emit("users", users)
    // notify existing users
    socket.broadcast.emit("user_connected", {
      userID: socket.id,
      user: user.email,
    })
  })

  res.end()
}
