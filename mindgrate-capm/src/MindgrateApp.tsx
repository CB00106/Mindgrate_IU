import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Definiciones de tipos para mejorar el tipado
interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

interface Stat {
  title: string;
  value: number | string;
  change: string;
  color: string;
}

interface ChatMessage {
  from: 'user' | 'agent';
  text: string;
  timestamp?: Date;
}

// Updated AgentConfig interface with new social network fields
interface AgentConfig {
  name: string;
  role: string;
  description: string;
  prompt_template: string;
  temperature: number;
  max_tokens: number;
  verbosity_level: 'Low' | 'Medium' | 'High';
  enabled: boolean;
  tags: string[];
  data_sources: string[];
  retry_on_fail: boolean;
  rate_limit_per_minute: number;
  model: string;
  // New fields for social network functionality
  discoverability: 'public' | 'private_link' | 'private_invite_only';
  connectionPolicy: 'auto_accept_all' | 'manual_approval_all';
}

// Simplified DataSource interface focused on CSV and Sheets
interface DataSource {
  name: string;
  type: 'CSV' | 'Google Sheets';
  status: 'Connected' | 'Error' | 'Pending';
  lastSync: string;
}

// New interface for MindOp discovery results
interface MindOpProfile {
  id: string;
  name: string;
  description: string;
  tags: string[];
  connectionStatus: 'none' | 'pending' | 'connected';
}

