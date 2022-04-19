interface User {
    name: string
      email: string
      image: string
  userId: string
  bio: string
}

declare global {
  interface Window {
    cloudinary?: any
  }
}

declare module 'cloudinary'