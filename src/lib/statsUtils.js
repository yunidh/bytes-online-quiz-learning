import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "/lib/firebase";

// Initialize user stats in Firestore
export const initializeUserStats = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().stats) {
      const initialStats = {
        quizzesTaken: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        quizzesCreated: 0,
      };

      await setDoc(userRef, { stats: initialStats }, { merge: true });

      return initialStats;
    }

    return userDoc.data().stats;
  } catch (error) {
    console.error("Error initializing user stats:", error);
    return {
      quizzesTaken: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      quizzesCreated: 0,
    };
  }
};

// Get user stats from Firestore
export const getUserStatsFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().stats) {
      return userDoc.data().stats;
    }

    // If no stats exist, initialize them
    return await initializeUserStats(userId);
  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      quizzesTaken: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      quizzesCreated: 0,
    };
  }
};

// Update specific stat by incrementing
export const incrementUserStat = async (userId, statName, value = 1) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      [`stats.${statName}`]: increment(value),
    });

    console.log(`Incremented ${statName} by ${value} for user ${userId}`);
  } catch (error) {
    console.error(`Error incrementing ${statName}:`, error);
  }
};

// Update multiple stats at once
export const updateMultipleStats = async (userId, statsUpdate) => {
  try {
    const userRef = doc(db, "users", userId);

    const firestoreUpdate = {};
    Object.keys(statsUpdate).forEach((statName) => {
      firestoreUpdate[`stats.${statName}`] = increment(statsUpdate[statName]);
    });

    await updateDoc(userRef, firestoreUpdate);

    console.log(`Updated multiple stats for user ${userId}:`, statsUpdate);
  } catch (error) {
    console.error("Error updating multiple stats:", error);
  }
};

// Reset all user stats to 0
export const resetUserStats = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);

    const resetStats = {
      quizzesTaken: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      quizzesCreated: 0,
    };

    await updateDoc(userRef, {
      stats: resetStats,
      achievements: [], // Also reset achievements
    });

    console.log(`Reset all stats for user ${userId}`);
    return resetStats;
  } catch (error) {
    console.error("Error resetting user stats:", error);
    throw error;
  }
};

// Called when user completes a quiz
export const recordQuizCompletion = async (
  userId,
  correctAnswers,
  totalQuestions
) => {
  try {
    await updateMultipleStats(userId, {
      quizzesTaken: 1,
      questionsAnswered: totalQuestions,
      correctAnswers: correctAnswers,
    });

    console.log(
      `Recorded quiz completion for user ${userId}: ${correctAnswers}/${totalQuestions}`
    );
  } catch (error) {
    console.error("Error recording quiz completion:", error);
  }
};

// Called when user creates a quiz
export const recordQuizCreation = async (userId) => {
  try {
    await incrementUserStat(userId, "quizzesCreated", 1);
    console.log(`Recorded quiz creation for user ${userId}`);
  } catch (error) {
    console.error("Error recording quiz creation:", error);
  }
};
