import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "/lib/firebase";
import { toast } from "react-hot-toast";
import { getUserStatsFromFirestore } from "./statsUtils";
import userAchievements from "./userAchivementsStore";

// Define available achievements
export const availableAchievements = [
  {
    id: "first_quiz",
    title: "First Steps",
    description: "Submit your first quiz",
    condition: (stats) => stats.quizzesTaken >= 1,
    icon: "🎯",
  },
  {
    id: "answer_master",
    title: "Answer Master",
    description: "Answer 10 questions correctly",
    condition: (stats) => stats.correctAnswers >= 10,
    icon: "🧠",
  },
  {
    id: "quiz_creator",
    title: "Quiz Creator",
    description: "Create a custom quiz",
    condition: (stats) => stats.quizzesCreated >= 1,
    icon: "🎨",
  },
  {
    id: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Answer 100 questions",
    condition: (stats) => stats.questionsAnswered >= 100,
    icon: "📚",
  },
];

// Get user stats from Firestore (using new stats system)
export const getUserStats = async (userId) => {
  return await getUserStatsFromFirestore(userId);
};

// Get user achievements from Firestore
export const getUserAchievements = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().achievements) {
      return userDoc.data().achievements;
    }
    return [];
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return [];
  }
};

// Show custom achievement toast
const showAchievementToast = (achievement) => {
  toast(`Achievement Unlocked!\n${achievement.icon} ${achievement.title}`, {
    duration: 5000,
    style: {
      background:
        "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
      border: "2px solid",
      borderImage: "linear-gradient(145deg, #8b5cf6, #3b82f6) 1",
      borderRadius: "12px",
      color: "#ffffff",
      fontSize: "20px",
      fontWeight: "600",
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
      minWidth: "300px",
    },
    iconTheme: {
      primary: "#8b5cf6",
      secondary: "#ffffff",
    },
  });
};

// Save achievement to Firestore
export const saveAchievement = async (userId, achievement) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    let existingAchievements = [];
    if (userDoc.exists() && userDoc.data().achievements) {
      existingAchievements = userDoc.data().achievements;
    }

    // Check if achievement already exists
    const achievementExists = existingAchievements.some(
      (ach) => ach.id === achievement.id
    );

    if (!achievementExists) {
      const newAchievement = {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: new Date(),
      };
      existingAchievements.push(newAchievement);

      await setDoc(
        userRef,
        { achievements: existingAchievements },
        { merge: true }
      );

      // Update the Zustand store immediately to reflect the new achievement
      const { updateAchievement } = userAchievements.getState();
      updateAchievement(existingAchievements);

      // Show custom toast notification
      showAchievementToast(achievement);
    }

    return existingAchievements;
  } catch (error) {
    console.error("Error saving achievement:", error);
    return [];
  }
};

// Refresh achievements from Firestore and update the store
export const refreshAchievements = async (userId) => {
  try {
    const achievements = await getUserAchievements(userId);
    const { updateAchievement } = userAchievements.getState();
    updateAchievement(achievements);
    return achievements;
  } catch (error) {
    console.error("Error refreshing achievements:", error);
    return [];
  }
};

// Check for new achievements and unlock them
export const checkForNewAchievements = async (userId) => {
  try {
    console.log("Checking for new achievements for user:", userId);
    const stats = await getUserStats(userId);
    console.log("Stats for achievement check:", stats);

    const currentAchievements = await getUserAchievements(userId);
    console.log("Current achievements:", currentAchievements);

    const currentAchievementIds = currentAchievements.map((ach) => ach.id);
    console.log("Current achievement IDs:", currentAchievementIds);

    for (const achievement of availableAchievements) {
      const conditionMet = achievement.condition(stats);
      console.log(
        `Achievement ${
          achievement.id
        }: condition met = ${conditionMet}, already unlocked = ${currentAchievementIds.includes(
          achievement.id
        )}`
      );

      // Check if achievement is not already unlocked and condition is met
      if (!currentAchievementIds.includes(achievement.id) && conditionMet) {
        console.log(`Unlocking achievement: ${achievement.id}`);
        await saveAchievement(userId, achievement);
      }
    }
  } catch (error) {
    console.error("Error checking for new achievements:", error);
  }
};
