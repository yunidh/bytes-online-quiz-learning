"use client";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "/lib/firebase";
import { UserAuth } from "@/app/context/AuthContext";
import { checkForNewAchievements } from "@/lib/achievementUtils";
import { recordQuizCompletion } from "@/lib/statsUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Lock, Unlock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function LessonCardNew({ quizData, onEditQuiz, onDeleteQuiz }) {
  const [isActive, setActive] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Changed to object to store all answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Get current user from AuthContext
  const { user } = UserAuth();

  // Fallback to placeholder data if no quiz data is provided
  const defaultQuizData = {
    title: "Loading...",
    questions: [
      {
        question: "Loading quiz data...",
        options: ["Please wait", "Loading", "...", "..."],
        correctAnswer: "Please wait",
      },
    ],
  };

  const activeQuizData = quizData || defaultQuizData;

  // Reset state when quiz data changes
  useEffect(() => {
    setActive(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setScore(null);
  }, [quizData]);

  const handleEditQuiz = () => {
    if (onEditQuiz) {
      onEditQuiz(activeQuizData);
    }
  };

  const handleDeleteQuiz = () => {
    if (onDeleteQuiz) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${activeQuizData.title}"? This action cannot be undone.`
      );
      if (confirmDelete) {
        onDeleteQuiz(activeQuizData);
      }
    }
  };

  const showLesson = () => {
    setActive((prevActive) => !prevActive);
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctAnswers = 0;
    activeQuizData.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
      }
    });

    const totalQuestions = activeQuizData.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    const scoreData = {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: scorePercentage,
    };

    setScore(scoreData);
    setIsSubmitted(true);

    // Save quiz result to Firestore for stats tracking
    if (user?.uid) {
      try {
        const quizResultsRef = collection(db, "users", user.uid, "quizResults");
        await addDoc(quizResultsRef, {
          quizTitle: activeQuizData.title,
          score: scoreData,
          answers: selectedAnswers,
          completedAt: new Date(),
          quizId: activeQuizData.id || "unknown",
        });

        // Update user stats using the new stats system
        await recordQuizCompletion(user.uid, correctAnswers, totalQuestions);

        // Check and update achievements
        await checkForNewAchievements(user.uid);
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setScore(null);
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = activeQuizData.questions.every(
    (_, index) => selectedAnswers[index] !== undefined
  );

  // Check if current question is the last one
  const isLastQuestion =
    currentQuestionIndex === activeQuizData.questions.length - 1;

  const LessonButton = ({ isLocked }) => {
    // Limit title to 18 characters
    const truncatedTitle =
      activeQuizData.title.length > 18
        ? activeQuizData.title.substring(0, 18) + "..."
        : activeQuizData.title;

    return (
      <Button
        disabled={false}
        onClick={showLesson}
        variant="outline"
        className="text-3xl group center font-semibold flex-grow p-10 m-0 hover:scale-105 transition-transform duration-300"
      >
        <div className="group-hover:heading-gradient transition- duration-300">
          {truncatedTitle}
        </div>
      </Button>
    );
  };

  const QuizSection = () => {
    const currentQuestion = activeQuizData.questions[currentQuestionIndex];
    const currentSelectedAnswer = selectedAnswers[currentQuestionIndex];
    const isQuestionAnswered = currentSelectedAnswer !== undefined;

    return (
      <CardContent className=" space-y-4">
        <p className="text-center font-bold text-muted-foreground">
          Question {currentQuestionIndex + 1} of{" "}
          {activeQuizData.questions.length}
        </p>
        <Separator />

        <div className="space-y-4">
          <h4 className="text-lg font-medium">{currentQuestion.question}</h4>

          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  currentSelectedAnswer === option ? "default" : "outline"
                }
                className={`p-3 text-left justify-start transition-colors duration-200 ${
                  currentSelectedAnswer === option
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isQuestionAnswered} // Disable all buttons once an answer is selected
              >
                {option}
              </Button>
            ))}
          </div>

          {currentSelectedAnswer && !isSubmitted && (
            <div className="text-center space-y-2">
              <p
                className={`text-sm font-medium ${
                  currentSelectedAnswer === currentQuestion.correctAnswer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currentSelectedAnswer === currentQuestion.correctAnswer
                  ? "Correct!"
                  : `Incorrect`}
              </p>
            </div>
          )}

          {isSubmitted && (
            <div className="text-center space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h4 className="text-lg font-semibold">Quiz Completed!</h4>
              <p className="text-sm">
                Question {currentQuestionIndex + 1}:{" "}
                {currentSelectedAnswer === currentQuestion.correctAnswer
                  ? "✅ Correct"
                  : "❌ Incorrect"}
              </p>
              {currentSelectedAnswer !== currentQuestion.correctAnswer && (
                <p className="text-xs text-muted-foreground">
                  Correct answer: {currentQuestion.correctAnswer}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {isSubmitted && (
                <Button
                  variant="outline"
                  onClick={handleResetQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Reset Quiz
                </Button>
              )}

              {isLastQuestion && allQuestionsAnswered && !isSubmitted ? (
                <Button
                  onClick={handleSubmitQuiz}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestionIndex === activeQuizData.questions.length - 1
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    );
  };

  const CollapsedCard = () => (
    <div className="relative group">
      <Card className="border-8 border-border transition-all duration-500 overflow-hidden">
        <CardHeader className="pt-4 group">
          <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
            <LessonButton title={"Insert Title"} isLocked={false} />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Edit/Delete buttons for custom quizzes - Hovering flags */}
      {activeQuizData.isCustom && !activeQuizData.isDefault && (
        <div className="absolute left-0 top-6 transform -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditQuiz}
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeleteQuiz}
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const ExpandedCard = () => (
    <div className="relative group">
      <Card className="border-8 border-border transition-all duration-500">
        <CardHeader className="pt-4 group pb-0">
          <CardTitle className="group z-0 font-firacode tracking-wide">
            <div className="flex justify-center mb-2">
              <LessonButton title={"Insert Title"} isLocked={false} />
            </div>
          </CardTitle>
          <div className="font-firacode flex justify-center">
            {score && (
              <div className="flex items-center gap-4 text-lg font-bold">
                <div>
                  Score: {score.correct}/{score.total}
                </div>
                <div
                  className={`${
                    score.percentage >= 70
                      ? "text-green-600"
                      : score.percentage >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {score.percentage}%
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <QuizSection />
      </Card>

      {/* Edit/Delete buttons for custom quizzes - Hovering flags */}
      {activeQuizData.isCustom && !activeQuizData.isDefault && (
        <div className="absolute left-0 top-6 transform -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditQuiz}
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeleteQuiz}
              className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="">{isActive ? <ExpandedCard /> : <CollapsedCard />}</div>
  );
}
