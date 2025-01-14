"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockScenario = {
  title: "Data Breach at TechCorp",
  description: "TechCorp, a mid-sized software company, has just discovered that their customer database has been breached. The database contains sensitive information including names, email addresses, and encrypted passwords of over 100,000 users. The breach was detected when an employee noticed unusual activity in the system logs.",
  questions: [
    "What immediate steps should TechCorp take to address this situation?",
    "How should TechCorp communicate this breach to their customers?",
    "What long-term measures can TechCorp implement to prevent future breaches?"
  ]
}

export default function ScenarioView() {
  const [responses, setResponses] = useState(new Array(mockScenario.questions.length).fill(''))

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)
  }

  return (
    <div className="h-full flex flex-col">
      <h4 className="mb-4">Scenario: {mockScenario.title}</h4>
      <Card className="p-4 mb-4 bg-background">
        <p>{mockScenario.description}</p>
      </Card>
      <ScrollArea className="flex-grow">
        {mockScenario.questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="mb-4"
          >
            <h6 className="mb-2">{question}</h6>
            <Textarea
              className="w-full"
              rows={3}
              value={responses[index]}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              placeholder="Type your response here..."
            />
          </motion.div>
        ))}
      </ScrollArea>
      <div className="flex justify-between mt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="default">Generate New Scenario</Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="secondary">Submit Responses</Button>
        </motion.div>
      </div>
    </div>
  )
}

