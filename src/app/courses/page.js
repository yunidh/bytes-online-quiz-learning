"use client";
import { LessonCard } from "@/app/components/lessons/lesson_card_unlocked";
import { LessonCardNew } from "@/app/components/lessons/lesson_card_new";
import { CreateQuizCard } from "@/app/components/lessons/create_quiz_card";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "/lib/firebase";
import { useState, useEffect, useCallback } from "react";
import { UserAuth } from "../context/AuthContext";

// Function to fetch quiz data from Firestore
async function getQuizData(user) {
  try {
    let allQuizzes = [];

    // 1. Get default quizzes (Python, JavaScript) - available to all users
    const defaultQuizzesCollection = collection(db, "courses");
    const defaultSnapshot = await getDocs(defaultQuizzesCollection);

    defaultSnapshot.forEach((doc) => {
      const data = doc.data();
      allQuizzes.push({
        id: doc.id,
        ...data,
        isDefault: true,
        source: "default",
      });
    });

    // 2. Get user-specific quizzes (only if user is logged in)
    if (user) {
      const userQuizzesCollection = collection(
        db,
        "users",
        user.uid,
        "quizzes"
      );
      const userSnapshot = await getDocs(userQuizzesCollection);

      userSnapshot.forEach((doc) => {
        const data = doc.data();
        allQuizzes.push({
          id: doc.id,
          ...data,
          isDefault: false,
          source: "user",
          userId: user.uid,
        });
      });
    }

    return allQuizzes;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }
}

export default function courses() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = UserAuth(); // Get current user

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    const fetchedQuizzes = await getQuizData(user);
    setQuizzes(fetchedQuizzes);
    setLoading(false);
    console.log("Fetched quizzes:", fetchedQuizzes.length);
  }, [user]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleQuizCreated = useCallback(() => {
    // Refresh the quiz list when a new quiz is created
    fetchQuizzes();
  }, [fetchQuizzes]);

  if (loading) {
    return (
      <main className="mx-48 my-24">
        <div className="grid grid-cols-2 gap-8 gap-x-40">
          <div className="col-span-2 text-center text-muted-foreground">
            Loading quizzes...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-48 my-24">
      <div className="grid grid-cols-2 gap-8 gap-x-40">
        {/* Create Quiz Card - Only show if user is logged in */}
        {user && (
          <CreateQuizCard
            key="create-quiz-card"
            onQuizCreated={handleQuizCreated}
          />
        )}

        {/* Existing Quiz Cards */}
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="relative">
              <LessonCardNew quizData={quiz} />
              {/* Quiz source indicator */}
              <div className="absolute top-2 right-2 z-10">
                {quiz.isDefault ? (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Default
                  </span>
                ) : (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Custom
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 text-center text-muted-foreground">
            {user ? "No quizzes available" : "Please login to view quizzes"}
          </div>
        )}
      </div>
    </main>
  );
}
