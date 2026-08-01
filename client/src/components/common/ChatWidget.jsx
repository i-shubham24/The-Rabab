import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaShoppingCart, FaCalendarAlt, FaHeadset } from 'react-icons/fa';
import './ChatWidget.css';

const modes = [
  { id: 'order', label: 'Order', icon: <FaShoppingCart /> },
  { id: 'booking', label: 'Book', icon: <FaCalendarAlt /> },
  { id: 'support', label: 'Support', icon: <FaHeadset /> },
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('support');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Welcome to Majestic Rabab! I'm your AI concierge. How may I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          mode,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }

      // Handle actions
      if (data.action) {
        if (data.action.type === 'booking_created') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `✅ Your reservation has been created! Booking ID: #${data.action.booking.id.substring(data.action.booking.id.length - 6)}. We look forward to seeing you!`,
            isAction: true,
          }]);
        } else if (data.action.type === 'add_to_cart') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🛒 I've prepared your items: ${data.action.items.map(i => `${i.name} x${i.quantity}`).join(', ')}. Head to the Menu page to add them to your cart!`,
            isAction: true,
          }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, I'm having trouble connecting. Please try again or call us at +91 7900324000."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    const modeNames = { order: 'Order Assistant', booking: 'Booking Assistant', support: 'Support Agent' };
    setMessages([{
      role: 'assistant',
      content: `Switched to ${modeNames[newMode]}. How can I help you?`
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat-fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="fab-icon">💬</span>
            <span className="fab-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <h3>Rabab AI Concierge</h3>
                <span className="chat-status">● Online</span>
              </div>
              <button className="chat-close" onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>

            {/* Mode Tabs */}
            <div className="chat-modes">
              {modes.map(m => (
                <button
                  key={m.id}
                  className={`chat-mode-btn ${mode === m.id ? 'active' : ''}`}
                  onClick={() => switchMode(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role} ${msg.isAction ? 'action' : ''}`}>
                  <div className="msg-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-msg assistant">
                  <div className="msg-bubble typing">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button className="chat-send" onClick={handleSend} disabled={!input.trim() || isTyping}>
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
