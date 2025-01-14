"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const mockTest = {
  title: "Cybersecurity Fundamentals Quiz",
  questions: [
    {
      question: "What is the primary purpose of a firewall?",
      options: [
        "To prevent physical access to a computer",
        "To monitor and control incoming and outgoing network traffic",
        "To encrypt all data on a hard drive",
        "To scan for viruses in email attachments"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of the following is NOT a common type of cyber attack?",
      options: [
        "Phishing",
        "Denial of Service (DoS)",
        "Man-in-the-Middle",
        "Quantum Tunneling"
      ],
      correctAnswer: 3
    },
    {
      question: "What does the term 'encryption' refer to in cybersecurity?",
      options: [
        "The process of compressing data to save storage space",
        "The method of deleting sensitive information securely",
        "The technique of converting data into a code to prevent unauthorized access",
        "The practice of backing up data to multiple locations"
      ],
      correctAnswer: 2
    }
  ]
}

export default function TestView() {
  const [answers, setAnswers] = useState(new Array(mockTest.questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === mockTest.questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  return (
    <div className="h-full flex flex-col">
      <h4 className="mb-4">{mockTest.title}</h4>
      <Card className="p-4 mb-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {mockTest.questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.2 }}
              className="mb-8"
            >
              <h6 className="mb-2">{`${qIndex + 1}. ${question.question}`}</h6>
              <RadioGroup
                value={answers[qIndex].toString()}
                onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                className="space-y-2"
              >
                <AnimatePresence>
                  {question.options.map((option, oIndex) => (
                    <motion.div
                      key={oIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: oIndex * 0.1 }}
                    >
                      <div className="flex items-center space-x-2">
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
                                ? "text-green-500"
                                : answers[qIndex] === oIndex
                                ? "text-red-500"
                                : ""
                              : ""
                          }`}
                        >
                          {option}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </RadioGroup>
            </motion.div>
          ))}
        </ScrollArea>
      </Card>
      <div className="flex justify-between">
        {!showResults ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleSubmit} 
              disabled={answers.includes(-1)}
            >
              Submit Test
            </Button>
          </motion.div>
        ) : (
          <>
            <h6 className="text-primary">
              Your Score: {calculateScore()} / {mockTest.questions.length}
            </h6>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => {
                  setShowResults(false);
                  setAnswers(new Array(mockTest.questions.length).fill(-1));
                }}
              >
                Retake Test
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

