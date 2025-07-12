"use client";
import { ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { AchievementScroll } from "./achievementScroll";
import { Separator } from "@/components/ui/separator";
import { PeepAvatar } from "@/components/peepAvatars";
import { EditAvatar } from "./editAvatar";
import { UserAuth } from "@/app/context/AuthContext";
import useAvatar from "./avatarStore";

export function DummyLogo() {
  return (
    <div>
      <input
        type="checkbox"
        disabled={true}
        id="drawer-toggle"
        className="hidden peer"
      />

      <label
        htmlFor="drawer-toggle"
        className="absolute left-0 top-2 sm:top-3 z-[60] inline-block bg-muted p-1 sm:p-2 transition-transormation duration-500 hover:text-primary hover:cursor-pointer peer-checked:text-primary group peer-checked:left-4 sm:peer-checked:left-[280px] lg:peer-checked:left-[512px]"
      >
        <div className="absolute z-10 left-6 sm:left-10 top-0 text-lg sm:text-3xl font-extrabold">
          Bytes
        </div>
        <ChevronRight className="peer-checked:group-[]:rotate-180 transition-transform duration-500 w-4 h-4 sm:w-6 sm:h-6" />
      </label>
    </div>
  );
}

export function Drawer() {
  const { user } = UserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const {
    updateFace,
    updateHair,
    updateBody,
    updateFacialHair,
    updateAccessory,
  } = useAvatar();

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  // // Handle click outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       drawerRef.current &&
  //       !drawerRef.current.contains(event.target) &&
  //       isOpen
  //     ) {
  //       // Check if the click is not on the toggle button
  //       const toggleButton = event.target.closest("[data-drawer-toggle]");
  //       if (!toggleButton) {
  //         setIsOpen(false);
  //       }
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [isOpen]);

  useEffect(() => {
    // Get User Avatar Properties
    async function GetUserAvatar() {
      const res = await fetch(
        `http://localhost:8081/users/getAvatar?uid=${user.uid}`,
        { method: "GET", cache: "no-store" }
      );
      const Data = await res.json();
      try {
        if (Data.statusCode === 200) {
          const avatarProps = Data.data;
          updateFace(avatarProps.face);
          updateHair(avatarProps.hair);
          updateBody(avatarProps.body);
          updateFacialHair(avatarProps.facialHair);
          updateAccessory(avatarProps.accessory);
        }
      } catch {}
    }
    GetUserAvatar();
  }, [
    user,
    updateFace,
    updateHair,
    updateBody,
    updateFacialHair,
    updateAccessory,
  ]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Backdrop overlay for mobile and tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={toggleDrawer}
        data-drawer-toggle="true"
        className={`fixed left-0 top-3 sm:top-4 md:top-3 z-[60] inline-block bg-muted p-2 sm:p-3 md:p-2 transition-all duration-500 hover:text-primary hover:cursor-pointer group ${
          isOpen ? "left-4 md:left-[320px] lg:left-[512px] text-primary" : ""
        }`}
      >
        <div className="absolute z-10 left-6 sm:left-10 top-0 text-lg sm:text-2xl md:text-3xl font-extrabold">
          Bytes
        </div>
        <ChevronRight
          className={`transition-transform duration-500 w-4 h-4 sm:w-6 sm:h-6 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        ref={drawerRef}
        className={`fixed flex flex-col justify-start z-50 top-0 left-0 w-full md:w-[320px] lg:w-1/3 h-full transition-all duration-500 transform bg-muted border-r-4 rounded-r-xl dark:shadow-primary pt-16 sm:pt-20 md:pt-16 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-shrink-0 px-4 mb-2 sm:mb-4">
          <PeepAvatar />
        </div>
        <div className="flex-shrink-0 mb-2 sm:mb-4 flex justify-center flex-row items-center px-4">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl text-center font-firacode truncate max-w-[200px] sm:max-w-[250px] md:max-w-none">
            {user.displayName}
          </h1>
          <EditAvatar />
        </div>
        <Separator className="flex-shrink-0 my-2 sm:my-4" />
        <div className="flex-1 mx-auto w-4/5 mb-4 sm:mb-6 overflow-hidden">
          <AchievementScroll />
        </div>
      </div>
    </div>
  );
}
