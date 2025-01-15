'use client'
import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs'
import ReactMarkdown from 'react-markdown';

import renderPredictions from '../utils/renderPredictions'

const ObjectDetection = () => {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isScanning, setIsScanning] = useState(true)
    const [detectedItems, setDetectedItems] = useState(new Set())
    const [aiResponse, setAiResponse] = useState('')
    let detectInterval

    const runCoco = async () => {
        setIsLoading(true);
        const net = await cocossd.load();
        setIsLoading(false);
        detectInterval = setInterval(() => {
            runObjectDetection(net);
        }, 10);
    };

    async function runObjectDetection(net) {
        if (canvasRef.current && webcamRef.current && webcamRef.current.video?.readyState === 4) {
            canvasRef.current.width = webcamRef.current.video.videoWidth;
            canvasRef.current.height = webcamRef.current.video.videoHeight;

            const detectedObjects = await net.detect(webcamRef.current.video, undefined, 0.6);
            const context = canvasRef.current.getContext('2d');
            renderPredictions(detectedObjects, context);
            
            // Update detected items by adding new ones to the Set
            if (isScanning) {
                setDetectedItems(prevItems => {
                    const newSet = new Set(prevItems);
                    detectedObjects.forEach(obj => newSet.add(obj.class));
                    return newSet;
                });
            }
        }
    }

    const generateDeclutterAdvice = async () => {
        setIsLoading(true);
        try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const prompt = `I have the following items on my desk: ${Array.from(detectedItems).join(', ')}. 
            To enhance my focus while studying, could you provide a moderate-sized feedback on which items I should consider removing? Please include a brief explanation for each suggestion, highlighting how it may contribute to a more productive study environment.`;

            const result = await model.generateContent(prompt);
            setAiResponse(result.response.text());
        } catch (error) {
            console.error('Error generating AI response:', error);
            setAiResponse('Sorry, there was an error generating the response.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopScan = () => {
        setIsScanning(false);
        clearInterval(detectInterval);
        generateDeclutterAdvice();
    };

    const handleStartScan = () => {
        setIsScanning(true);
        setAiResponse('');
        setDetectedItems(new Set());  // Reset to empty Set
        runCoco();
    };

    useEffect(() => {
        runCoco();
        return () => clearInterval(detectInterval);
    }, []);

    return (
        <div className='mt-8'>
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <img src="https://i.pinimg.com/originals/e2/63/00/e26300c0c746d3163a0f48223c897cee.gif" alt="Loading..." />
                </div>
            ) : (
                <div className='flex flex-col items-center gap-4'>
                    <div className='relative flex justify-center items-center gradient p-1.5 rounded-lg'>
                        <Webcam
                            ref={webcamRef}
                            className='rounded-md muted lg:h-[600px] lg:w-[600px] md:h-[500px] md:w-[500px] sm:h-[400px] sm:w-[400px] h-[300px] w-[300px]'
                        />
                        <canvas
                            ref={canvasRef}
                            className='absolute rounded-md muted lg:h-[600px] lg:w-[600px] md:h-[500px] md:w-[500px] sm:h-[400px] sm:w-[400px] h-[300px] w-[300px]'
                        />
                    </div>

                    <div className='flex gap-4'>
                        {isScanning ? (
                            <button
                                onClick={handleStopScan}
                                className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                            >
                                Stop Scanning & Get Advice
                            </button>
                        ) : (
                            <button
                                onClick={handleStartScan}
                                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
                            >
                                Start New Scan
                            </button>
                        )}
                    </div>


                    {!isScanning && aiResponse && (
                        <div className='mt-4 p-4 bg-black text-white rounded-lg max-w-2xl'>
                            <h3 className='text-xl font-bold mb-2'>Decluttering Advice:</h3>
                            <div className='prose prose-invert'>
                                <ReactMarkdown>{aiResponse}</ReactMarkdown>
                            </div>
                        </div>
                    )}


                    {!isScanning && detectedItems.size > 0 && (
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold'>Detected Items:</h3>
                            <p>{Array.from(detectedItems).join(', ')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ObjectDetection;
