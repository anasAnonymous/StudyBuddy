'use client'
import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const FlashCardPage = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateFlashCards = async () => {
    setIsLoading(true);
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const result = await model.generateContent(`Provide exactly 5 key points about the topic: ${topic}. Format each point as a separate line starting with a number.`);
      const content = result.response.text().trim();
      
      // Split the content into separate points and clean them up
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Flash Cards</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-600 rounded-lg text-gray-200 bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a topic for flash cards..."
          />
          <button
            onClick={generateFlashCards}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            >
              <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-xl backface-hidden">
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-medium text-white text-center">
                    {`Question ${currentCardIndex + 1}`}
                  </p>
                </div>
              </div>
              <div className="absolute w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl p-6 shadow-xl backface-hidden rotate-y-180">
                <div className="flex items-center justify-center h-full">
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
      </div>

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