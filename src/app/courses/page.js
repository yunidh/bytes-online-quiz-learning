"use client";
import { LessonCard } from "@/app/components/lessons/lesson_card_unlocked";
import { LessonCardNew } from "@/app/components/lessons/lesson_card_new";
import { CreateQuizCard } from "@/app/components/lessons/create_quiz_card";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "/lib/firebase";
import { useState, useEffect, useCallback } from "react";

// Function to fetch quiz data from Firestore
async function getQuizData() {
  try {
    // Get all quizzes from a collection
    const quizzesCollection = collection(db, "courses");
    const quizSnapshot = await getDocs(quizzesCollection);
    const quizzes = [];

    quizSnapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });

    // Return all quizzes
    return quizzes;

    // Option 2: Get a specific quiz by document ID (uncomment if you prefer this)
    // const quizDoc = await getDoc(doc(db, "quizzes", "your-quiz-id"));
    // if (quizDoc.exists()) {
    //   return { id: quizDoc.id, ...quizDoc.data() };
    // }
    // return null;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return [];
  }
}

export default function courses() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    const fetchedQuizzes = await getQuizData();
    setQuizzes(fetchedQuizzes);
    setLoading(false);
    console.log("Fetched quizzes:", fetchedQuizzes.length);
  }, []);

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
        {/* Create Quiz Card - Always render first to maintain position */}
        <CreateQuizCard
          key="create-quiz-card"
          onQuizCreated={handleQuizCreated}
        />

        {/* Existing Quiz Cards */}
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => <LessonCardNew key={quiz.id} quizData={quiz} />)
        ) : (
          <div className="col-span-1 text-center text-muted-foreground">
            No existing quizzes
          </div>
        )}
      </div>
    </main>
  );
}
