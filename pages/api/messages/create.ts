// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"
import { Message } from "@prisma/client"
import { getSession } from "next-auth/react"
import { NextApiResponseServerIO } from "../../../types/socket"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  //get user from session next.js
  const session = await getSession({ req })

  //if user not logged in, return 401
  if (!(session && session.user)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const user = session.user

  const { channelId, text } = req.body

  try {
    //retrieve chatroom messages
    const chatRoomMessage = await prisma.message.create({
      data: {
        text,
        userId: user.userId,
        roomId: channelId as string,
      },
    })

    res.socket?.server?.io.on("connection", async (socket) => {
      socket.broadcast.to(channelId).emit("new_message", chatRoomMessage)
    })

    if (!chatRoomMessage) return res.status(404).json({ message: "channel not found" })
    return res.status(200).json(chatRoomMessage)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
