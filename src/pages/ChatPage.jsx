import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ChatPage.css';

const ChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am your Parichay Assistant. How can I help you today? Please describe your situation.' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // specific simulation for bot response
    const triggerBotResponse = () => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                text: "I understand. Please tell me more details so I can help you better. Or click 'Submit Problem' if you are done."
            }]);
            setIsTyping(false);
        }, 1000);
    };

    useEffect(() => {
        if (!hasInitialized.current && location.state?.message) {
            hasInitialized.current = true;
            const userMsg = {
                id: Date.now(), // simple ID generation
                sender: 'user',
                text: location.state.message
            };
            setMessages(prev => [...prev, userMsg]);
            triggerBotResponse();
        }
    }, [location.state]);

    // Simple keyword-based dummy bot logic
    const generateBotResponse = (text) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello! I am here to help you understand your legal options. What seems to be the issue?";
        }
        if (lowerText.includes('fired') || lowerText.includes('terminate') || lowerText.includes('job')) {
            return "I'm sorry to hear that. Was this termination sudden? Do you have an employment contract or offer letter?";
        }
        if (lowerText.includes('rent') || lowerText.includes('landlord') || lowerText.includes('tenant')) {
            return "Tenancy disputes can be complex. Do you have a written lease agreement, and have you received any formal notice?";
        }
        if (lowerText.includes('divorce') || lowerText.includes('separation')) {
            return "Family matters are sensitive. Are you looking for information on the process or do you need immediate protection?";
        }
        if (lowerText.includes('contract') || lowerText.includes('agreement')) {
            return "Contracts are legally binding. Have you signed it yet, or are you looking for a review?";
        }
        if (lowerText.includes('police') || lowerText.includes('fir') || lowerText.includes('arrest')) {
            return "This sounds serious. If you are in immediate danger, please contact the police directly. For legal advice, can you describe the incident?";
        }

        return "I understand. Please tell me more about the situation so I can identify the right legal category for you.";
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText
        };

        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = inputText;
        setInputText('');
        setIsTyping(true);

        try {
            // Using the direct webhook URL as requested
            // Note: If this fails with a CORS error, we might need to use the proxy '/api/chat-webhook' defined in vite.config.js
            const response = await fetch('https://rishab-19.app.n8n.cloud/webhook/ai-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: currentInput
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }

            const rawText = await response.text();
            if (!rawText) throw new Error('Empty response');

            let botText = "";
            try {
                const data = JSON.parse(rawText);
                // Handle various n8n response formats
                if (Array.isArray(data) && data[0]?.output) botText = data[0].output;
                else if (data.output) botText = data.output;
                else if (data.text) botText = data.text;
                else if (data.message) botText = data.message;
                else botText = typeof data === 'string' ? data : JSON.stringify(data);
            } catch (e) {
                botText = rawText;
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: botText
            }]);

        } catch (error) {
            console.warn("Webhook connection failed (" + error.message + "), switching to fallback mode.");

            // Fallback to local dummy bot logic if webhook fails
            // Simulate a short natural delay for the fallback as well
            setTimeout(() => {
                const fallbackResponse = generateBotResponse(currentInput);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: fallbackResponse
                }]);
            }, 1000);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmitProblem = () => {
        // Collect all user messages or the full conversation
        const fullConversation = messages
            .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
            .join('\n\n');

        // Or just the user's issue for the existing triage logic
        // The user request said: "collect the FULL conversation (all user messages)"
        // "Then trigger the SAME action that currently happens when the landing page form is submitted"

        navigate('/triage', { state: { issue: fullConversation } });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-layout">
            {/* Left Sidebar */}
            <aside className="chat-sidebar">
                <div className="sidebar-section">
                    <h3>Your Case</h3>
                    <div className="sidebar-card">
                        <div className="card-row">
                            <span className="label">Category</span>
                            <span className="value">Employment Dispute</span>
                        </div>
                        <div className="card-row">
                            <span className="label">Risk Level</span>
                            <span className="value risk-medium">Medium</span>
                        </div>
                        <div className="card-row">
                            <span className="label">Location</span>
                            <span className="value">New Delhi</span>
                        </div>
                        <button className="edit-details-btn">Edit case details</button>
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3>Next Actions</h3>
                    <div className="action-card">
                        <span className="icon">📄</span>
                        <div className="action-info">
                            <h4>Generate document</h4>
                            <p>Draft a formal notice</p>
                        </div>
                    </div>
                    <div className="action-card">
                        <span className="icon">⚖️</span>
                        <div className="action-info">
                            <h4>Talk to a lawyer</h4>
                            <p>Get verified advice</p>
                        </div>
                    </div>
                    <div className="action-card">
                        <span className="icon">📍</span>
                        <div className="action-info">
                            <h4>Find legal aid</h4>
                            <p>Locate nearby help</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-main">
                {/* Top Navigation Bar */}
                <header className="chat-topbar">
                    <div className="topbar-left">
                        <span className="status-indicator"></span>
                        <span className="status-text">Anonymous session</span>
                        <span className="divider">|</span>
                        <span className="case-status">Case status: <strong>In progress</strong></span>
                    </div>
                    <div className="topbar-right">
                        <button className="lang-toggle">English / हिंदी</button>
                        <span className="private-badge">🔒 Private</span>
                        <button className="exit-btn" onClick={() => navigate('/')}>Quick Exit</button>
                    </div>
                </header>

                <div className="messages-container">
                    <div className="messages-wrapper">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-row ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.sender === 'bot' && <div className="bot-avatar">P</div>}
                                    <div className="message-text">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-row bot">
                                <div className="message-bubble typing">
                                    <div className="bot-avatar">P</div>
                                    <div className="typing-dots"><span>.</span><span>.</span><span>.</span></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="input-container">
                    <div className="input-wrapper">
                        <textarea
                            className="chat-input"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            className="send-icon-btn"
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                        >
                            ➤
                        </button>
                    </div>
                    <div className="bottom-actions">
                        <button className="submit-problem-link" onClick={handleSubmitProblem}>
                            Submit Problem & Continue
                        </button>
                    </div>
                    <div className="disclaimer">
                        Parichay can make mistakes. Consider checking important information.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;