"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from '../types/auth';
import { decrypt, encrypt } from "../lib/encryption-utils";
import { getUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

type AuthContextType = {
  email: string | null;
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmailState] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 🌐 Handle logout from other tabs 
  useEffect(() => {
    const onChatChange = () => {
      const tokenInStorage = localStorage.getItem("token");
      if (!tokenInStorage) {
        logout();
        navigate("/signin");
      }
    };

    window.addEventListener("chat", onChatChange);
    return () => window.removeEventListener("chat", onChatChange);
  }, [navigate]);

  // ♻️ Restore session on load
  useEffect(() => {
    const restoreAuth = async () => {
      // Use localStorage for email instead of sessionStorage
      const storedEmail = decrypt(localStorage.getItem("email"));
      const storedToken = decrypt(localStorage.getItem("token"));
      const storedUserRaw = decrypt(localStorage.getItem("user"));

      if (storedEmail) setEmailState(storedEmail);
      if (storedToken) setTokenState(storedToken);

      if (storedUserRaw) {
        try {
          let parsedUser: any = JSON.parse(storedUserRaw);
          // Normalize: ensure both id and _id are present and equal
          if (parsedUser && parsedUser.id && !parsedUser._id) {
            parsedUser._id = parsedUser.id;
          }
          if (parsedUser && parsedUser._id && !parsedUser.id) {
            parsedUser.id = parsedUser._id;
          }
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      } else if (storedToken) {
        try {
          const profileResponse = await getUser();
          // getUser returns { token, user }, so extract user
          setUser(profileResponse.data.user);
          localStorage.setItem("user", encrypt(JSON.stringify(profileResponse.data.user)));
        } catch {
          setUser(null);
        }
      } 

      setIsLoading(false);
    };

    restoreAuth();
  }, []);

  // 🔧 Setters
  const setEmail = (email: string) => {
    localStorage.setItem("email", encrypt(email));
    setEmailState(email);
  };

  const setToken = (token: string) => {
    localStorage.setItem("token", encrypt(token));
    setTokenState(token);
  };

  const logout = () => {
    socket.disconnect()

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email"); 
    setEmailState(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        user,
        isLoading,
        setEmail,
        setToken,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