// New interface for connection notifications
interface NotificationItem {
  id: string;
  fromMindOp: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

// Props para los componentes
interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

function Sidebar({ currentPage, setPage }: SidebarProps) {
  // Updated menu items for MVP
  const menu: MenuItem[] = [
    { key: 'Hub', label: 'Hub', icon: '💬' },
    { key: 'MyMindOp', label: 'Mi MindOp', icon: '🤖' },
    { key: 'Data', label: 'Data Sources', icon: '📁' },
    { key: 'Notifications', label: 'Notifications', icon: '🔔' },
  ];
  
  return (
    <aside className="w-60 bg-gray-800 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <span className="text-blue-400 mr-2">🧠</span> Mindgrate
      </h1>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map(item => (
            <li key={item.key}>
              <button
                onClick={() => setPage(item.key)}
                className={`w-full text-left p-3 rounded flex items-center ${
                  currentPage === item.key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center p-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            JD
          </div>
          <div className="ml-2">
            <div className="text-sm">John Doe</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

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

// Renamed and updated Agent component to MyMindOp
export function MyMindOp() {
  const [formData, setFormData] = useState<AgentConfig>({
    name: 'My MindOp',
    role: 'Personal Assistant', 
    description: 'My personal AI agent that helps me with daily tasks and connects with other specialized MindOps.', 
    prompt_template: '{{input}} - Process this request as a personal MindOp.', 
    temperature: 0.7,
    max_tokens: 512, 
    verbosity_level: 'Medium', 
    enabled: true, 
    tags: ['Personal', 'Assistant'],
    data_sources: ['MyData'], 
    retry_on_fail: true, 
    rate_limit_per_minute: 60,
    model: 'gpt-4',
    // New social network fields
    discoverability: 'public',
    connectionPolicy: 'manual_approval_all'
  });

  // Opciones para los selects
  const roles = ['Personal Assistant', 'Data Analyst', 'Project Manager', 'Creative Writer', 'Researcher', 'Code Helper'];
  const verbosityOptions: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
  const availableTags = ['Personal', 'Assistant', 'Business', 'Creative', 'Technical', 'Research', 'Data', 'Finance', 'Legal', 'Marketing'];
  const availableDataSources = ['MyData', 'ProjectData', 'MarketingData', 'SalesData', 'ResearchData'];
  const models = ['gpt-3.5-turbo', 'gpt-4', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro'];
  const discoverabilityOptions: Array<'public' | 'private_link' | 'private_invite_only'> = [
    'public', 'private_link', 'private_invite_only'
  ];
  const connectionPolicyOptions: Array<'auto_accept_all' | 'manual_approval_all'> = [
    'auto_accept_all', 'manual_approval_all'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof AgentConfig) => {
    const { options } = e.target;
    const values = Array.from(options)
      .filter(opt => opt.selected)
      .map(opt => opt.value);
    
    setFormData(prev => ({ 
      ...prev, 
      [field]: values 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('MindOp configuration saved!');
    console.log('Saving', formData);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Mi MindOp Configuration</h2>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${formData.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500">{formData.enabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MindOp Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Function</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
              placeholder="What does this MindOp do?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    name="enabled"
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2">MindOp enabled</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Template</label>
            <textarea
              name="prompt_template"
              value={formData.prompt_template}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="{{input}}"
            />
            <p className="mt-1 text-sm text-gray-500">Use &#123;&#123;input&#125;&#125; as placeholder for user input</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {formData.temperature}
              </label>
              <input
                name="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                name="max_tokens"
                type="number"
                value={formData.max_tokens}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verbosity Level</label>
              <div className="mt-1 flex space-x-4">
                {verbosityOptions.map(opt => (
                  <label key={opt} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="verbosity_level"
                      value={opt}
                      checked={formData.verbosity_level === opt}
                      onChange={handleChange}
                      className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Social Network Settings */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-3">MindOp Network Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discoverability</label>
                <select
                  name="discoverability"
                  value={formData.discoverability}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="public">Public (Anyone can find)</option>
                  <option value="private_link">Private Link (Only with direct link)</option>
                  <option value="private_invite_only">Private Invite Only (Hidden)</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Controls how other users can discover your MindOp</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Connection Policy</label>
                <select
                  name="connectionPolicy"
                  value={formData.connectionPolicy}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="auto_accept_all">Auto-accept all requests</option>
                  <option value="manual_approval_all">Manual approval required</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">How connection requests from other MindOps are handled</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <select
                multiple
                name="tags"
                value={formData.tags}
                onChange={e => handleMultiSelect(e, 'tags')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24"
              >
                {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
              <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Sources</label>
              <select
                multiple
                name="data_sources"
                value={formData.data_sources}
                onChange={e => handleMultiSelect(e, 'data_sources')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24"
              >
                {availableDataSources.map(ds => <option key={ds} value={ds}>{ds}</option>)}
              </select>
              <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (per min)</label>
                <input
                  name="rate_limit_per_minute"
                  type="number"
                  value={formData.rate_limit_per_minute}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  name="retry_on_fail"
                  type="checkbox"
                  checked={formData.retry_on_fail}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2">Retry on failure</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // Reset to default values
                setFormData({
                  name: 'My MindOp',
                  role: 'Personal Assistant', 
                  description: 'My personal AI agent that helps me with daily tasks and connects with other specialized MindOps.', 
                  prompt_template: '{{input}} - Process this request as a personal MindOp.', 
                  temperature: 0.7,
                  max_tokens: 512, 
                  verbosity_level: 'Medium', 
                  enabled: true, 
                  tags: ['Personal', 'Assistant'],
                  data_sources: ['MyData'], 
                  retry_on_fail: true, 
                  rate_limit_per_minute: 60,
                  model: 'gpt-4',
                  discoverability: 'public',
                  connectionPolicy: 'manual_approval_all'
                });
              }}
            >
              Reset
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Simplified Data component for CSV and Sheets connections
function Data() {
  const dataSources: DataSource[] = [
    { name: 'Personal CSV Data', type: 'CSV', status: 'Connected', lastSync: '2 days ago' },
    { name: 'Marketing Budget', type: 'Google Sheets', status: 'Connected', lastSync: '10 minutes ago' },
    { name: 'Research Results', type: 'CSV', status: 'Error', lastSync: '1 hour ago' },
    { name: 'Product Metrics', type: 'Google Sheets', status: 'Connected', lastSync: '30 minutes ago' },
  ];

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'CSV',
    url: '',
    sheetName: '',
    hasHeaders: true,
    syncInterval: 15,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewConnection(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Data Sources</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setActiveForm(activeForm ? null : 'choose')}
        >
          <span className="mr-2">+</span> Add Data Source
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dataSources.map((source, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 flex">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
              {source.type === 'Google Sheets' && '📊'}
              {source.type === 'CSV' && '📁'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{source.name}</h3>
              <div className="text-sm text-gray-500">{source.type}</div>
              <div className="flex items-center mt-2">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  source.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs">{source.status} • Last sync: {source.lastSync}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button className="text-gray-400 hover:text-gray-600">⚙️</button>
              <button className="text-gray-400 hover:text-gray-600">🔄</button>
            </div>
          </div>
        ))}
      </div>
      
      {activeForm && (
        <div className="bg-white rounded-lg shadow p-6">
          {activeForm === 'choose' && (
            <>
              <h3 className="text-lg font-medium mb-4">Connect New Data Source</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                  className="border rounded-lg p-4 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                  onClick={() => setActiveForm('sheets')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    📊
                  </div>
                  <div className="font-medium">Google Sheets</div>
                </div>
                
                <div 
                  className="border rounded-lg p-4 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                  onClick={() => setActiveForm('csv')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    📁
                  </div>
                  <div className="font-medium">CSV Upload</div>
                </div>
              </div>
            </>
          )}
          
          {activeForm === 'sheets' && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Google Sheets Connection</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveForm('choose')}
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newConnection.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Marketing Budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spreadsheet URL</label>
                  <input
                    type="text"
                    name="url"
                    value={newConnection.url}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sheet Name (optional)</label>
                  <input
                    type="text"
                    name="sheetName"
                    value={newConnection.sheetName}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Sheet1"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasHeaders"
                    checked={newConnection.hasHeaders}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">First row contains headers</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sync Interval (minutes)</label>
                  <input
                    type="number"
                    name="syncInterval"
                    value={newConnection.syncInterval}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="5"
                    max="1440"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      alert(`Connected to Google Sheet: ${newConnection.name}`);
                      setActiveForm(null);
                    }}
                  >
                    Connect to Sheet
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeForm === 'csv' && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">CSV File Upload</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveForm('choose')}
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newConnection.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Sales Data"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasHeaders"
                    checked={newConnection.hasHeaders}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">First row contains headers</label>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      alert(`CSV file uploaded: ${newConnection.name}`);
                      setActiveForm(null);
                    }}
                  >
                    Upload and Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// New Notifications component
function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      fromMindOp: 'Finance Expert',
      description: 'Specialized in financial analysis and budgeting',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'pending'
    },
    {
      id: '2',
      fromMindOp: 'Legal Advisor',
      description: 'Provides guidance on legal documents and compliance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'pending'
    },
    {
      id: '3',
      fromMindOp: 'Creative Writer',
      description: 'Helps with content creation and creative writing',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      status: 'pending'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent' | 'connected'>('incoming');
  
  // Handle accepting a connection request
  const handleAccept = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'accepted' } 
          : notification
      )
    );
  };
  
  // Handle rejecting a connection request
  const handleReject = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'rejected' } 
          : notification
      )
    );
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 ${
                activeTab === 'incoming'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming Requests
            </button>
            <button
              className={`px-4 py-3 ${
                activeTab === 'sent'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sent')}
            >
              Sent Requests
            </button>
            <button
              className={`px-4 py-3 ${
                activeTab === 'connected'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('connected')}
            >
              Connected MindOps
            </button>
          </nav>
        </div>
        
        <div className="p-4">
          {activeTab === 'incoming' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Requests</h3>
              
              {notifications.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {notifications.map(notification => (
                    <li key={notification.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            🤖
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{notification.fromMindOp}</p>
                            <p className="text-sm text-gray-500">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.timestamp.toLocaleDateString()} • {notification.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        
                        {notification.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAccept(notification.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(notification.id)}
                              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {notification.status === 'accepted' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            Accepted
                          </span>
                        )}
                        
                        {notification.status === 'rejected' && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                            Rejected
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No incoming connection requests
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'sent' && (
            <div className="text-center py-8 text-gray-500">
              You haven't sent any connection requests yet
            </div>
          )}
          
          {activeTab === 'connected' && (
            <div className="text-center py-8 text-gray-500">
              You don't have any connected MindOps yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Props para el componente principal
interface MindgrateAppProps {
  initialPage?: string;
}

// Componente principal para la aplicación
const MindgrateApp: React.FC<MindgrateAppProps> = ({ initialPage = 'Hub' }) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage); // Set Hub as default page
  const navigate = useNavigate(); // Hook de React Router para navegación
  
  // Actualizar la URL cuando cambia la página
  useEffect(() => {
    navigate(`/${currentPage.toLowerCase()}`);
  }, [currentPage, navigate]);

  // Updated renderPage function
  const renderPage = () => {
    switch (currentPage) {
      case 'Hub':
        return <Hub />;
      case 'MyMindOp':
        return <MyMindOp />;
      case 'Data':
        return <Data />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <Hub />; // Página por defecto si algo sale mal
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}

export default MindgrateApp; // Exporta el componente principal