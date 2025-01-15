'use client'
import {MessageCircleMore, School2Icon, MessageCircleQuestionIcon, BrainIcon, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Brain, LineChart, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import {cn} from '../lib/utils'
import React from 'react'
import agentsConfig from '../lib/agents.json'
 
export default function Sidebar({ setActiveView, activeView }) {
  const menuItems = [
    { text: 'Chat', icon: <MessageCircleMore/>, view: 'chat', color: '#7BB3F5' },
    { text: 'Flashcards', icon: <School2Icon />, view: 'flashcards', color: '#F5B97B' },
    { text: 'Scenarios', icon: <BrainIcon />, view: 'scenarios', color: "#B97BF5" },
    { text: 'Tests', icon: <MessageCircleQuestionIcon />, view: 'tests', color: '#7BB3F5' },
    { text: 'Pins', icon: <Pin />, view: 'pins', color: '#F5B97B' }, 
  ]
  const [agent, setAgent] = React.useState(null)
  const [agentConfig, setAgentConfig] = React.useState(null)
  const [agentIcon, setAgentIcon] = React.useState(null)

  React.useEffect(() => {
    const agent = localStorage.getItem('selectedAgent')?.trim();
    if (agent) {
      setAgent(agent)
      setAgentConfig(agentsConfig[agent])
      setAgentIcon(agent==='AI'?Brain:(agent==='Finance'?LineChart:Shield))
    }
  }, [activeView])

  return (
    <ScrollArea className="h-[400px] md:max-w-[300px] xl:w-[300px] w-max rounded-md border p-4">
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
            "w-full justify-start",
            activeView === item.view
              ? `bg-muted bg-opacity-15 hover:bg-opacity-25`
              : "text-foreground hover:bg-muted",
            "transition-all duration-300 ease-in-out"
          )}
          onClick={() => setActiveView(item.view)}
        >
          <span className={cn(
            "mr-2 transition-colors duration-300 text-xl",
            activeView === item.view ? item.color : "text-foreground"
          )}>
            {item.icon}
          </span>
          <span className={cn(
            "inline md:hidden lg:inline transition-all duration-300",
            activeView === item.view ? `${item.color} font-medium` : "font-normal"
          )}>
            {item.text}
          </span>
        </Button>
      </motion.div>
    ))}
    {agent && (
      <div className={`absolute cursor-pointer bottom-4 left-4 right-4 p-2 px-1 lg:px-2 bg-gray-800 rounded-md`} onClick={() => setActiveView('agent')}>
        <div className={`relative flex bg-gradient-to-br ${agentConfig.color} p-1 rounded-md items-center`}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800">
              <img src={agentConfig.avatar} alt={`${agent} avatar`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex md:hidden lg:flex text-center ">
              <h3 className="text-2xl font-bold text-white ml-2">
                {agentConfig.title}
              </h3>
            </div>
          </div>
      </div>
      )}
  </ScrollArea>
  )
}

