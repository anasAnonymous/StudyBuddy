'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import ReactMarkdown from 'react-markdown'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pin } from 'lucide-react' // Importing pin icon from lucide-react
import db from '../utils/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion'; // Importing motion for animations
import { clerkClient } from '@clerk/clerk-sdk-node'
import { useAuth } from '@clerk/nextjs'; // Import useAuth

const comprehensionLevels = ["Layman", "High School", "College", "Expert"]
const contentLengths = ["Short", "Medium", "Long"]
const tones = ["Friendly", "Formal", "Informal"]

const SliderOption = ({ title, val, setVal, options }) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <div className="flex flex-col w-[45%] md:w-[30%] relative">
      <div className="flex flex-col" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onTouchStart={() => setIsHovered(true)} onTouchEnd={() => setIsHovered(false)}>
        <Label htmlFor={title}>{title}</Label>
        <Slider
          id={title}
          defaultValue={[val]}
          max={options.length - 1}
          step={1}
          onValueChange={(value) => setVal(value[0])}
          className="custom-slider w-full mt-2 rounded-full"
        />
        <span className="text-sm font-medium mt-2">
          {options[val]}
        </span>
      </div>
      <div className={`absolute ${isHovered?'':'hidden'} z-10 top-[65px] flex flex-col gap-2 ml-4 bg-zinc-700 rounded-xl p-4`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onTouchStart={() => setIsHovered(true)} onTouchEnd={() => setIsHovered(false)}>
        <p>Choose a comprehension level for the content.</p>
        <ul className='list-disc pl-4'>
          {options.map((option, index) => (
            <li key={index} className='list-disc'>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const { userId } = useAuth(); // Use useAuth to get the user ID
  const [message, setMessage] = useState('')
  const [comprehensionLevelIndex, setComprehensionLevelIndex] = useState(0)
  const [contentLengthIndex, setContentLengthIndex] = useState(0)
  const [toneIndex, setToneIndex] = useState(0)
  const [chat, setChat] = useState([{user: 'ai', text: 'Hello! I am your Study Buddy. How can I help you today?', pinned: false}])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('') // State for success message
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const generateResponse = async (prompt) => {
    setIsLoading(true)
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      const result = await model.generateContent(prompt)
      chat.push({ user: 'ai', text: result.response.text(), pinned: false })
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

  const handlePinMessage = async (text, index) => {
    // Check if the message is already pinned
    if (chat[index].pinned) {
      setError('This message is already pinned.');
      return;
    }

    // Function to store the chat message in Firebase
    console.log('Pinning message:', text);
    try {
      const docRef = await addDoc(collection(db, 'pins'), {
        response: text,
        uid: userId, // Store the user ID alongside the response
      });
      console.log('Document written with ID: ', docRef.id);
      chat[index].pinned = true; // Mark the message as pinned
      setChat([...chat]); // Update the chat state
      setSuccessMessage('Saved to Pins Board!'); // Set success message
      setShowModal(true); // Show modal
      setTimeout(() => {
        setShowModal(false); // Hide modal after 3 seconds
      }, 3000);
    } catch (err) {
      console.error('Error adding document:', err);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior (like form submission)
      handleSendMessage(); // Call the send message function
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex flex-wrap flex-1 gap-6 mx-5">
        <SliderOption title="Comprehension Level" val={comprehensionLevelIndex} setVal={setComprehensionLevelIndex} options={comprehensionLevels} />
        <SliderOption title="Content Length" val={contentLengthIndex} setVal={setContentLengthIndex} options={contentLengths} />
        <SliderOption title="Tone" val={toneIndex} setVal={setToneIndex} options={tones} />
      </div>

      {/* Chat Box */}
      <p className="text-gray-400">Chat messages will appear here</p>
      <Card className="flex flex-col h-[70vh] custom-scrollbar overflow-scroll p-4 overflow-y-auto bg-grey-900/90 text-white">
        {chat.map((message, index) => (
          <div key={index} className={`flex bg-gray-900 border border-gray-700 rounded-xl w-max max-w-full p-3 gap-2 mt-2`} style={{alignSelf: message.user==='ai'?'flex-start':'flex-end'}}>
            {message.user==='ai' &&
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>BD</AvatarFallback>
            </Avatar>}
            <div className="flex items-center">
              <ReactMarkdown className="text-white">{message.text}</ReactMarkdown>
              {message.user === 'ai' && (
                <Button onClick={() => handlePinMessage(message.text, index)} className="ml-2 p-1 bg-transparent border-none">
                  <Pin className={`w-4 h-4 ${message.pinned ? 'text-yellow-500' : 'text-gray-400'}`} />
                </Button>
              )}
            </div>  
            {message.user!=='ai' && <Avatar className=''> <AvatarImage src=''/>
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>}
          </div>
        ))}
        {isLoading && <p className="text-gray-400">Loading...</p>}
      </Card>

      {/* Success Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-sm transition-all duration-300 ease-in-out"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <p className="text-green-400 text-lg font-semibold text-center">{successMessage}</p>
            <motion.button 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Input and Send Button */}
      {error && <p className='text-[#ff2222] cursor-pointer hover:underline' onClick={() => handleRetry()}>{error}</p>}
      <div className="flex items-center gap-2">
        <input 
          type='text' 
          placeholder='Type your message here...' 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={handleKeyDown} // Add key down event handler
          className='flex-grow h-[38px] px-4 rounded-md bg-gray-700 outline-none text-white placeholder-gray-400' 
        />
        <Button onClick={handleSendMessage} className='bg-[#9f3ec5] text-white' disabled={!message.trim()}>
          Send
        </Button>
      </div>
    </div>
  )
}
