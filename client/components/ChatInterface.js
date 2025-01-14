'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [comprehensionLevel, setComprehensionLevel] = useState('college')
  const [contentLength, setContentLength] = useState('medium')
  const [tone, setTone] = useState('friendly')

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
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
      <Card className="flex-grow p-4 overflow-y-auto">
        <p className="text-gray-500">Chat messages will appear here</p>
      </Card>

      {/* Input and Send Button */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
