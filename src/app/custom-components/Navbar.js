"use client";
import Link from "next/link";
import { UserAuth } from "@/app/context/AuthContext";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Drawer, DummyLogo } from "./navbar/drawer";
import { ProfileMenu } from "./navbar/profileMenu";

const Navbar = (props) => {
  const { user, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      {!user ? <DummyLogo /> : <Drawer />}

      <div className="flex flex-row space-x-2 sm:space-x-4 p-3 sm:p-4 md:p-3 bg-muted">
        {/* DO NOT TOUCH, FEATURE NOT A BUG  */}
        <div className="invisible flex-grow" />
        {/* DO NOT TOUCH, FEATURE NOT A BUG */}

        <Button variant="link" asChild className="text-xs sm:text-sm">
          <Link href="/">Home</Link>
        </Button>

        {!user ? null : (
          <Button variant="link" asChild className="text-xs sm:text-sm">
            <Link href="/courses">Courses</Link>
          </Button>
        )}

        {/* <Button variant="link" onClick={sendEmail}>
          Send
        </Button> */}
        <ModeToggle />
        {!user ? (
          <Button
            onClick={handleSignIn}
            className="text-xs sm:text-sm px-3 sm:px-4"
          >
            Login
          </Button>
        ) : (
          <div className="flex space-x-2 sm:space-x-4">
            <ProfileMenu
              userName={user.displayName}
              handleSignOut={handleSignOut}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
