// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from "next"
import prisma from "../../../lib/prisma"
import { getSession } from "next-auth/react"
import { NextApiResponseServerIO } from "../../../types/socket"

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

  const { channelId, text, image } = req.body

  if (!image && !text) {
    return res.status(400).json({ message: "Message is required" })
  }

  try {
    //retrieve chatroom messages
    const chatRoomMessage = await prisma.message.create({
      data: {
        image,
        text,
        userId: +user.userId,
        roomId: +channelId as number,
      },
    })

    if (!chatRoomMessage) return res.status(404).json({ message: "channel not found" })
    return res.status(200).json(chatRoomMessage)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
