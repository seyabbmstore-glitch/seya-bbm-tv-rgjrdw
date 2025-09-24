
import { useState } from 'react';
import { ChatMessage } from '../types';

// Note: In a real app, you would store the API key securely
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

      // Simulate API call to Gemini
      // In a real app, you would make an actual API call to Google's Gemini API
      const response = await simulateGeminiResponse(message);
      
      const updatedMessage = { ...newMessage, response };
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? updatedMessage : msg
      ));

      return response;
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

  const simulateGeminiResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to Seya BBM TV! How can I help you today?';
    } else if (lowerMessage.includes('channel') || lowerMessage.includes('stream')) {
      return 'I can help you with channels and streaming! You can add new channels using web links, manage your uploads and downloads, and discover live content.';
    } else if (lowerMessage.includes('upload') || lowerMessage.includes('download')) {
      return 'For uploads and downloads, you can monitor the speed and progress in real-time. Make sure you have a stable internet connection for the best experience.';
    } else if (lowerMessage.includes('help')) {
      return 'I\'m here to help! You can ask me about:\n• Adding channels\n• Upload/Download features\n• Streaming content\n• Account settings\n• Technical support';
    } else {
      return 'Thanks for your message! I\'m still learning about Seya BBM TV. Is there something specific about streaming, channels, or uploads/downloads I can help you with?';
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
