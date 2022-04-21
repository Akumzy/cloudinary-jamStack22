// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'Socket.IO'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

//     if (res.socket?.server?.io) {
//     console.log('Socket is already running')
//   } else {
//     console.log('Socket is initializing')
//     const io = new Server(res.socket?.server)
//     res.socket?.server?.io = io
//   }
    // if (!res.socket?.server?.io) {
    //     console.log('Socket is initializing')
    //     const io = new Server(res.socket?.server)
    //     res.socket?.server?.io = io
    // } else {
    //     console.log('Socket is already running')
    // }
    
  res.end()
  res.status(200).json({ name: 'John Doe' })
}
