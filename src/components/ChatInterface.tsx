import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { getGrokResponse } from '../api/grok';
import type { Message } from '../api/grok';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
    language: 'en' | 'es';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const t = {
        en: {
            placeholder: "Describe your situation...",
            send: "Send",
            disclaimer: "Disclaimer: This is not legal advice. Verify with official sources.",
            welcome: "Welcome to Homeward. How can I help you today?",
        },
        es: {
            placeholder: "Describa su situación...",
            send: "Enviar",
            disclaimer: "Aviso: Esto no es asesoramiento legal. Verifique con fuentes oficiales.",
            welcome: "Bienvenido a Homeward. ¿Cómo puedo ayudarle hoy?",
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getGrokResponse([...messages, userMessage]);
            const aiMessage: Message = { role: 'assistant', content: response || "Error: No response" };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I encountered an error. Please check your API key and connection." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-window-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="chat-window" ref={scrollRef}>
                <div className="message ai">
                    {t[language].welcome}
                </div>

                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.75rem', opacity: 0.8 }}>
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                {msg.role === 'user' ? (language === 'en' ? 'You' : 'Usted') : 'Homeward'}
                            </div>
                            {msg.content}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="message ai" style={{ width: 'fit-content' }}>
                        <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t[language].placeholder}
                />
                <button className="send-button" onClick={handleSend} disabled={isLoading}>
                    <Send size={20} />
                </button>
            </div>

            <div className="disclaimer">
                {t[language].disclaimer}
            </div>
        </div>
    );
};

export default ChatInterface;
