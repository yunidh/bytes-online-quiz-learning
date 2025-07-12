"use client";
import { useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import useAvatar from "./navbar/avatarStore";

export default function AvatarManager() {
  const { user } = UserAuth();
  const { loadAvatar, resetAvatar, isLoaded } = useAvatar();

  useEffect(() => {
    if (user?.uid && !isLoaded) {
      // User is logged in, load their avatar
      loadAvatar(user.uid);
    } else if (!user && isLoaded) {
      // User logged out, reset avatar to defaults
      resetAvatar();
    }
  }, [user, loadAvatar, resetAvatar, isLoaded]);

  // This component doesn't render anything
  return null;
}
