'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const comprehensionLevels = ["Layman", "High School", "College", "Expert"]
const contentLengths = ["Short", "Medium", "Long"]
const tones = ["Friendly", "Formal", "Informal"]

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [comprehensionLevelIndex, setComprehensionLevelIndex] = useState(0)
  const [contentLengthIndex, setContentLengthIndex] = useState(0)
  const [toneIndex, setToneIndex] = useState(0)
  const [chat, setChat] = useState([{user: 'ai', text: 'Hello! I am your Study Buddy. How can I help you today?'}])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generateResponse = async (prompt) => {
    setIsLoading(true)
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      const result = await model.generateContent(prompt)
      chat.push({ user: 'ai', text: result.response.text() })
      setChat(chat)
    } catch (error) {
      console.error('Error generating AI response:', error)
      setError('Sorry, there was an error generating the response. click to retry?');
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError('')
    const prompt = `Generate a ${contentLengths[contentLengthIndex]} response in a ${tones[toneIndex]} tone for a ${comprehensionLevels[comprehensionLevelIndex]} audience: ${chat[chat.length-1].message} prevoius messages: ${concatenateChat(chat)}`;
    console.log('Sending message:', message)
    chat.push({ user: 'user', text: message })
    setChat(chat)
    generateResponse(prompt)
  }
  const concatenateChat = (chat) => {
    let result = ''
    for (let i = 0; i < chat.length; i++) {
      result += chat[i].user + ': ' + chat[i].text + '\n'
    }
    return result
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const prompt = `Generate a ${contentLengths[contentLengthIndex]} response in a ${tones[toneIndex]} tone for a ${comprehensionLevels[comprehensionLevelIndex]} audience: ${message} prevoius messages: ${concatenateChat(chat)}`;
      console.log('Sending message:', message)
      chat.push({ user: 'user', text: message })
      setChat(chat)
      generateResponse(prompt)
      setMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex flex-wrap flex-1 gap-6 mx-5">
      {/* Comprehension Slider */}
      <div className="flex flex-col flex-1">
        <Label htmlFor="comprehension">Comprehension</Label>
        <Slider
          id="comprehension"
          defaultValue={[comprehensionLevelIndex]}
          max={3}
          step={1}
          onValueChange={(value) => setComprehensionLevelIndex(value[0])}
          className="custom-slider w-full mt-2 rounded-full"
        />
        <span className="text-sm font-medium mt-2">
          {["Layman", "High School", "College", "Expert"][comprehensionLevelIndex]}
        </span>
      </div>

      {/* Length Slider */}
      <div className="flex flex-col flex-1">
        <Label htmlFor="length">Length</Label>
        <Slider
          id="length"
          defaultValue={[contentLengthIndex]}
          max={2}
          step={1}
          onValueChange={(value) => setContentLengthIndex(value[0])}
          className="w-full mt-2"
        />
        <span className="text-sm font-medium mt-2">
          {["Short", "Medium", "Long"][contentLengthIndex]}
        </span>
      </div>

      {/* Tone Slider */}
      <div className="flex flex-col flex-1">
        <Label htmlFor="tone">Tone</Label>
        <Slider
          id="tone"
          defaultValue={[toneIndex]}
          max={2}
          step={1}
          onValueChange={(value) => setToneIndex(value[0])}
          className="w-full mt-2"
        />
        <span className="text-sm font-medium mt-2">
          {["Friendly", "Formal", "Informal"][toneIndex]}
        </span>
      </div>
    </div>

      {/* Chat Box */}
        <p className="text-gray-400">Chat messages will appear here</p>
      <Card className="flex flex-col h-[70vh] custom-scrollbar overflow-scroll p-4 overflow-y-auto bg-grey-900/90 text-white">
        {chat.map((message, index) => (
          <div key={index} className={`flex bg-gray-900 border border-gray-700 rounded-xl w-max max-w-full p-3 gap-2 mt-2`} style={{alignSelf: message.user==='ai'?'flex-start':'flex-end'}}>
            {message.user==='ai' &&
            <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>BD</AvatarFallback></Avatar>}
            <div className="flex items-center">
              <ReactMarkdown className="text-white">{message.text}</ReactMarkdown></div>  
              {message.user!=='ai' && <Avatar className=''> <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>YO</AvatarFallback>
            </Avatar>}
          </div>
        ))}
        {isLoading && <p className="text-gray-400">Loading...</p>}
      </Card>

      {/* Input and Send Button */}
      {error && <p className='text-[#ff2222] cursor-pointer hover:underline' onClick={handleRetry}>{error}</p>}
      <div className="flex items-center gap-2">
        <input type='text' placeholder='Type your message here...' value={message} onChange={(e) => setMessage(e.target.value)} className='flex-grow h-[38px] px-4 rounded-md bg-gray-700 outline-none text-white placeholder-gray-400' />
        <Button onClick={handleSendMessage} className='bg-[#9f3ec5] text-white' disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
