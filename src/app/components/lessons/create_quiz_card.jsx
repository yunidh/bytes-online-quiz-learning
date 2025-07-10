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
} from "firebase/firestore";
import { db } from "/lib/firebase";

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
      alert("Please enter a quiz title");
      return;
    }

    // Validate current question
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion.question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (currentQuestion.options.some((option) => !option.trim())) {
      alert("Please fill all options");
      return;
    }

    if (!currentQuestion.correctAnswer.trim()) {
      alert("Please select a correct answer");
      return;
    }

    setIsSaving(true);

    try {
      // Check if quiz with same title exists
      const quizzesCollection = collection(db, "courses");
      const existingQuizQuery = await getDocs(quizzesCollection);
      let existingQuiz = null;

      existingQuizQuery.forEach((doc) => {
        if (doc.data().title === quizTitle) {
          existingQuiz = { id: doc.id, ...doc.data() };
        }
      });

      if (existingQuiz) {
        // Add questions to existing quiz
        const quizRef = doc(db, "courses", existingQuiz.id);
        await updateDoc(quizRef, {
          questions: arrayUnion(...questions),
        });
        alert("Questions added to existing quiz!");
      } else {
        // Create new quiz
        const quizData = {
          title: quizTitle,
          questions: questions,
        };
        await addDoc(collection(db, "courses"), quizData);
        alert("Quiz created successfully!");
      }

      // Reset form
      discardQuiz();

      // Notify parent to refresh quiz list
      if (onQuizCreated) {
        onQuizCreated();
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Error saving quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [quizTitle, questions, currentQuestionIndex, discardQuiz, onQuizCreated]);

  const CreateQuizButton = useCallback(
    () => (
      <Button
        onClick={showCreateQuiz}
        variant="outline"
        className="text-3xl group font-semibold flex-grow p-10 m-0 hover:scale-105 transition-transform duration-300 border-dashed border-2"
      >
        <div className="group-hover:heading-gradient transition-all duration-300 flex items-center gap-2">
          <Plus className="w-8 h-8" />
          Create a Quiz
        </div>
      </Button>
    ),
    [showCreateQuiz]
  );

  // Move current question outside to avoid recalculation
  const currentQuestion = questions[currentQuestionIndex];

  const CollapsedCard = useCallback(
    () => (
      <Card className="border-8 border-border transition-all duration-500 h-[] overflow-hidden border-dashed">
        <CardHeader className="pt-4 group">
          <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
            <CreateQuizButton />
          </CardTitle>
        </CardHeader>
      </Card>
    ),
    [CreateQuizButton]
  );

  const ExpandedCard = useCallback(
    () => (
      <Card className="border-8 border-border transition-all duration-500">
        <CardHeader className="pt-4 group">
          <CardTitle className="group z-0 text-center font-firacode tracking-wide flex">
            <CreateQuizButton />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Create New Quiz</h3>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

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
                  {currentQuestion.correctAnswer === option
                    ? "Correct"
                    : "Mark Correct"}
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
    ),
    [
      CreateQuizButton,
      currentQuestionIndex,
      questions.length,
      quizTitle,
      currentQuestion,
      handleQuestionChange,
      handleOptionChange,
      handleCorrectAnswerChange,
      goToPreviousQuestion,
      goToNextQuestion,
      addNewQuestion,
      discardQuiz,
      saveQuiz,
      isSaving,
    ]
  );

  return (
    <div className="">{isActive ? <ExpandedCard /> : <CollapsedCard />}</div>
  );
});
