// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  const { userId, channelId } = req.body

  try {
    const newChannelMember = await prisma.chatRoomMember.create({
      data: {
        user: {
          connect: {
            id: +userId,
          },
        },
        chatRoom: {
          connect: {
            id: +channelId,
          },
        },
      },
      include: {
        user: true,
      },
    })
    return res.status(200).json(newChannelMember)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
