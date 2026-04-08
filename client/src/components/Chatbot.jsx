import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubblesSharp, IoClose, IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  if (location.pathname === '/admin') return null;
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi! I'm Khushal's AI assistant. Ask me anything about his experience, projects, or skills!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiUrl}/api/chat`, {
        message: input,
        history: messages.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }))
      });

      setMessages(prev => [...prev, { role: 'model', text: response.data.text }]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorText = "Sorry, I'm having trouble connecting right now. Please try again later!";
      
      if (error.response && error.response.data && error.response.data.error) {
        errorText = `Assistant Error: ${error.response.data.error}`;
      } else if (error.message === 'Network Error') {
        errorText = "Connection error. Make sure you've added the GEMINI_API_KEY to your Vercel settings.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Action Button */}
      <motion.button
        className={`chatbot-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <IoClose size={24} /> : <IoChatbubblesSharp size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="online-indicator"></div>
                <h3>Khushal AI Assistant</h3>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="message-bubble model typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask me something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                <IoSend size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
