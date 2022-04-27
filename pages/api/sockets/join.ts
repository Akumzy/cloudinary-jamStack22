// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"
import { ChatRoom } from "@prisma/client"
import { getSession } from "next-auth/react"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  const session = await getSession({ req })
  console.log("user logged in", session?.user.email)
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const user = session.user

  try {
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
    const userChannelsIds = userChannels.map((channel) => channel.id)
    // userChannelsIds.forEach((channelId) => {
    //   //@ts-ignore
    //   res.socket?.server?.io.on("connection", async (socket) => {
    //     console.log("user on connection", user.email)
    //     console.log("channelId", channelId)
    //     socket.join(channelId)
    //     socket.broadcast.to(channelId).emit("joined", {
    //       channelId,
    //       user,
    //     })
    //   })
    // })
    return res.status(200).json(userChannels)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
