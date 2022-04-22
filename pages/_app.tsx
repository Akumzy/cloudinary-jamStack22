import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import Script from "next/script"
import type { AppProps } from "next/app"
import io from "Socket.IO-client"
import axios from "axios"
import { useEffect } from "react"

export let socket: any

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const socketInitializer = async (): Promise<void> => {
    await axios("/api/socket")
    socket = io()

    socket.on("connect", () => {
      console.log("connected")
    })
  }
  useEffect((): any => socketInitializer(), [])

  return (
    <SessionProvider session={session}>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
