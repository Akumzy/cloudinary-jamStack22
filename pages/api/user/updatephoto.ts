// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"
import cloudinary from "../../../lib/cloudinary"

type Data = {
  message: string
}

//remove ext from public id
function removeExt(publicId: string) {
  const ext = publicId.split(".")[1]
  return publicId.replace(`.${ext}`, "")
}
//retrieve the public id from a cloudinary url
function getPublicId(url: string) {
  const urlParts = url.split("/")
  return removeExt(urlParts[urlParts.length - 1])
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  //if method not PATCH, return 405
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not Allowed" })
  }

  //get user from session next.js
  const session = await getSession({ req })

  //if user not logged in, return 401
  if (!(session && session.user)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const user = session.user

  //check if user photo is a cloudinary url
  if (user.image.startsWith("https://res.cloudinary.com/")) {
    const publicId = getPublicId(user.image)
    //delete the photo from cloudinary
    cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
      if (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
      }
    })
  }

  const { image } = req.body
  console.log("My New Upload", image)

  //update userphoto in database
  try {
    await prisma.user.update({
      data: {
        image,
      },
      where: {
        email: user.email,
      },
    })
    return res.status(200).json({ message: "updated succesfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
