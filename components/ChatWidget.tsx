import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, Paperclip, File, User as UserIcon, Download } from 'lucide-react';
import { ChatMessage, DirectMessage, User } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatWidgetProps {
  user?: User | null;
  messages?: DirectMessage[];
  onSendMessage?: (text: string, attachment?: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ user, messages = [], onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [geminiMessages, setGeminiMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Hi! I can help you find the perfect freelance service. What are you looking for today?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  // Filter messages for the current client
  const clientMessages = isClient && user
    ? messages.filter(m => m.senderId === user.id || m.receiverId === user.id)
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [geminiMessages, clientMessages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() && !isLoading) return;

    if (isClient && onSendMessage) {
      // Direct Message Mode
      onSendMessage(inputText);
      setInputText('');
    } else {
      // Gemini Mode (Guest)
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: inputText,
        timestamp: new Date()
      };

      setGeminiMessages(prev => [...prev, userMsg]);
      setInputText('');
      setIsLoading(true);

      const apiKey = process.env.API_KEY || '';
      
      if (!apiKey) {
        setGeminiMessages(prev => [...prev, {
            id: Date.now().toString() + 'err',
            role: 'model',
            text: 'API Key is missing. Please configure it in the environment.',
            timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      try {
        const responseText = await sendMessageToGemini(userMsg.text, apiKey);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
        };
        setGeminiMessages(prev => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAttachFile = () => {
    if (isClient && onSendMessage) {
      // Simulate file upload
      const fakeFileUrl = "https://example.com/requirements.pdf";
      onSendMessage("I have attached the requirements file.", fakeFileUrl);
    } else {
        alert("Please log in to send files.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // If Admin, they use the Dashboard messages tab, not this widget usually.
  // Moved check here (after hooks) to prevent React error #300
  if (isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-fade-in-up">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[500px] transition-all duration-300 ease-in-out transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-premium-royal to-premium-indigo p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              {isClient ? (
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Support Chat</h3>
                        <p className="text-[10px] text-primary-100 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                          Online
                        </p>
                    </div>
                 </div>
              ) : (
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">SkillFlow AI</h3>
                        <p className="text-[10px] text-primary-100">Automated Assistant</p>
                    </div>
                 </div>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
            {isClient ? (
               // Client Direct Messages
               <>
                 {clientMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                        <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">Start a conversation with the admin directly.</p>
                    </div>
                 )}
                 {clientMessages.map(msg => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                            isMe
                                ? 'bg-premium-royal text-white rounded-br-none' 
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                            }`}>
                            {msg.attachment && (
                                <a 
                                  href={msg.attachment} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors border group ${
                                    isMe 
                                      ? 'bg-primary-700/50 border-primary-500/30 hover:bg-primary-700' 
                                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                                >
                                    <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white dark:bg-gray-800 text-premium-royal'}`}>
                                        <File className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold truncate">Attachment</p>
                                        <p className={`text-[10px] flex items-center gap-1 ${isMe ? 'text-primary-100' : 'text-gray-500'}`}>
                                           <Download className="w-3 h-3" /> Click to download
                                        </p>
                                    </div>
                                </a>
                            )}
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            </div>
                        </div>
                    );
                 })}
               </>
            ) : (
              // AI Messages
              geminiMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-premium-royal text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && !isClient && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce animation-delay-200"></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce animation-delay-400"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-center">
            {isClient && (
                <button 
                  onClick={handleAttachFile}
                  title="Attach File"
                  className="p-2.5 text-gray-400 hover:text-premium-royal hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
            )}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isClient ? "Type a message..." : "Ask AI assistant..."}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-premium-royal text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={(isLoading && !isClient) || !inputText.trim()}
              className="bg-gradient-to-r from-premium-royal to-premium-indigo text-white p-2.5 rounded-full hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative group">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'rotate-0 opacity-100'} bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] text-white p-4 rounded-full shadow-xl`}
         >
            <MessageSquare className="w-7 h-7" />
         </button>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-all duration-300 absolute top-0 left-0 ${!isOpen ? '-rotate-90 opacity-0 pointer-events-none' : 'rotate-0 opacity-100'} bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 text-white p-4 rounded-full shadow-xl`}
         >
            <X className="w-7 h-7" />
         </button>
         
         {/* Tooltip hint if closed */}
         {!isOpen && (
             <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                 Chat with us
                 <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
             </div>
         )}
      </div>
    </div>
  );
};