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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "/lib/firebase";
import { toast } from "react-hot-toast";
import { UserAuth } from "@/app/context/AuthContext";
import { checkForNewAchievements } from "@/lib/achievementUtils";

export const EditQuizCard = memo(function EditQuizCard({
  quizData,
  onQuizUpdated,
  onCancel,
}) {
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
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = UserAuth();

  // Initialize form with quiz data
  useEffect(() => {
    if (quizData) {
      setQuizTitle(quizData.title || "");
      setQuestions(quizData.questions || []);
      setCurrentQuestionIndex(0);
    }
  }, [quizData]);

  const updateQuestion = useCallback((index, field, value) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      if (field === "options") {
        newQuestions[index][field] = value;
      } else {
        newQuestions[index][field] = value;
      }
      return newQuestions;
    });
  }, []);

  const updateOption = useCallback((questionIndex, optionIndex, value) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[questionIndex].options[optionIndex] = value;
      return newQuestions;
    });
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  }, [questions.length]);

  const removeQuestion = useCallback(() => {
    if (questions.length > 1) {
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions.splice(currentQuestionIndex, 1);
        return newQuestions;
      });
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  }, [questions.length, currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const exitQuiz = useCallback(() => {
    onCancel();
  }, [onCancel]);

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
      // Update the existing quiz document
      const quizRef = doc(db, "users", user.uid, "quizzes", quizData.id);

      const updatedQuizData = {
        title: quizTitle,
        questions: questions,
        updatedAt: new Date(),
      };

      await updateDoc(quizRef, updatedQuizData);

      toast("✅ Quiz updated successfully!", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });

      // Check and award achievements
      await checkForNewAchievements(user.uid);

      // Notify parent to refresh quiz list
      if (onQuizUpdated) {
        onQuizUpdated();
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast("💥 Error updating quiz. Please try again.", {
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
    onQuizUpdated,
    user.uid,
    quizData.id,
  ]);

  const deleteQuiz = useCallback(async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const quizRef = doc(db, "users", user.uid, "quizzes", quizData.id);
      await deleteDoc(quizRef);

      toast("🗑️ Quiz deleted successfully!", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });

      // Notify parent to refresh quiz list
      if (onQuizUpdated) {
        onQuizUpdated();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast("💥 Error deleting quiz. Please try again.", {
        style: {
          fontSize: "1.2rem",
          padding: "16px 24px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsDeleting(false);
    }
  }, [quizTitle, onQuizUpdated, user?.uid, quizData.id]);

  // Move current question outside to avoid recalculation
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Edit Quiz</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={exitQuiz}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quiz Title */}
        <div className="space-y-2">
          <label htmlFor="quiz-title" className="text-sm font-medium">
            Quiz Title
          </label>
          <input
            id="quiz-title"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Question Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-2">
          <label htmlFor="question" className="text-sm font-medium">
            Question
          </label>
          <textarea
            id="question"
            value={currentQuestion.question}
            onChange={(e) =>
              updateQuestion(currentQuestionIndex, "question", e.target.value)
            }
            placeholder="Enter your question"
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Answer Options</label>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  updateOption(currentQuestionIndex, index, e.target.value)
                }
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                variant={
                  currentQuestion.correctAnswer === option
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  updateQuestion(currentQuestionIndex, "correctAnswer", option)
                }
              >
                {currentQuestion.correctAnswer === option ? "✓" : "Set"}
              </Button>
            </div>
          ))}
        </div>

        {/* Question Management */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={addQuestion} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          {questions.length > 1 && (
            <Button
              variant="outline"
              onClick={removeQuestion}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Remove Question
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={exitQuiz} variant="outline" className="flex-1">
          Exit
        </Button>
        <Button
          onClick={deleteQuiz}
          variant="destructive"
          className="flex-1"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Quiz"}
        </Button>
        <Button onClick={saveQuiz} disabled={isSaving} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
});
