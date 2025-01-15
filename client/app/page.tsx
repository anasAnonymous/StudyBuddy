'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'
import FlashcardView from '@/app/flash-cards/page'
import ScenarioView from '@/components/ScenarioView'
import SelectAgent from '@/components/SelectAgent'
import TestView from '@/components/TestView'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import pins from '@/components/pins'
import PinBoard from '@/components/pins'

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
      case 'agent':
        return <SelectAgent setActiveView={setActiveView}/>
      case 'pins':
        return <PinBoard />
      default:
        return <ChatInterface />
    }
  }

  const handleRefresh = () => {
    window.location.reload();
  }
  useEffect(() => {
    const agent = localStorage.getItem('selectedAgent');
    if (!agent)
      setActiveView('agent');
    }, []);
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#6a11cb,#2575fc)] opacity-20" />
      
      {/* Navbar */}
      <motion.div
        className="fixed top-0 left-0 right-0 p-4 backdrop-blur-lg z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1 className="text-white text-xl md:text-2xl font-bold cursor-pointer ml-4" onClick={handleRefresh}>
          Study Buddy
        </h1>
      </motion.div>

      <div className="relative container mx-auto min-h-screen p-4 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-screen">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="md:col-span-1 h-max flex justify-end"
          >
            <div className="h-auto w-max bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl">
              <Sidebar setActiveView={setActiveView} activeView={activeView} />
            </div>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                ease: 'easeOut',
                delay: 0.1 
              }}
              className="md:col-span-4"
            >
              <div className={cn(
                "min-h-[60vh] md:min-h-[60vh] h-[90vh] p-4 md:p-6",
                "bg-gray-900/90 backdrop-blur-xl",
                "border border-gray-800/50 rounded-2xl shadow-2xl",
                "transition-all duration-300 ease-in-out",
                "relative overflow-hidden"
              )}>
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 via-transparent to-gray-800/30 pointer-events-none" />
                
                {/* Content */}
                <div className="relative h-full z-10">
                  <div className="h-full overflow-auto custom-scrollbar">
                    {renderActiveView()}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
