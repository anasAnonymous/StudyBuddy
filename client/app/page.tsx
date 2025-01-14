// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Loader2 } from 'lucide-react'
// import AddItem from '../components/addItem'
// import ListItems from '../components/listItems'


// function Home() {
//   const [message, setMessage] = useState('Welcome to AI Playground')
//   const [people, setPeople] = useState([])
//   const [aiResponse, setAiResponse] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [prompt, setPrompt] = useState('Explain how AI works')

//   const generateResponse = async () => {
//     setIsLoading(true)
//     try {
//       const { GoogleGenerativeAI } = require("@google/generative-ai")
//       const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

//       const result = await model.generateContent(prompt)
//       setAiResponse(result.response.text())
//     } catch (error) {
//       console.error('Error generating AI response:', error)
//       setAiResponse('Sorry, there was an error generating the response.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch("http://localhost:8000/api/home")
//       const data = await response.json()
//       setPeople(data.people)
//     }
//     fetchData()
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
//       <div className="max-w-6xl mx-auto">
//         <header className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-white mb-2">{message}</h1>
//           <p className="text-gray-300">Experience the power of AI through interactive conversations</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Input Section */}
//           <div className="lg:col-span-1 bg-gray-700 rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">Prompt</h2>
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full h-40 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-200 bg-gray-800"
//               placeholder="Enter your prompt here..."
//             />
//             <button
//               onClick={generateResponse}
//               disabled={isLoading}
//               className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 'Generate Response'
//               )}
//             </button>
//           </div>

//           {/* Response Section */}
//           <div className="lg:col-span-2 bg-gray-700 rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">AI Response</h2>
//             <div className="bg-gray-600 rounded-lg p-6 min-h-[300px]">
//               {isLoading ? (
//                 <div className="flex items-center justify-center h-full">
//                   <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//                 </div>
//               ) : (
//                 <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
//                   {aiResponse || 'Response will appear here...'}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* History Section */}
//         <div className="mt-8 bg-gray-700 rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-semibold mb-4 text-white">Recent Conversations</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-600">
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-500">
//                 {people.map((person, index) => (
//                   <tr key={index} className="hover:bg-gray-600 transition-colors">
//                     <td className="px-6 py-4 text-sm text-gray-200">{person}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         <AddItem />
//         <ListItems />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home

'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'
import FlashcardView from '@/app/flash-cards/page'
import ScenarioView from '@/components/ScenarioView'
import TestView from '@/components/TestView'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [activeView, setActiveView] = useState('chat')

  const renderActiveView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatInterface />
      case 'flashcards':
        return <FlashcardView />
      case 'scenarios':
        return <ScenarioView />
      case 'tests':
        return <TestView />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="container mx-auto min-h-screen py-4 px-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-screen">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <div className="h-auto md:h-[98vh] bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-lg shadow-md">
            <Sidebar setActiveView={setActiveView} activeView={activeView} />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="col-span-3"
        >
          <div className="min-h-[98vh] p-6 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-lg shadow-md">
            <div className="h-full overflow-auto">{renderActiveView()}</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
