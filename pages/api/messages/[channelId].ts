// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  const { channelId } = req.query

  try {
    //retrieve chatroom messages
    const chatRoomMessages = await prisma.message.findMany({
      where: {
        roomId: channelId as string,
      },
      // include: {
      //   user: true,
      // },
    })

    if (!chatRoomMessages) return res.status(404).json({ message: "channel not found" })
    return res.status(200).json(chatRoomMessages)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
