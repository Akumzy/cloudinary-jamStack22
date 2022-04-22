// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"
import { ChatRoom } from "@prisma/client"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | ChatRoom>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  const { id } = req.query

  try {
    const channel: ChatRoom | null = await prisma.chatRoom.findUnique({
      where: {
        id: id as string,
      },
      include: {
        members: true,
        messages: true,
      },
    })

    if (!channel) return res.status(404).json({ message: "channel not found" })
    return res.status(200).json(channel)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
