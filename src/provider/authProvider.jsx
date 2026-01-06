import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(JSON.parse(sessionStorage.getItem("token")));
  const [refreshToken, setRefreshToken_] = useState(localStorage.getItem("refreshToken"));

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token && token.logout) {
      sessionStorage.clear();
      localStorage.clear();
      setRefreshToken_()
    }

    if (token && !token.logout) {
      sessionStorage.setItem("token", JSON.stringify(token));
      setRefreshToken_(token?.refreshToken)
    }

  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    } else {
      localStorage.removeItem("refreshToken")
    }
  }, [refreshToken]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
