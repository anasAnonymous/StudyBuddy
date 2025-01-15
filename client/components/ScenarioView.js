"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ScenarioView() {
  const [scenarioType, setScenarioType] = useState("")
  const [scenario, setScenario] = useState(null)
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [feedback, setFeedback] = useState("")
  const [showResults, setShowResults] = useState(false)

  const generateScenarioWithGemini = async (type) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY4)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Generate a ${type} business scenario with a title, description, and 3 questions for analysis.
    Format your response as JSON like this:
    {
      "title": "Scenario Title",
      "description": "Detailed scenario description...",
      "questions": [
        "Question 1?",
        "Question 2?",
        "Question 3?"
      ]
    }
    Make the scenario challenging but realistic, focusing on ${type}.`

    const result = await model.generateContent(prompt)
    const scenarioText = await result.response.text()
    
    const jsonMatch = scenarioText.match(/\`\`\`json\s*(\{[\s\S]*?\})\s*\`\`\`/) || 
                      scenarioText.match(/(\{[\s\S]*?\})/)
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (error) {
        console.error('Error parsing JSON:', error)
        throw new Error('Failed to parse scenario JSON')
      }
    } else {
      console.error('No valid JSON found in the response')
      throw new Error('Invalid scenario format received')
    }
  }

  const evaluateResponsesWithGemini = async (scenario, responses) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY4)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Evaluate these responses to the following ${scenarioType} business scenario:

    Scenario: ${scenario.title}
    ${scenario.description}

    ${scenario.questions.map((q, i) => `
    Question ${i + 1}: ${q}
    Response: ${responses[i]}
    `).join('\n')}

    Provide a detailed evaluation of each response, highlighting strengths and areas for improvement.
    Also give an overall assessment of the analysis and problem-solving skills demonstrated, considering the specific context of a ${scenarioType} scenario.`

    const result = await model.generateContent(prompt)
    return await result.response.text()
  }

  const handleGenerateScenario = async () => {
    if (!scenarioType) {
      setError("Please select a scenario type before generating.")
      return
    }

    setIsLoading(true)
    setError("")
    setScenario(null)
    setResponses([])

    try {
      const newScenario = await generateScenarioWithGemini(scenarioType)
      setScenario(newScenario)
      setResponses(new Array(newScenario.questions.length).fill(''))
    } catch (error) {
      console.error('Error generating scenario:', error)
      setError(error.message || "Failed to generate scenario. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)
  }

  const handleSubmitResponses = async () => {
    if (!scenario) return
    setIsLoading(true)

    try {
      const evaluation = await evaluateResponsesWithGemini(scenario, responses)
      setFeedback(evaluation)
      setShowResults(true)
    } catch (error) {
      console.error('Error evaluating responses:', error)
      setError("Failed to evaluate responses. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <Label htmlFor="scenario-type">Select Scenario Type</Label>
        <Select onValueChange={setScenarioType} value={scenarioType}>
          <SelectTrigger id="scenario-type" className="w-full">
            <SelectValue placeholder="Choose a scenario type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strategic planning">Strategic Planning</SelectItem>
            <SelectItem value="ethical dilemma">Ethical Dilemma</SelectItem>
            <SelectItem value="crisis management">Crisis Management</SelectItem>
            <SelectItem value="innovation challenge">Innovation Challenge</SelectItem>
            <SelectItem value="leadership decision">Leadership Decision</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleGenerateScenario}
          disabled={isLoading || !scenarioType}
          className="w-full"
        >
          {isLoading && !scenario ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Scenario
            </>
          ) : (
            'Generate New Scenario'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scenario && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">{scenario.title}</h2>
          <Card className="p-6">
            <ScrollArea className="h-[60vh]">
              <p className="mb-6">{scenario.description}</p>
              <div className="space-y-8">
                {scenario.questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {`${index + 1}. ${question}`}
                    </h3>
                    <Textarea
                      className="w-full"
                      rows={4}
                      value={responses[index]}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                      placeholder="Type your response here..."
                    />
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleSubmitResponses}
              disabled={responses.some(r => !r.trim()) || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating
                </>
              ) : (
                'Submit Responses'
              )}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback on Your Responses</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-lg font-semibold">Scenario: {scenario?.title}</p>
            <div className="whitespace-pre-wrap">{feedback}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

