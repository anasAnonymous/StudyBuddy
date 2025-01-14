'use client'
import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Brain, LineChart, Shield } from 'lucide-react';
import jsPDF from 'jspdf';

type Agent = 'AI' | 'Finance' | 'Cybersecurity' | null;

const agentConfigs = {
  AI: {
    icon: Brain,
    color: 'from-blue-500 to-purple-600',
    cardColor: 'from-purple-600 to-pink-500',
    bgColor: 'bg-gray-900',
    prompt: 'Provide exactly 5 key technical concepts about the AI topic: ',
    title: 'AI Buddy',
    description: 'An AI agent made to answer your AI-related queries',
    bgPattern: 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_100%)]',
    avatar: '/agents-pics/ai-bot.png' // Corrected avatar path for AI
  },
  Finance: {
    icon: LineChart,
    color: 'from-green-500 to-emerald-600',
    cardColor: 'from-emerald-600 to-teal-500',
    bgColor: 'bg-slate-900',
    prompt: 'Provide exactly 5 key financial insights about the topic: ',
    title: 'Finance Buddy',
    description: 'An AI agent made to answer your Finance related queries',
    bgPattern: 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_100%)]',
    avatar: '/agents-pics/finance-bot.png' // Avatar path for Finance
  },
  Cybersecurity: {
    icon: Shield,
    color: 'from-red-500 to-orange-600',
    cardColor: 'from-orange-600 to-yellow-500',
    bgColor: 'bg-zinc-900',
    prompt: 'Provide exactly 5 key security insights regarding cybersecurity threats: ',
    title: 'Cyber-security Buddy',
    description: 'An AI agent designed to enhance security awareness',
    bgPattern: 'bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_100%)]',
    avatar: '/agents-pics/cyber-bot.png' // Avatar path for Cybersecurity
  },
};

// Define a mapping of Tailwind colors to RGB values
const colorMapping: { [key: string]: string } = {
  'from-blue-500': 'rgb(37, 99, 235)', // Example RGB for blue-500
  'from-green-500': 'rgb(22, 163, 74)', // Example RGB for green-500
  'from-red-500': 'rgb(239, 68, 68)', // Example RGB for red-500
  'from-purple-600': 'rgb(128, 90, 213)', // Example RGB for purple-600
  'from-emerald-600': 'rgb(16, 185, 129)', // Example RGB for emerald-600
  'from-orange-600': 'rgb(255, 159, 28)', // Example RGB for orange-600
  // Add more mappings as needed
};

const FlashCardPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(null);
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);

  const generateFlashCards = async () => {
    setIsLoading(true);
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = selectedAgent ? 
        `${agentConfigs[selectedAgent].prompt}${topic}. Format each point as a separate line starting with a number.` :
        `Provide exactly 5 key points about the topic: ${topic}. Format each point as a separate line starting with a number.`;
      
      const result = await model.generateContent(prompt);
      const content = result.response.text().trim();
      
      const points = content
        .split('\n')
        .map((point: string) => point.replace(/^\d+[\)\.]\s*/, '').trim())
        .filter((point: string) => point.length > 0);
      
      setCards(points);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error generating flash cards:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const saveAsPDF = async (cards: string[], selectedAgent: Agent, topic: string) => {
    if (!selectedAgent) return;
    
    // Initialize PDF with better default settings
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set up document styling
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20; // Increased margin for better readability
    const contentWidth = pageWidth - (2 * margin);
    
    // Add header with styling
    doc.setFillColor(240, 240, 240); // Light gray background for header
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(50, 50, 50);
    doc.text(`${selectedAgent} Flash Cards`, margin, 25);
    
    // Add topic
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Topic: ${topic}`, margin, 35);
    
    // Set up content styling
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 60; // Start content after header
    
    // Add cards with improved formatting
    cards.forEach((card, index) => {
      // Add card number with styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Card ${index + 1}`, margin, yPosition);
      yPosition += 10;
      
      // Add card content with proper text wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      // Split text into wrapped lines
      const lines = doc.splitTextToSize(card, contentWidth);
      
      // Add background for card content
      doc.setFillColor(248, 248, 248);
      doc.rect(margin - 5, yPosition - 5, contentWidth + 10, (lines.length * 7) + 10, 'F');
      
      // Add border
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin - 5, yPosition - 5, contentWidth + 10, (lines.length * 7) + 10, 'S');
      
      // Add text
      lines.forEach((line: string) => {
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
      
      yPosition += 20; // Space between cards
      
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 20;
      }
    });
    
    // Add footer
    const footer = `Generated on ${new Date().toLocaleDateString()}`;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(footer, margin, pageHeight - 10);
    
    // Save the document
    doc.save(`${selectedAgent.toLowerCase()}-flashcards.pdf`);
  };

  if (!selectedAgent) {
    return (
      <div className="bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">Select Your AI Assistant</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Object.keys(agentConfigs) as Agent[]).map((agent) => {
              const AgentIcon = agentConfigs[agent as keyof typeof agentConfigs].icon;
              const isHovered = hoveredAgent === agent;
              return (
                <button
                  key={agent}
                  onClick={() => setSelectedAgent(agent)}
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

  return (
    <div className={`max-w-2xl mx-auto ${agentConfigs[selectedAgent].bgColor} p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white text-center">{agentConfigs[selectedAgent].title}</h1>
        <button
          onClick={() => setSelectedAgent(null)}
          className="text-white hover:text-gray-300 transition-colors"
        >
          Change Agent
        </button>
      </div>
      
      <div className="bg-opacity-20 bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={`w-full p-3 mb-4 border border-gray-600 rounded-lg text-gray-200 
            bg-opacity-50 bg-gray-700 focus:ring-2 focus:ring-${agentConfigs[selectedAgent].color.split('-')[1]} focus:border-transparent`}
          placeholder={`Enter a ${selectedAgent.toLowerCase()} topic...`}
        />
        <button
          onClick={generateFlashCards}
          disabled={isLoading}
          className={`w-full bg-gradient-to-r ${agentConfigs[selectedAgent].color} 
            hover:opacity-90 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Generate Flash Cards'}
        </button>
      </div>

      {cards.length > 0 && (
        <div className="relative">
          <div 
            className={`relative h-64 perspective-1000 transition-transform duration-500 transform-style-preserve-3d cursor-pointer
              ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            id={`flashcard-${currentCardIndex}`}
          >
            <div className={`absolute w-full h-full bg-gradient-to-br ${agentConfigs[selectedAgent].color} rounded-xl p-6 shadow-xl backface-hidden`}>
              <div className="flex items-center justify-center h-full">
                <img src={agentConfigs[selectedAgent].avatar} alt={`${selectedAgent} avatar`} className="w-10 h-10 rounded-full absolute top-4 left-4" />
                <p className="text-2xl font-medium text-white text-center">
                  {`Question ${currentCardIndex + 1}`}
                </p>
              </div>
            </div>
            <div className={`absolute w-full h-full bg-gradient-to-br ${agentConfigs[selectedAgent].cardColor} rounded-xl p-6 shadow-xl backface-hidden rotate-y-180`}>
              <div className="flex items-center justify-center h-full">
                <img src={agentConfigs[selectedAgent].avatar} alt={`${selectedAgent} avatar`} className="w-10 h-10 rounded-full absolute top-4 left-4" />
                <p className="text-xl text-white text-center">
                  {cards[currentCardIndex]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={previousCard}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-gray-300">
              {currentCardIndex + 1} / {cards.length}
            </span>
            <button
              onClick={nextCard}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {cards.length > 0 && (
        <button
          onClick={() => saveAsPDF(cards, selectedAgent, topic)}
          className={`w-full bg-gradient-to-r ${agentConfigs[selectedAgent].color} 
            hover:opacity-90 text-white mt-4 font-medium py-3 rounded-lg transition-all`}
        >
          Save as PDF
        </button>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashCardPage;