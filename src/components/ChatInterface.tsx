import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGrokResponse } from '../api/grok';
import type { Message, Citation } from '../api/grok';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
    language: 'en' | 'es';
    clearTrigger?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, clearTrigger }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem('chat_messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const t = {
        en: {
            placeholder: "Describe your situation...",
            send: "Send",
            disclaimer: "Disclaimer: This is not legal advice. Verify with official sources.",
            welcome: "Welcome to Homeward. How can I help you today?",
            suggestions: [
                "How do I get the $3,000 bonus?",
                "What is the CBP One app?",
                "I need help with my court date.",
                "Can I work in the US?"
            ]
        },
        es: {
            placeholder: "Describa su situación...",
            send: "Enviar",
            disclaimer: "Aviso: Esto no es asesoramiento legal. Verifique con fuentes oficiales.",
            welcome: "Bienvenido a Homeward. ¿Cómo puedo ayudarle hoy?",
            suggestions: [
                "¿Cómo obtengo el bono de $3,000?",
                "¿Qué es la aplicación CBP One?",
                "Necesito ayuda con mi fecha de corte.",
                "¿Puedo trabajar en los EE. UU.?"
            ]
        }
    };

    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    useEffect(() => {
        if (clearTrigger && clearTrigger > 0) {
            setMessages([]);
            localStorage.removeItem('chat_messages');
        }
    }, [clearTrigger]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setIsLoading(true);

        try {
            const response = await getGrokResponse([...messages, userMessage]);
            const aiMessage: Message = {
                role: 'assistant',
                content: response.content || "Error: No response",
                citations: response.citations
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I encountered an error. Please check your API key and connection." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
                            {msg.role === 'assistant' ? (
                                <>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    {msg.citations && msg.citations.length > 0 && (
                                        <details className="citations-collapsible">
                                            <summary className="citations-summary">
                                                <ChevronDown size={14} className="citations-chevron" />
                                                <span>{language === 'en' ? 'Sources' : 'Fuentes'} ({msg.citations.length})</span>
                                            </summary>
                                            <ul className="citations-list">
                                                {msg.citations.map((citation, idx) => (
                                                    <li key={idx}>
                                                        <a href={citation.url} target="_blank" rel="noopener noreferrer">
                                                            {citation.title || new URL(citation.url).hostname}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}
                                </>
                            ) : (
                                msg.content
                            )}
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

            <div className="suggestions-container">
                {t[language].suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => handleSend(suggestion)}
                        disabled={isLoading}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <div className="input-area">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t[language].placeholder}
                    rows={1}
                    aria-label={t[language].placeholder}
                />
                <button
                    className="send-button"
                    onClick={() => handleSend()}
                    disabled={isLoading}
                    aria-label={t[language].send}
                >
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
