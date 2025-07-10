import { LessonCard } from "../components/lessons/lesson_card_unlocked";
import { LessonCardNew } from "../components/lessons/lesson_card_new";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
export const metadata = {
  title: "List of Courses",
};

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

export default async function courses() {
  // Fetch all quiz data from Firestore
  const quizzes = await getQuizData();

  console.log("Fetched quizzes:", quizzes.length);

  return (
    <main className="mx-48 my-24">
      <div className="grid grid-cols-2 gap-8 gap-x-40">
        {/* <LessonCard
          courseTitle={"Insert Title"}
          courseId={"Insert Name"}
          alignment="justify-self-start"
        /> */}
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <LessonCardNew key={`${quiz.id}-${index}`} quizData={quiz} />
          ))
        ) : (
          <div className="col-span-2 text-center text-muted-foreground">
            No quizzes available
          </div>
        )}
      </div>
    </main>
  );
}
