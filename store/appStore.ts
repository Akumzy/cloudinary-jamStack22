import create from "zustand";

type UserState = {
  loggedInUser: {
    self: boolean;
    userID: string;
    username: string;
  };
};

export const useLoginDetails = create<UserState>((set, get) => ({
  loggedInUser: {
    self: false,
    userID: "",
    username: "",
  },
  updateUserDetails: (user: any) => {
    set({
      loggedInUser: {
        self: user.self,
        userID: user.userId,
        username: user.username,
      },
    });
  },
}));
