import React, { useState } from "react";

export const CurrentUserContext = React.createContext();

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    income: "",
  });

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
export default CurrentUserProvider;
