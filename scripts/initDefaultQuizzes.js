// Script to initialize default quizzes (Python and JavaScript)
// Run this once to set up the default quizzes in Firestore

import { db } from "../lib/firebase.js";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

// Helper function to create a document ID from title
function createDocumentId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Default Python Quiz
const pythonQuiz = {
  title: "Python",
  isDefault: true,
  createdAt: new Date(),
  questions: [
    {
      question: "What is the correct file extension for Python files?",
      options: [".py", ".python", ".pyt", ".pt"],
      correctAnswer: ".py",
    },
    {
      question:
        "Which of the following is used to define a function in Python?",
      options: ["function", "def", "define", "func"],
      correctAnswer: "def",
    },
    {
      question: "What will be the output of print(2 ** 3)?",
      options: ["6", "8", "9", "5"],
      correctAnswer: "8",
    },
    {
      question: "Which of the following is a mutable data type in Python?",
      options: ["tuple", "string", "list", "integer"],
      correctAnswer: "list",
    },
    {
      question: "What does the len() function do?",
      options: [
        "Returns the length of an object",
        "Returns the type of an object",
        "Returns the value of an object",
        "Returns the name of an object",
      ],
      correctAnswer: "Returns the length of an object",
    },
  ],
};

// Default JavaScript Quiz
const javascriptQuiz = {
  title: "JavaScript",
  isDefault: true,
  createdAt: new Date(),
  questions: [
    {
      question:
        "Which of the following is the correct way to declare a variable in JavaScript?",
      options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
      correctAnswer: "var myVar;",
    },
    {
      question: "What does '===' operator do in JavaScript?",
      options: [
        "Compares value only",
        "Compares type only",
        "Compares both value and type",
        "Assigns value",
      ],
      correctAnswer: "Compares both value and type",
    },
    {
      question:
        "Which method is used to add an element to the end of an array?",
      options: ["push()", "add()", "append()", "insert()"],
      correctAnswer: "push()",
    },
    {
      question: "What will be the output of console.log(typeof null)?",
      options: ["null", "undefined", "object", "string"],
      correctAnswer: "object",
    },
    {
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["number", "string", "boolean", "float"],
      correctAnswer: "float",
    },
  ],
};

// Function to add default quizzes
async function initializeDefaultQuizzes() {
  try {
    // Create document IDs from titles
    const pythonDocId = createDocumentId(pythonQuiz.title); // "python-fundamentals"
    const jsDocId = createDocumentId(javascriptQuiz.title); // "javascript-basics"

    console.log(`📝 Python quiz will be saved with ID: ${pythonDocId}`);
    console.log(`📝 JavaScript quiz will be saved with ID: ${jsDocId}`);

    // Check if Python quiz already exists
    const pythonDocRef = doc(db, "courses", pythonDocId);
    const pythonDoc = await getDoc(pythonDocRef);

    if (!pythonDoc.exists()) {
      await setDoc(pythonDocRef, pythonQuiz);
      console.log("✅ Python quiz added successfully!");
    } else {
      console.log("ℹ️ Python quiz already exists");
    }

    // Check if JavaScript quiz already exists
    const jsDocRef = doc(db, "courses", jsDocId);
    const jsDoc = await getDoc(jsDocRef);

    if (!jsDoc.exists()) {
      await setDoc(jsDocRef, javascriptQuiz);
      console.log("✅ JavaScript quiz added successfully!");
    } else {
      console.log("ℹ️ JavaScript quiz already exists");
    }

    console.log("🎉 Default quizzes initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing default quizzes:", error);
  }
}

// Run the initialization
initializeDefaultQuizzes();
