import { useMemo } from "react";
import create, { StoreApi, UseBoundStore } from "zustand";

let store: UseBoundStore<StoreApi<object>> | undefined;
type UserState = {
  self: boolean;
  userID: string;
  username: string;
};

const initialState = {
  self: false,
  userID: "hjdbjsjhd98u3290u203ue2",
  username: "Default User",
};

function initStore(preloadedState = initialState) {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,
    updateUserDetails: (user: UserState) => {
      set({
        loggedInUser: {
          self: user.self,
          userID: user.userID,
          username: "",
        },
      });
    },
  }));
}

export const initializeStore = (preloadedState: UserState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Zustand state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useHydrate(initialState: UserState) {
  const state =
    typeof initialState === "string" ? JSON.parse(initialState) : initialState;
  const store = useMemo(() => initializeStore(state), [state]);
  return store;
}
