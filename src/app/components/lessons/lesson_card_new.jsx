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
import { firaCode } from "@/app/layout";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonCardNew({ quizData }) {
  const [isActive, setActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Create a unique identifier for this component instance
  const [componentId] = useState(() => Math.random().toString(36).substr(2, 9));

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

  // Debug effect to track state changes
  useEffect(() => {
    console.log(
      `[${componentId}] Component ${activeQuizData.title} isActive changed to:`,
      isActive
    );
  }, [isActive, componentId, activeQuizData.title]);

  // Reset state when quiz data changes
  useEffect(() => {
    setActive(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
  }, [quizData]);

  const showLesson = () => {
    console.log(
      `[${componentId}] Toggling quiz for: ${activeQuizData.title}`,
      `Current state: ${isActive}`,
      `Will become: ${!isActive}`
    );
    setActive((prevActive) => {
      console.log(
        `[${componentId}] State changed from ${prevActive} to ${!prevActive}`
      );
      return !prevActive;
    });
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const LessonButton = ({ isLocked }) => {
    return (
      <Button
        disabled={false}
        onClick={showLesson}
        variant="outline"
        className="text-3xl group center font-semibold flex-grow p-10 m-0 hover:scale-105 transition-transform duration-300"
      >
        <div className="group-hover:heading-gradient transition- duration-300">
          {activeQuizData.title}
        </div>
      </Button>
    );
  };

  const QuizSection = () => {
    const currentQuestion = activeQuizData.questions[currentQuestionIndex];

    return (
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            {activeQuizData.title} Quiz
          </h3>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of{" "}
            {activeQuizData.questions.length}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium">{currentQuestion.question}</h4>

          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-3 text-left justify-start transition-colors duration-200 ${
                  selectedAnswer === option
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>

          {selectedAnswer && (
            <div className="text-center space-y-2">
              <p
                className={`text-sm font-medium ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? "Correct!"
                  : `Incorrect`}
              </p>
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
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={
                currentQuestionIndex === activeQuizData.questions.length - 1
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    );
  };

  const CollapsedCard = () => (
    <Card
      className="border-8 border-border transition-all duration-500 overflow-hidden"
      data-quiz-id={quizData?.id}
      data-component-id={componentId}
    >
      <CardHeader className="pt-4 group">
        <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
          <LessonButton title={"Insert Title"} isLocked={false} />
        </CardTitle>
      </CardHeader>
    </Card>
  );

  const ExpandedCard = () => (
    <Card
      className="border-8 border-border transition-all duration-500"
      data-quiz-id={quizData?.id}
      data-component-id={componentId}
    >
      <CardHeader className="pt-4 group">
        <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
          <LessonButton title={"Insert Title"} isLocked={false} />
        </CardTitle>
      </CardHeader>
      <QuizSection />
    </Card>
  );

  return (
    <div className="">{isActive ? <ExpandedCard /> : <CollapsedCard />}</div>
  );
}
