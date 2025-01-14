'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [comprehensionLevel, setComprehensionLevel] = useState('college')
  const [contentLength, setContentLength] = useState('medium')
  const [tone, setTone] = useState('friendly')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateResponse = async (prompt) => {
    setIsLoading(true)
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      const result = await model.generateContent(prompt)
      setAiResponse(result.response.text())
    } catch (error) {
      console.error('Error generating AI response:', error)
      setAiResponse('Sorry, there was an error generating the response.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const prompt = `Generate a ${contentLength} response in a ${tone} tone for a ${comprehensionLevel} audience: ${message}`;
      console.log('Sending message:', message)
      generateResponse(prompt)
      setMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <Label htmlFor="comprehension">Comprehension</Label>
          <Select
            onValueChange={setComprehensionLevel}
            value={comprehensionLevel}
          >
            <SelectTrigger id="comprehension">
              <SelectValue placeholder="Select comprehension level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="layman">Layman</SelectItem>
              <SelectItem value="highSchool">High School</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col flex-1">
          <Label htmlFor="length">Length</Label>
          <Select onValueChange={setContentLength} value={contentLength}>
            <SelectTrigger id="length">
              <SelectValue placeholder="Select content length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col flex-1">
          <Label htmlFor="tone">Tone</Label>
          <Select onValueChange={setTone} value={tone}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="informal">Informal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chat Box */}
      <Card className="flex-grow p-4 overflow-y-auto bg-gray-800 text-white">
        <p className="text-gray-400">Chat messages will appear here</p>
        {aiResponse && (
          <ReactMarkdown className="text-white">{aiResponse}</ReactMarkdown>
        )}
        {isLoading && <p className="text-gray-400">Loading...</p>}
      </Card>

      {/* Input and Send Button */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow bg-gray-700 text-white placeholder-gray-400"
        />
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
