// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | any>
) {
  //if method not GET, return 405
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not Allowed" });
  }

  //get user from session next.js
  const session = await getSession({ req });

  //if user not logged in, return 401
  if (!(session && session.user)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const chatRooms = await prisma.chatRoom.findMany({
      include: {
        members: true,
      },
    });
    res.status(200).json(chatRooms);

    // return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
