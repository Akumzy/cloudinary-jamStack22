import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import Script from "next/script"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
