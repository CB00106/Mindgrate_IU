// src/features/hub/Hub.tsx
import React, { useState } from 'react';
import type { ChatMessage, MindOpProfile } from '../../types';

// Modified Hub component for MindOp discovery and connections
export function Hub() {
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'agent', text: 'Hello! I\'m your personal MindOp. How can I help you today?' },
  ]);

  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('My MindOp');
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for MindOp discovery
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MindOpProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // Lista de agentes del usuario
  const userMindOps = [
    'My MindOp',
    'Project Assistant',
    'Data Analyst'
  ];

  // Mock data for search results
  const mockMindOps: MindOpProfile[] = [
    { 
      id: '1', 
      name: 'Finance Expert', 
      description: 'Specialized in financial analysis and budgeting',
      tags: ['Finance', 'Budget', 'Analysis'],
      connectionStatus: 'none'
    },
    { 
      id: '2', 
      name: 'Code Helper', 
      description: 'Assists with programming and debugging tasks',
      tags: ['Programming', 'Debugging', 'Development'],
      connectionStatus: 'connected'
    },
    { 
      id: '3', 
      name: 'Marketing Strategist', 
      description: 'Helps with marketing plans and campaign analysis',
      tags: ['Marketing', 'Campaigns', 'Analytics'],
      connectionStatus: 'pending'
    },
    { 
      id: '4', 
      name: 'Legal Advisor', 
      description: 'Provides guidance on legal documents and compliance',
      tags: ['Legal', 'Compliance', 'Documents'],
      connectionStatus: 'none'
    },
  ];
  
  // Search for MindOps based on query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const filteredResults = mockMindOps.filter(
        mindop => 
          mindop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          mindop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mindop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };
  
  // Request connection to a MindOp
  const requestConnection = (mindOpId: string) => {
    // Update UI state immediately
    setSearchResults(prev => 
      prev.map(mindop => 
        mindop.id === mindOpId 
          ? { ...mindop, connectionStatus: 'pending' } 
          : mindop
      )
    );
    
    // Simulate API call
    console.log(`Connection requested to MindOp ID: ${mindOpId}`);
    
    // Show success message in chat
    const targetMindOp = mockMindOps.find(m => m.id === mindOpId);
    if (targetMindOp) {
      setChat(prev => [
        ...prev, 
        { 
          from: 'agent', 
          text: `I've sent a connection request to "${targetMindOp.name}". You'll be notified when they respond.`, 
          timestamp: new Date()
        }
      ]);
    }
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = { 
      from: 'user', 
      text: input,
      timestamp: new Date()
    };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate agent response
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a contextual response based on the input
      let response = `I'm processing your request as your personal MindOp.`;
      
      // Simple parsing of common intents
      if (input.toLowerCase().includes('connect') || input.toLowerCase().includes('find')) {
        response = "I can help you find and connect with other MindOps. Use the search button above to discover specialized MindOps.";
      } else if (input.toLowerCase().includes('data') || input.toLowerCase().includes('source')) {
        response = "If you need to work with data, you can add data sources in the Data Sources section. Currently, I support CSV files and Google Sheets.";
      } else if (input.toLowerCase().includes('help') || input.toLowerCase().includes('what can you do')) {
        response = "As your personal MindOp, I can help you analyze information, connect with other specialized MindOps, and work with your data sources. How can I assist you today?";
      }
      
      const agentMessage: ChatMessage = { 
        from: 'agent', 
        text: response,
        timestamp: new Date()
      };
      
      setChat(prev => [...prev, agentMessage]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              🤖
            </div>
            <div className="ml-3">
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="font-semibold bg-transparent border-none focus:ring-0"
              >
                {userMindOps.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
              <div className="text-xs text-green-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Active
              </div>
            </div>
          </div>
          
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={() => setShowSearch(!showSearch)}
          >
            <span className="mr-2">🔍</span> {showSearch ? 'Hide Search' : 'Discover MindOps'}
          </button>
        </div>
        
        {showSearch && (
          <div className="bg-gray-50 p-4 rounded-lg mb-2">
            <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for MindOps by name, description, or tags..."
                className="flex-1 border border-gray-300 rounded-md px-4 py-2"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {searchResults.map(mindop => (
                  <div key={mindop.id} className="bg-white p-3 rounded-lg shadow-sm border flex justify-between">
                    <div>
                      <div className="font-medium">{mindop.name}</div>
                      <div className="text-sm text-gray-600">{mindop.description}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mindop.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      {mindop.connectionStatus === 'none' && (
                        <button 
                          onClick={() => requestConnection(mindop.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Connect
                        </button>
                      )}
                      {mindop.connectionStatus === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                          Pending
                        </span>
                      )}
                      {mindop.connectionStatus === 'connected' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="text-center text-gray-500 py-2">
                No MindOps found matching your search criteria
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chat.map((msg, i) => (
          <div key={i} className={`flex mb-4 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
                🤖
              </div>
            )}
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                msg.from === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border rounded-bl-none'
              }`}
            >
              {msg.text}
              {msg.timestamp && (
                <div className={`text-xs mt-1 ${msg.from === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              )}
            </div>
            {msg.from === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 mt-1">
                👤
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex mb-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
              🤖
            </div>
            <div className="bg-white border rounded-lg rounded-bl-none p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full border border-gray-300 rounded-full p-3 pr-20"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 flex space-x-2">
              <button type="button" className="text-gray-400">
                📎
              </button>
              <button type="button" className="text-gray-400">
                🎤
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className={`rounded-full w-12 h-12 flex items-center justify-center ${
              input.trim() && !isLoading ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
            disabled={!input.trim() || isLoading}
          >
            📤
          </button>
        </form>
      </div>
    </div>
  );
}