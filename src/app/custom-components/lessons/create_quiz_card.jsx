"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import { UserAuth } from "@/app/context/AuthContext";
import { checkForNewAchievements } from "@/lib/achievementUtils";
import { recordQuizCreation } from "@/lib/statsUtils";
import { Separator } from "@/components/ui/separator";

// Helper function to create a document ID from title
function createDocumentId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export const CreateQuizCard = memo(function CreateQuizCard({ onQuizCreated }) {
  const [isActive, setActive] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // Get current user from AuthContext
  const { user } = UserAuth();

  const showCreateQuiz = useCallback(() => {
    setActive(!isActive);
  }, [isActive]);

  const handleQuestionChange = useCallback(
    (value) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex].question = value;
        return updated;
      });
    },
    [currentQuestionIndex]
  );

  const handleOptionChange = useCallback(
    (optionIndex, value) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex].options[optionIndex] = value;
        return updated;
      });
    },
    [currentQuestionIndex]
  );

  const handleCorrectAnswerChange = useCallback(
    (value) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex].correctAnswer = value;
        return updated;
      });
    },
    [currentQuestionIndex]
  );

  const addNewQuestion = useCallback(() => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const discardQuiz = useCallback(() => {
    setQuizTitle("");
    setQuestions([
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
    setCurrentQuestionIndex(0);
    setActive(false);
  }, []);

  const saveQuiz = useCallback(async () => {
    if (!quizTitle.trim()) {
      toast("❌ Please enter a quiz title", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
      return;
    }

    // Validate current question
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion.question.trim()) {
      toast("❌ Please enter a question", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
      return;
    }

    if (currentQuestion.options.some((option) => !option.trim())) {
      toast("❌ Please fill all options", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
      return;
    }

    if (!currentQuestion.correctAnswer.trim()) {
      toast("❌ Please select a correct answer", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
      return;
    }

    setIsSaving(true);

    try {
      // Create user-specific collection path
      const userQuizzesCollection = collection(
        db,
        "users",
        user.uid,
        "quizzes"
      );

      // Create document ID from quiz title
      const quizDocId = createDocumentId(quizTitle);
      const quizRef = doc(userQuizzesCollection, quizDocId);

      // Check if quiz with same title exists for this user
      const existingQuizDoc = await getDoc(quizRef);

      if (existingQuizDoc.exists()) {
        // Add questions to existing quiz
        await updateDoc(quizRef, {
          questions: arrayUnion(...questions),
        });
        toast("✅ Questions added to existing quiz!", {
          style: {
            fontSize: "1.2rem",
            padding: "16px 24px",
            borderRadius: "8px",
          },
        });
      } else {
        // Create new quiz for this user
        const quizData = {
          title: quizTitle,
          questions: questions,
          createdAt: new Date(),
          createdBy: user.uid,
          authorName: user.displayName || user.email,
          isCustom: true, // Mark as custom quiz
        };
        await setDoc(quizRef, quizData);

        // Update user stats for quiz creation
        await recordQuizCreation(user.uid);

        toast("🎉 Quiz created successfully!", {
          style: {
            fontSize: "1.2rem",
            padding: "16px 24px",
            borderRadius: "8px",
          },
        });
      }

      // Check and award achievements
      await checkForNewAchievements(user.uid);

      // Reset form
      discardQuiz();

      // Notify parent to refresh quiz list
      if (onQuizCreated) {
        onQuizCreated();
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast("💥 Error saving quiz. Please try again.", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    quizTitle,
    questions,
    currentQuestionIndex,
    discardQuiz,
    onQuizCreated,
    user.displayName,
    user.email,
    user.uid,
  ]);

  // Move current question outside to avoid recalculation
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="">
      {/* <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div> */}
      {isActive ? (
        <Card className="border-4 sm:border-8 border-border transition-all duration-500">
          <CardHeader className="pt-4 pb-0 group">
            <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
              <Button
                onClick={showCreateQuiz}
                variant="outline"
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl group font-semibold flex-grow p-4 sm:p-6 md:p-8 lg:p-10 m-0 hover:scale-105 transition-transform duration-300 border-dashed border-2"
              >
                <div className="group-hover:heading-gradient transition-all duration-300 flex items-center gap-1 sm:gap-2 text-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 flex-shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Create a Quiz
                  </span>
                </div>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-ml font-bold text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Separator />

            {/* Quiz Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quiz Title</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title..."
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Question */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                placeholder="Enter your question..."
                className="w-full p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}...`}
                    className="flex-1 p-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant={
                      currentQuestion.correctAnswer === option
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleCorrectAnswerChange(option)}
                    className="whitespace-nowrap"
                  >
                    {currentQuestion.correctAnswer === option ? "✓" : "Set"}
                  </Button>
                </div>
              ))}
            </div>

            {/* Navigation & Actions */}
            <div className="space-y-4 pt-4">
              {/* Navigation Row */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={addNewQuestion}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
                <Button
                  variant="outline"
                  onClick={discardQuiz}
                  className="flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Discard
                </Button>
                <Button
                  onClick={saveQuiz}
                  disabled={isSaving}
                  className="flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Quiz"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-4 sm:border-8 border-border transition-all duration-500 h-[] overflow-hidden border-dashed">
          <CardHeader className="pt-4 group">
            <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
              <Button
                onClick={showCreateQuiz}
                variant="outline"
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl group font-semibold flex-grow p-4 sm:p-6 md:p-8 lg:p-10 m-0 hover:scale-105 transition-transform duration-300 border-dashed border-2"
              >
                <div className="group-hover:heading-gradient transition-all duration-300 flex items-center gap-1 sm:gap-2 text-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 flex-shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Create a Quiz
                  </span>
                </div>
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
});
