
import { useState } from 'react';
import { ChatMessage } from '../types';

// Note: Replace with your actual Gemini API key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message,
        response: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);

      // Check if we have a valid API key
      if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        // Use simulated response for demo
        const response = await simulateGeminiResponse(message);
        
        const updatedMessage = { ...newMessage, response };
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? updatedMessage : msg
        ));

        return response;
      } else {
        // Make actual API call to Gemini
        const response = await callGeminiAPI(message);
        
        const updatedMessage = { ...newMessage, response };
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? updatedMessage : msg
        ));

        return response;
      }
    } catch (error) {
      console.log('Error sending message to Gemini:', error);
      const errorResponse = 'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => prev.map(msg => 
        msg.id === prev[prev.length - 1].id 
          ? { ...msg, response: errorResponse }
          : msg
      ));
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for Seya BBM TV, a live streaming platform. The user asked: "${message}". Please provide a helpful response about streaming, channels, uploads, downloads, or general app usage.`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.log('Gemini API error:', error);
      return await simulateGeminiResponse(message);
    }
  };

  const simulateGeminiResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to Seya BBM TV! How can I help you today?';
    } else if (lowerMessage.includes('channel') || lowerMessage.includes('stream')) {
      return 'I can help you with channels and streaming! You can add new channels using web links, manage your uploads and downloads, and discover live content. Would you like to know more about any specific feature?';
    } else if (lowerMessage.includes('upload') || lowerMessage.includes('download')) {
      return 'For uploads and downloads, you can monitor the speed and progress in real-time. Make sure you have a stable internet connection for the best experience. You can find all your transfers in the Transfers tab.';
    } else if (lowerMessage.includes('help')) {
      return 'I\'m here to help! You can ask me about:\n\n• Adding and managing channels\n• Upload/Download features\n• Streaming content\n• Account settings\n• Technical support\n\nWhat would you like to know more about?';
    } else if (lowerMessage.includes('login') || lowerMessage.includes('account')) {
      return 'For account management, you can login or register through the Profile tab. Make sure to verify your email address to access all features. If you\'re having trouble logging in, check your email and password.';
    } else if (lowerMessage.includes('speed') || lowerMessage.includes('network')) {
      return 'Network speed monitoring helps you track your upload and download speeds in real-time. This is useful for optimizing your streaming quality and transfer performance. You can see your current speeds in the home screen and profile.';
    } else {
      return 'Thanks for your message! I\'m here to help with Seya BBM TV. You can ask me about streaming, channels, uploads, downloads, account management, or any other features. What would you like to know?';
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
