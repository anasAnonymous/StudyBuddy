'use client'
import { Brain, LineChart, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import agentConfigs  from '@/lib/agents.json';

type Agent = 'AI' | 'Finance' | 'Cybersecurity' | '';


interface selectAgentProps {
  setActiveView: (activeView: string) => void;
}

const selectAgent = ({setActiveView}:selectAgentProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>('');
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);

  const handleAgentSelection = (agent: Agent) => {
    localStorage.setItem('selectedAgent', agent);
    setSelectedAgent(agent);
    setActiveView('chat');
  }

  useEffect(() => {
    const selectedAgent = localStorage.getItem('selectedAgent');
    if (selectedAgent) {
      setSelectedAgent(selectedAgent as Agent);
    }
  }
  , []);

    return (
      <div className="bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">Select Your Study Buddy</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Object.keys(agentConfigs) as Agent[]).map((agent) => {
              const AgentIcon = agentConfigs[agent as keyof typeof agentConfigs].icon==="Brain"?Brain:agentConfigs[agent as keyof typeof agentConfigs].icon==="LineChart"?LineChart:Shield;
              const isHovered = hoveredAgent === agent;
              return (
                <button
                  key={agent}
                  onClick={() => handleAgentSelection(agent)}
                  onMouseEnter={() => setHoveredAgent(agent)}
                  onMouseLeave={() => setHoveredAgent(null)}
                  className={`relative overflow-hidden group p-8 rounded-xl 
                    bg-gradient-to-br ${agentConfigs[agent as keyof typeof agentConfigs].color} 
                    hover:scale-105 transition-all duration-300 shadow-xl`}
                >
                  <div className={`absolute inset-0 ${agentConfigs[agent as keyof typeof agentConfigs].bgPattern} 
                    opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800">
                      <img src={agentConfigs[agent as keyof typeof agentConfigs].avatar} alt={`${agent} avatar`} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className={`w-20 h-20 rounded-full bg-white/10 flex items-center justify-center 
                      transform transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                      <AgentIcon className={`w-12 h-12 text-white transform transition-transform duration-300 
                        ${isHovered ? 'rotate-12' : ''}`} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {agentConfigs[agent as keyof typeof agentConfigs].title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {agentConfigs[agent as keyof typeof agentConfigs].description}
                      </p>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-white/30 
                      transform origin-left transition-transform duration-300 
                      ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

export default selectAgent;