import { createContext, useState } from "react";

const UserContext = createContext();

export { UserContext };

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  // const [token, setToken] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
