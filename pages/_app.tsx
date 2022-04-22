import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import Script from "next/script"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { socketInitializer } from "../utils/socket"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const user = session?.user
  useEffect((): any => socketInitializer(user.id), [])

  return (
    <SessionProvider session={session}>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
