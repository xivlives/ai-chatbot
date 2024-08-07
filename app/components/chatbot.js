// components/Chatbot.js
"use client"

import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    const response = await axios.post('/api/chat', { message: input });
    const botMessage = { text: response.data.message, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    setInput('');
  };

  return (
    <div className="bg-slate-500 p-6 m-4">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className='flex justify-between' onSubmit={handleSubmit}>
        <input
          className='p-3 text-black rounded-lg w-7/12'  
          type="text"
          placeholder="what's the issue?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className='p-4 rounded-3xl bg-green-600' type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
