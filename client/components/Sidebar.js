'use client'
import {MessageCircleMore, School2Icon, MessageCircleQuestionIcon, BrainIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import {cn} from '../lib/utils'
 
export default function Sidebar({ setActiveView, activeView }) {
  const menuItems = [
    { text: 'Chat', icon: <MessageCircleMore />, view: 'chat', color: '#7BB3F5' },
    { text: 'Flashcards', icon: <School2Icon />, view: 'flashcards', color: '#F5B97B' },
    { text: 'Scenarios', icon: <BrainIcon />, view: 'scenarios', color: "#B97BF5" },
    { text: 'Tests & Results', icon: <MessageCircleQuestionIcon />, view: 'tests', color: '#7BB3F5' },
  ]

  return (
    <ScrollArea className="h-[300px] w-[300px] rounded-md border p-4">
    {menuItems.map((item) => (
      <motion.div
        key={item.text}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-2"
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start ",
            activeView === item.view
              ? `bg-[${item.color}] bg-opacity-15 hover:bg-opacity-25`
              : "text-foreground hover:bg-muted",
            "transition-all duration-300 ease-in-out"
          )}
          onClick={() => setActiveView(item.view)}
        >
          <span className={cn(
            "mr-2 transition-colors duration-300",
            activeView === item.view ? item.color : "text-foreground"
          )}>
            {item.icon}
          </span>
          <span className={cn(
            "transition-all duration-300",
            activeView === item.view ? `${item.color} font-medium` : "font-normal"
          )}>
            {item.text}
          </span>
        </Button>
      </motion.div>
    ))}
  </ScrollArea>
  )
}

