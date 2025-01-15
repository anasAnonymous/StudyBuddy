"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestView() {
  const [topic, setTopic] = useState("")
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const getQuestionsFromGemini = async (topic) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY4)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Generate 5 quiz questions about ${topic}. 
    Only provide the questions, numbered 1-5. 
    Make them challenging but clear. 
    Only return the numbered questions, nothing else.`

    const result = await model.generateContent(prompt)
    const questions = await result.response.text()
    
    return questions.split('\n')
      .filter(q => q.trim())
      .map(q => q.replace(/^\d+\.\s*/, ''))
      .slice(0, 5)
  }

  const getOptionsFromGemini = async (question) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY4)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `For this question: "${question}"
    Generate 4 options where only one is correct.
    Format your response exactly like this:
    A) First option
    B) Second option [CORRECT]
    C) Third option
    D) Fourth option
    
    Include [CORRECT] after the correct answer.
    Only provide the options, nothing else.`

    const result = await model.generateContent(prompt)
    const optionsText = await result.response.text()
    
    const options = optionsText.split('\n')
      .filter(o => o.trim())
      .map(o => o.replace(/^[A-D]\)\s*/, ''))

    const correctIndex = options.findIndex(o => o.includes('[CORRECT]'))
    const cleanOptions = options.map(o => o.replace(' [CORRECT]', ''))

    return {
      options: cleanOptions,
      correctAnswer: correctIndex
    }
  }

  const evaluateQuizWithGemini = async (questions, userAnswers, correctAnswers) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY4)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const answersData = questions.map((q, i) => ({
      question: q,
      userAnswer: userAnswers[i],
      correctAnswer: correctAnswers[i]
    }))

    const prompt = `Evaluate these quiz answers:
    ${answersData.map((a, i) => `
    Question ${i + 1}: ${a.question}
    User's Answer: ${a.userAnswer}
    Correct Answer: ${a.correctAnswer}
    `).join('\n')}

    For each question, provide:
    1. Whether it's correct or incorrect
    2. A brief explanation why
    
    Also provide the total score out of ${questions.length}.`

    const result = await model.generateContent(prompt)
    const evaluation = await result.response.text()

    return evaluation
  }

  const generateQuiz = async (topic) => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setIsLoading(true)
    setError("")
    setQuiz(null)

    try {
      // Get questions first
      const questions = await getQuestionsFromGemini(topic)
      
      // Get options for each question
      const fullQuestions = await Promise.all(
        questions.map(async (question) => {
          const { options, correctAnswer } = await getOptionsFromGemini(question)
          return {
            question,
            options,
            correctAnswer
          }
        })
      )

      setQuiz({
        title: `Quiz: ${topic}`,
        questions: fullQuestions
      })
      setAnswers(new Array(fullQuestions.length).fill(-1))
      
    } catch (error) {
      console.error('Error generating quiz:', error)
      setError("Failed to generate quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (!quiz) return
    setIsLoading(true)

    try {
      const evaluation = await evaluateQuizWithGemini(
        quiz.questions.map(q => q.question),
        answers.map((answerIndex, qIndex) => quiz.questions[qIndex].options[answerIndex]),
        quiz.questions.map(q => q.options[q.correctAnswer])
      )

      // Calculate actual score by comparing user answers with correct answers
      const actualScore = quiz.questions.reduce((score, question, index) => {
        return score + (answers[index] === question.correctAnswer ? 1 : 0)
      }, 0)

      setScore(actualScore)
      setFeedback(evaluation.split('\n').filter(line => line.trim()))
      setShowResults(true)
      setDialogOpen(true)
    } catch (error) {
      console.error('Error evaluating quiz:', error)
      setError("Failed to evaluate quiz. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetQuiz = () => {
    setShowResults(false)
    setAnswers(new Array(quiz?.questions?.length || 0).fill(-1))
    setScore(null)
    setFeedback([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); generateQuiz(topic); }} className="space-y-4">
        <div className="flex gap-4">
          <Input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Enter quiz topic (e.g., 'Ancient Rome', 'Machine Learning')" 
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {quiz ? 'Evaluating' : 'Generating'}
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {quiz && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">{quiz.title}</h2>
          <Card className="p-6">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-8">
                {quiz.questions.map((question, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {`${qIndex + 1}. ${question.question}`}
                    </h3>
                    <RadioGroup
                      value={answers[qIndex]?.toString()}
                      onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                      className="space-y-3"
                    >
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={oIndex.toString()} 
                            id={`q${qIndex}-o${oIndex}`}
                            disabled={showResults}
                          />
                          <Label 
                            htmlFor={`q${qIndex}-o${oIndex}`}
                            className={`${
                              showResults
                                ? oIndex === question.correctAnswer
                                  ? "text-green-600 font-medium"
                                  : answers[qIndex] === oIndex
                                  ? "text-red-600"
                                  : ""
                                : ""
                            }`}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {showResults && feedback[qIndex] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-sm text-muted-foreground"
                      >
                        {feedback[qIndex]}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={showResults ? resetQuiz : handleSubmit}
              disabled={(!showResults && answers.includes(-1)) || isLoading}
              className="w-40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                showResults ? 'Try Again' : 'Submit Quiz'
              )}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Results</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold">
              Your Score: {score} / {quiz?.questions?.length}
              <span className="text-lg ml-2">
                ({((score / quiz?.questions?.length) * 100).toFixed(1)}%)
              </span>
            </p>
            <p className="text-muted-foreground">
              Review your answers above to see detailed feedback for each question.
            </p>
            <Button onClick={resetQuiz}>Try New Quiz</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
