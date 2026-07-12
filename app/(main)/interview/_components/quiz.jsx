"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData?.questions) {
      setAnswers(new Array(quizData.questions.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
  let correct = 0;

  answers.forEach((answer, index) => {
    const correctAnswer = quizData.questions[index].correctAnswer;

    // 🔥 FIX: match option letter (A, B, C, D)
    if (answer?.[0] === correctAnswer) {
      correct++;
    }
  });

  return (correct / quizData.questions.length) * 100;
};

const finishQuiz = async () => {
  const score = calculateScore();

  // 🔥 IMPORTANT FIX (questions format karna)
  const formattedQuestions = quizData.questions.map((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer?.[0] === q.correctAnswer;

    return {
      question: q.question,
      userAnswer: userAnswer || "Not answered",
      answer: q.correctAnswer,
      explanation: q.explanation,
      isCorrect,
    };
  });

  try {
    await saveQuizResultFn(
      quizData.questions,
      answers,
      score
    );

    // ✅ result show
    setQuizResult({
      questions: formattedQuestions,
      quizScore: score,
    });

    toast.success("Quiz completed!");
  } catch (error) {
    console.log(error);

    // even if error → still show result
    setQuizResult({
      questions: formattedQuestions,
      quizScore: score,
    });

    toast.error("Saved locally");
  }
};

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setQuizResult(null);

    generateQuizFn({
  industry: "finance", // test
});
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // ✅ RESULT SCREEN (FIXED)
  if (quizResult) {
    return (
      <div className="mx-2">
        <QuizResult result={quizResult} onStartNew={startNewQuiz} />
      </div>
    );
  }

  // START SCREEN
  if (!quizData?.questions?.length) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and skills.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() =>
              generateQuizFn({
                industry: null,
                subfield: "Frontend Development",
              })
            }
            className="w-full"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.questions.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {currentQuestion < quizData.questions.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}