// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"
import { NextApiResponseServerIO } from "../../../types/socket"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  //if method not POST, return 405
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
  const { name, description } = req.body

  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        description,
        creatorId: user.userId,
        messages: {
          create: [
            {
              isDefault: true,
              text: `Channel created by ${user.name}`,
              user: {
                connect: {
                  id: user.userId,
                },
              },
            },
          ],
        },
        members: {
          create: [
            {
              user: {
                connect: {
                  id: user.userId,
                },
              },
            },
          ],
        },
      },
      include: {
        messages: true,
        members: true,
      },
    })

    res.socket?.server?.io.on("connection", async (socket) => {
      socket.broadcast.emit("channelCreated", chatRoom)
      socket.join(chatRoom.id)
    })
    // res?.socket?.server?.io?.emit("channelCreated", chatRoom)

    return res.status(200).json(chatRoom)

    // return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
