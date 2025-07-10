"use client";
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

//used to shate data that can be considered global

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const sub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // console.log('user:',currentUser)
          const strigifiedUser = JSON.stringify(currentUser);
          // console.log('strigifiedUser',strigifiedUser)
          const res = await fetch("http://localhost:8081/users/saveUser", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },

            body: strigifiedUser,
            // body data type must match "Content-Type" header
          });

          if (!res.ok) {
            console.error("Failed to save user to backend:", res.status);
          }
        } catch (error) {
          console.error("Error saving user to backend:", error);
        }
      }
    });

    return () => sub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
