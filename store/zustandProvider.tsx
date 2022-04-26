import { createContext, useContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({
  children,
  store,
}: {
  children: any;
  store: any;
}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = (selector: any, eqFn: any) => {
  const store: any = useContext(StoreContext);
  const values = store(selector, eqFn);
  return values;
};
