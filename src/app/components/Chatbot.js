'use client'

import { Box, Button, Stack, TextField, IconButton } from '@mui/material'
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded'
import { useState, useRef, useEffect } from 'react'
import { auth, firestore } from '../../firebase'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! I'm the ShopEase support assistant. How can I help you today?",
        },
    ]);
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [user, setUser] = useState(null)
    
    // set messages if there are any for the specific user from the database if not set the default chatbot greeting 
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const chatCollectionRef = collection(firestore, `users/${user.uid}/chats`);
                const chatQuery = query(chatCollectionRef, orderBy('timestamp'));
                const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
                    const chatMessages = snapshot.docs.map(doc => doc.data());
                    if (chatMessages.length === 0) {
                        setMessages(prevMessages => {
                            return prevMessages.length > 1 ? prevMessages : [
                                {
                                    role: 'assistant',
                                    content: "Hi! I'm the ShopEase support assistant. How can I help you today?",
                                }
                            ];
                        });
                    } else {
                        setMessages(chatMessages);
                    }
                });
                return () => unsubscribeChat();
            } else {
                setUser(null);
                setMessages([]);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // formats messages better
    const formatMessageContent = (content) => {
        // Split the content into lines
        const lines = content.split('\n');
      
        // Process each line to handle line breaks, bullet points, and lists
        const formattedLines = lines.map((line) => {
          // Handle bullet points
          if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('.') || line.trim().startsWith('"') || line.trim().startsWith('\n\n') || line.trim().endsWith('\n')) {
            return `<li>${line.trim().substring(2)}</li>`;
          }
      
          // Handle line breaks
          return `<p>${line}</p>`;
        });
      
        // Wrap consecutive <li> elements in <ul>
        let formattedContent = '';
        let inList = false;
        formattedLines.forEach((line) => {
          if (line.startsWith('<li>')) {
            if (!inList) {
              formattedContent += '<ul>';
              inList = true;
            }
            formattedContent += line;
          } else {
            if (inList) {
              formattedContent += '</ul>';
              inList = false;
            }
            formattedContent += line;
          }
        });
        if (inList) {
          formattedContent += '</ul>';
        }
      
        return formattedContent;
      };
    

    const sendMessage = async () => {
        if (!message.trim() || !user) return;
        setIsLoading(true);

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'user', content: message },
            { role: 'assistant', content: '' },
        ]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, { role: 'user', content: message }]),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let assistantMessage = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                assistantMessage += decoder.decode(value, { stream: true });
            }

            const formattedAssistantMessage = formatMessageContent(assistantMessage);

            if (user) {
                const chatRef = collection(firestore, `users/${user.uid}/chats`);
                await addDoc(chatRef, {
                    content: message,
                    role: 'user',
                    timestamp: new Date(),
                });

                await addDoc(chatRef, {
                    content: formattedAssistantMessage,
                    role: 'assistant',
                    timestamp: new Date(),
                });
            }

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessageIndex = updatedMessages.length - 1;
                updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    content: formattedAssistantMessage,
                };
                return updatedMessages;
            });

        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendMessage()
        }
    }

    return (
        <Box
            width="fit"
            height="fit"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="#616161"
        >
            <Stack
                direction={'column'}
                width="500px"
                height="550px"
                border="2px solid black"
                borderRadius={2}
                p={2}
                spacing={3}
                bgcolor={'white'}
            >
                <Stack
                    direction={'column'}
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={
                                msg.role === 'assistant' ? 'flex-start' : 'flex-end'
                            }
                        >
                            <Box
                                bgcolor={
                                    msg.role === 'assistant'
                                        ? '#b2dfdb'
                                        : '#00695c'
                                }
                                color={
                                    msg.role === 'assistant'
                                    ?"black"
                                    :"white"
                                }
                                borderRadius={3}
                                p={3}
                                dangerouslySetInnerHTML={{ __html: msg.content }}
                            />
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Stack>

                <Stack direction={'row'} spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <IconButton
                        style={
                            {
                                backgroundColor:"#00695c",
                                color: "white",
                                fontSize: "1rem",
                                borderRadius: "15px",
                                padding: 15 
                            }
                        }
                        variant="contained"
                        onClick={sendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : ''}
                        <ArrowUpwardRounded/>
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    )
}
