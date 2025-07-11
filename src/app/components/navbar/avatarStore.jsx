import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "/lib/firebase";

const useAvatar = create((set, get) => ({
  accessory: "None",
  body: "Shirt",
  face: "Smile",
  hair: "Bald",
  facialHair: "None",
  isLoaded: false,
  
  updateAccessory: (accessory) => set(() => ({ accessory: accessory })),
  updateBody: (body) => set(() => ({ body: body })),
  updateFace: (face) => set(() => ({ face: face })),
  updateHair: (hair) => set(() => ({ hair: hair })),
  updateFacialHair: (facialHair) => set(() => ({ facialHair: facialHair })),
  
  // Load avatar data from Firestore
  loadAvatar: async (userId) => {
    if (!userId || get().isLoaded) return;
    
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().avatar) {
        const avatarData = userDoc.data().avatar;
        set({
          accessory: avatarData.accessory || "None",
          body: avatarData.body || "Shirt",
          face: avatarData.face || "Smile",
          hair: avatarData.hair || "Bald",
          facialHair: avatarData.facialHair || "None",
          isLoaded: true,
        });
      } else {
        // No saved avatar, use defaults
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
      set({ isLoaded: true }); // Still mark as loaded to prevent infinite retries
    }
  },
  
  // Reset avatar data (useful for logout)
  resetAvatar: () => set({
    accessory: "None",
    body: "Shirt",
    face: "Smile",
    hair: "Bald",
    facialHair: "None",
    isLoaded: false,
  }),
}));

export default useAvatar;