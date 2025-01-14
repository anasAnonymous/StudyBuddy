'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/components/ChatInterface'
import FlashcardView from '@/app/flash-cards/page'
import ScenarioView from '@/components/ScenarioView'
import TestView from '@/components/TestView'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative container mx-auto min-h-screen p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-screen">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="md:col-span-1"
          >
            <div className="h-auto md:h-[98vh] bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
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
                "min-h-[98vh] p-6",
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
