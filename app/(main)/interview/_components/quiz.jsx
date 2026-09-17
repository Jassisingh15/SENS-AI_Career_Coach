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

      // match option letter (A, B, C, D)
      if (answer?.[0] === correctAnswer) {
        correct++;
      }
    });

    return (correct / quizData.questions.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();

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

      setQuizResult({
        questions: formattedQuestions,
        quizScore: score,
      });

      toast.success("Quiz completed!");
    } catch (error) {
      console.log(error);

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
      industry: "finance",
    });
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="#7C3AED" />;
  }

  // RESULT SCREEN
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
      <Card className="mx-2 border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-white">Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">
            This quiz contains 10 tailored questions specific to your industry and role requirements.
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
            size="lg"
          >
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <Card className="mx-2 border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          Question {currentQuestion + 1} of {quizData.questions.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-lg font-semibold text-slate-100">{question.question}</p>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                answers[currentQuestion] === option
                  ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="text-slate-200 cursor-pointer font-normal text-sm leading-relaxed"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-slate-950/70 border border-white/10 rounded-xl backdrop-blur-md">
            <p className="font-semibold text-indigo-300 mb-1">Explanation:</p>
            <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t border-white/10">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="secondary"
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