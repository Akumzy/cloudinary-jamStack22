import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "Socket.IO-client";
import { useHydrate } from "../store/loggedInUserStore";
import { StoreProvider } from "../store/zustandProvider";

let socket: any;
const onUsernameSelection = (username: string): void => {
  if (!socket) return;
  socket.auth = { username };
  socket.connect();
};
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [users, setUsers] = useState<any[]>([]);
  const store = useHydrate(pageProps.initialZustandState);

  useEffect((): any => {
    if (pageProps.user) {
      socketInitializer(pageProps.user.email);
    }

    return () => {
      socket?.off("connect_error");
      socket?.disconnect();
    };
  }, [pageProps.user]);

  const socketInitializer = async (username: string): Promise<void> => {
    await axios("/api/socket");
    socket = io();

    onUsernameSelection(username);

    socket?.onAny((event: any, ...args: any) => {
      console.log(event, args);
    });
    socket?.on("connect", () => {
      console.log("connected");
    });

    socket?.on("connect_error", (err: any) => {
      console.error("connect_error", err);
    });

    socket?.on("users", (users: any[]) => {
      console.log("socket on users");
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        console.log("user socket", user);
      });
      // put the current user first, and then sort by username
      users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(users);
      console.log("users", users);
    });

    socket?.on("user connected", (user: any) => {
      const appUsers = [...users, user];
      const sortedUsers = appUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers([...sortedUsers]);
      console.log("user connected", users);
    });

    if (socket) {
      console.log("socket", socket);
    }
  };
  return (
    <SessionProvider session={session}>
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    </SessionProvider>
  );
}
