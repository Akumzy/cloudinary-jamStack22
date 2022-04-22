// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"
import { User } from "@prisma/client"

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | User>) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  const { id } = req.query

  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: id as string,
      },
    })

    if (!user) return res.status(404).json({ message: "user not found" })
    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "something went wrong" })
  }
}
