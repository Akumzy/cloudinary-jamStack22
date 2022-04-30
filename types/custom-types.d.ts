interface Active {
  user: User
}
interface JoinChannel {
  userId: number
  channelId: number
}

interface User {
  name: string
  email: string
  image: string
  userId: number
  bio: string
}

interface ChatRoom {
  id: number
  name: string
  description: string
  creatorId: string
  members: User[]
  createdAt: string
  messages: Message[]
}

interface Message {
  id: number
  isDefault: boolean
  text: string
  createdAt: string
  roomId: string
  userId: string
}

declare global {
  interface Window {
    cloudinary?: any
  }
}

interface videoObject {
  width: number
  height: number
  videoUrl: string
}

interface imageObject {
  width: number
  height: number
  imageUrl: string
}
declare module "cloudinary"
