"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileCard from "./ProfileCard";

export function ProfileMenu(props) {
  const [position, setPosition] = React.useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate"
        >
          {props.userName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 sm:w-72 flex flex-col text-sm sm:text-md mr-2 sm:mr-4">
        <DropdownMenuLabel className="mx-auto font-extrabold text-base sm:text-lg">
          Your Profile
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="my-3 sm:my-4 mx-auto w-full">
          <ProfileCard />
        </div>
        <Button
          className="mx-auto mb-3 sm:mb-4 text-sm"
          onClick={props.handleSignOut}
        >
          Sign Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
