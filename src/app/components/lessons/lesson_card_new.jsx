"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function LessonCardNew({ quizData }) {
  const [isActive, setActive] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Changed to object to store all answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

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

  const handleSubmitQuiz = () => {
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

    setScore({
      correct: correctAnswers,
      total: totalQuestions,
      percentage: scorePercentage,
    });
    setIsSubmitted(true);
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
    <Card className="border-8 border-border transition-all duration-500 overflow-hidden">
      <CardHeader className="pt-4 group">
        <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
          <LessonButton title={"Insert Title"} isLocked={false} />
        </CardTitle>
      </CardHeader>
    </Card>
  );

  const ExpandedCard = () => (
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
  );

  return (
    <div className="">{isActive ? <ExpandedCard /> : <CollapsedCard />}</div>
  );
}
