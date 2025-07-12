import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { LucideEdit } from "lucide-react";
import useAvatar from "./avatarStore";
import {
  SelectBody,
  SelectHair,
  SelectFace,
  SelectAccessory,
  SelectFacialHair,
} from "./editSelectors";
import { UserAuth } from "@/app/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

export function EditAvatar() {
  const { user } = UserAuth();
  const { face, body, hair, facialHair, accessory } = useAvatar();
  const [isSaving, setIsSaving] = useState(false);

  const userAvatar = {
    accessory,
    body,
    face,
    hair,
    facialHair,
    updatedAt: new Date(),
  };

  const changeAvatar = async () => {
    if (!user?.uid) {
      toast.error("❌ User not authenticated");
      return;
    }

    setIsSaving(true);
    try {
      // Save avatar data to Firestore
      const avatarRef = doc(db, "users", user.uid);
      await setDoc(avatarRef, { avatar: userAvatar }, { merge: true });
      toast.success("🎉 Avatar saved successfully!");
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast.error("💥 Error saving avatar. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="ml-1 sm:ml-2 h-8 w-8 sm:h-10 sm:w-10"
          >
            <LucideEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[600px] w-[80vw] max-h-[80vh] overflow-y-auto 
          max-md:!top-[35%] max-md:!translate-y-0 max-md:!left-[50%] 
          md:!top-[50%] md:!translate-y-[-50%] md:!left-[50%]
          !translate-x-[-50%]"
        >
          <DialogHeader>
            <DialogTitle className="text- sm:text-xl">Edit Avatar</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Customize your Avatar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:gap-y-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mx-4 sm:mx-8">
              <SelectHair />
              <SelectFace />
              <SelectBody />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mx-4 sm:mx-28">
              <SelectAccessory />
              <SelectFacialHair />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="mx-auto text-sm sm:text-base"
              type="submit"
              onClick={changeAvatar}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
