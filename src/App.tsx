import React, { useState, useEffect } from 'react';

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
}

interface DataSource {
  name: string;
  type: string;
  status: 'Connected' | 'Error' | 'Pending';
  lastSync: string;
}

// Props para los componentes
interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export function Sidebar({ currentPage, setPage }: SidebarProps) {
  const menu: MenuItem[] = [
    { key: 'Dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'Hub', label: 'Hub', icon: '💬' },
    { key: 'Agent', label: 'Agent Builder', icon: '🤖' },
    { key: 'Data', label: 'Data Sources', icon: '📁' },
    { key: 'Settings', label: 'Settings', icon: '⚙️' },
    // Añadir nueva opción para Projects basado en el pitch deck
    { key: 'Projects', label: 'Projects', icon: '📋' },
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

export function Dashboard() {
  const stats: Stat[] = [
    { title: 'Active Agents', value: 12, change: '+3', color: 'bg-blue-500' },
    { title: 'Messages Today', value: 1432, change: '+24%', color: 'bg-green-500' },
    { title: 'Data Sources', value: 8, change: '+1', color: 'bg-purple-500' },
    { title: 'API Calls', value: '28.5k', change: '-2%', color: 'bg-yellow-500' },
  ];
  
  // Datos simulados para las gráficas
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  
  useEffect(() => {
    // Simular carga de datos para el gráfico de rendimiento
    const generatePerformanceData = () => {
      const data = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        data.push({
          date: date.toLocaleDateString('es-MX', { weekday: 'short' }),
          completion: Math.floor(Math.random() * 30) + 70,
          responseTime: Math.floor(Math.random() * 1000) + 500,
        });
      }
      return data;
    };
    
    setPerformanceData(generatePerformanceData());
  }, []);
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className={`w-10 h-10 rounded-full ${stat.color} mb-3 flex items-center justify-center text-white`}>
              {index === 0 && '🤖'}
              {index === 1 && '💬'}
              {index === 2 && '📁'}
              {index === 3 && '📈'}
            </div>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className={`ml-2 text-sm ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="mr-2">📊</span> Agent Performance
          </h3>
          <div className="h-64 bg-gray-50 rounded p-4">
            {/* Aquí iría un componente real de gráfica */}
            <div className="text-center text-gray-400">
              {performanceData.length > 0 ? (
                <div>
                  <div className="mb-4 text-left text-sm text-gray-700">
                    <p>Rendimiento semanal de los agentes:</p>
                  </div>
                  <div className="flex h-40 items-end space-x-2">
                    {performanceData.map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-blue-500 rounded-t" 
                          style={{ height: `${day.completion * 0.4}%` }}
                        ></div>
                        <div className="text-xs mt-1">{day.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                "Cargando datos de rendimiento..."
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="mr-2">⏱️</span> Recent Activities
          </h3>
          <div className="space-y-3">
            {[
              { icon: '🤖', action: 'New agent "Project Analyst" added', time: '2 minutes ago' },
              { icon: '📁', action: 'Connected to Jira API', time: '15 minutes ago' },
              { icon: '⚙️', action: 'System settings updated', time: '35 minutes ago' },
              { icon: '💬', action: 'New message from Resource Planner', time: '1 hour ago' },
              { icon: '📊', action: 'Project dashboard updated', time: '2 hours ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center border-b border-gray-100 pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{activity.action}</div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hub() {
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'agent', text: 'Hello! I\'m your Project Management Assistant. How can I help you today?' },
    { from: 'user', text: 'Can you help me analyze these project metrics?' },
    { from: 'agent', text: 'Of course! I can analyze your project metrics. Please provide the data or tell me which metrics you\'d like to focus on.' },
  ]);

  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Project Analyst');
  const [isLoading, setIsLoading] = useState(false);
  
  // Lista de agentes basada en el documento
  const agents = [
    'Project Analyst',
    'Risk Manager',
    'Resource Planner',
    'Budget Monitor',
    'Timeline Optimizer',
    'Communication Manager',
    'Quality Assurance',
    'Procurement Agent'
  ];
  
  // Simulación de respuestas basadas en el agente para agregar más contexto del documento
  const agentResponses: Record<string, string[]> = {
    'Project Analyst': [
      "Basado en los datos actuales, tu proyecto está progresando a un ritmo del 87% de lo planeado. Recomiendo revisar las dependencias entre las tareas 3 y 4.",
      "He analizado el rendimiento del equipo y detecto que hay una sobrecarga en el área de desarrollo frontend. Deberíamos considerar redistribuir algunas tareas.",
      "El análisis de ruta crítica muestra que tenemos poco margen en la fase de pruebas. Sugiero adelantar la contratación del personal adicional de QA."
    ],
    'Risk Manager': [
      "He identificado un nuevo riesgo: el proveedor principal tiene retrasos en la entrega. Impacto potencial: retraso de 2 semanas en la fase de producción.",
      "El análisis predictivo indica un 68% de probabilidad de cumplir la fecha de entrega actual. Recomiendo revisar el plan de contingencia.",
      "Basado en proyectos similares, hay un punto ciego en la integración con sistemas legacy. Deberíamos programar pruebas adicionales."
    ],
    'Resource Planner': [
      "La distribución actual de recursos muestra una subutilización del equipo de diseño en la semana 3. Podríamos adelantar algunas tareas de la fase 2.",
      "De acuerdo con el análisis de capacidades, necesitaremos un desarrollador backend adicional a partir del próximo sprint.",
      "La carga de trabajo del equipo está desbalanceada. Te sugiero revisar la asignación de tareas para evitar cuellos de botella."
    ]
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
    
    // Simulate agent response with a smart response based on agent type
    setTimeout(() => {
      setIsLoading(false);
      
      // Get a random response for the selected agent or a generic one
      const responses = agentResponses[selectedAgent] || [
        `I'm analyzing your request as the ${selectedAgent}.`,
        `Let me process that information as the ${selectedAgent}.`,
        `As the ${selectedAgent}, I'll need more details to provide a complete analysis.`
      ];
      
      const agentMessage: ChatMessage = { 
        from: 'agent', 
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setChat(prev => [...prev, agentMessage]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
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
              {agents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            <div className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Online
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded hover:bg-gray-100" title="View conversation history">
            <span className="text-gray-500">📋</span>
          </button>
          <button className="p-2 rounded hover:bg-gray-100" title="Agent settings">
            <span className="text-gray-500">⚙️</span>
          </button>
          <button className="p-2 rounded hover:bg-gray-100" title="Voice interaction">
            <span className="text-gray-500">🎤</span>
          </button>
        </div>
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

export function Agent() {
  const [formData, setFormData] = useState<AgentConfig>({
    name: 'Project Analyst',
    role: 'Analysis', 
    description: 'This agent analyzes project metrics and provides insights on project performance.', 
    prompt_template: '{{input}} - Analyze this from a project management perspective.', 
    temperature: 0.7,
    max_tokens: 512, 
    verbosity_level: 'Medium', 
    enabled: true, 
    tags: ['ProjectManagement', 'Analysis'],
    data_sources: ['ProjectDB', 'TimeTracking'], 
    retry_on_fail: true, 
    rate_limit_per_minute: 60,
    model: 'gpt-4'
  });

  // Opciones para los selects basadas en el documento
  const roles = ['Analysis', 'Planning', 'Risk Management', 'Resource Allocation', 'Reporting', 'Communication', 'Quality Assurance', 'Procurement'];
  const verbosityOptions: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
  const availableTags = ['ProjectManagement', 'Analysis', 'Planning', 'Budget', 'QA', 'Sprint', 'Risk', 'Communication', 'Stakeholder', 'Timeline', 'Resources'];
  const availableDataSources = ['ProjectDB', 'TimeTracking', 'Budget', 'External API', 'Logs', 'CRM', 'Jira', 'Asana', 'Notion', 'Slack', 'Teams', 'GitHub'];
  const models = ['gpt-3.5-turbo', 'gpt-4', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro'];
  
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
    alert('Agent configuration saved!');
    console.log('Saving', formData);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Agent Configuration</h2>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${formData.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500">{formData.enabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
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
              placeholder="What does this agent do?"
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
                {models.map(m => <option key={m} value={m}>{m}</option>)}
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
                  <span className="ml-2">Agent enabled</span>
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
            <p className="mt-1 text-sm text-gray-500">Use {'{{input}}'} as placeholder for user input</p>
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
                  name: 'Project Analyst',
                  role: 'Analysis', 
                  description: 'This agent analyzes project metrics and provides insights on project performance.', 
                  prompt_template: '{{input}} - Analyze this from a project management perspective.', 
                  temperature: 0.7,
                  max_tokens: 512, 
                  verbosity_level: 'Medium', 
                  enabled: true, 
                  tags: ['ProjectManagement', 'Analysis'],
                  data_sources: ['ProjectDB', 'TimeTracking'], 
                  retry_on_fail: true, 
                  rate_limit_per_minute: 60,
                  model: 'gpt-4'
                });
              }}
            >
              Reset
            </button>
            <button 
              type="button" 
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                alert(`Testing agent "${formData.name}"...\nThis would connect to the configured model and test the agent functionality.`);
              }}
            >
              Test Agent
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

export function Data() {
  const dataSources: DataSource[] = [
    { name: 'Project Database', type: 'SQL Database', status: 'Connected', lastSync: '2 minutes ago' },
    { name: 'Google Sheets - Budget', type: 'Google Sheets', status: 'Connected', lastSync: '10 minutes ago' },
    { name: 'Salesforce', type: 'API', status: 'Error', lastSync: '1 hour ago' },
    { name: 'Customer Data', type: 'CSV Upload', status: 'Connected', lastSync: '3 days ago' },
    { name: 'Jira', type: 'API', status: 'Connected', lastSync: '5 minutes ago' },
    { name: 'Slack Archive', type: 'API', status: 'Connected', lastSync: '15 minutes ago' },
  ];

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [newConnection, setNewConnection] = useState({
    type: '',
    url: '',
    sheetName: '',
    hasHeaders: true,
    apiKey: '',
    endpoint: '',
    username: '',
    password: '',
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
              {source.type === 'SQL Database' && '💾'}
              {source.type === 'API' && '🔌'}
              {source.type === 'CSV Upload' && '📁'}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  onClick={() => setActiveForm('database')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    💾
                  </div>
                  <div className="font-medium">Database</div>
                </div>
                
                <div 
                  className="border rounded-lg p-4 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                  onClick={() => setActiveForm('api')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    🔌
                  </div>
                  <div className="font-medium">API</div>
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
                      alert(`Connecting to Google Sheet: ${newConnection.url}`);
                      // Aquí iría la lógica para conectar con la hoja de cálculo
                      setActiveForm(null);
                    }}
                  >
                    Connect to Sheet
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeForm === 'api' && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">API Connection</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveForm('choose')}
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Name</label>
                  <select
                    name="type"
                    value={newConnection.type}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select API</option>
                    <option value="Jira">Jira</option>
                    <option value="Slack">Slack</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Salesforce">Salesforce</option>
                    <option value="Custom">Custom API</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                  <input
                    type="text"
                    name="endpoint"
                    value={newConnection.endpoint}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://api.example.com/v1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    name="apiKey"
                    value={newConnection.apiKey}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter API key"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      alert(`Connecting to ${newConnection.type || 'Custom'} API at ${newConnection.endpoint}`);
                      // Aquí iría la lógica para conectar con la API
                      setActiveForm(null);
                    }}
                  >
                    Connect to API
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeForm === 'database' && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Database Connection</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveForm('choose')}
                >
                  ← Back
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Type</label>
                  <select
                    name="type"
                    value={newConnection.type}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="SQL Server">SQL Server</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connection String / Host</label>
                  <input
                    type="text"
                    name="url"
                    value={newConnection.url}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="localhost:3306"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={newConnection.username}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={newConnection.password}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => {
                      alert(`Testing connection to ${newConnection.type} at ${newConnection.url}`);
                      // Aquí iría la lógica para conectar con la base de datos
                      setActiveForm(null);
                    }}
                  >
                    Test Connection
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

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    appName: 'Mindgrate',
    language: 'en',
    defaultModel: 'gpt-4',
    maxTokens: 512,
    theme: 'light',
    notifications: {
      email: true,
      errors: true,
      reports: false
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [group]: {
          ...(prev as any)[group],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex flex-wrap">
            <button 
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'general' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'api' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              API Keys
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'users' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'notifications' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
            {/* Añadir nueva pestaña para la Seguridad basada en el pitch deck */}
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'security' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security & Compliance
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Application Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                    <input
                      type="text"
                      name="appName"
                      value={settings.appName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Default Agent Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Model</label>
                    <select
                      name="defaultModel"
                      value={settings.defaultModel}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="claude-3-opus">Claude 3 Opus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Max Tokens</label>
                    <input
                      type="number"
                      name="maxTokens"
                      value={settings.maxTokens}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={handleChange}
                      className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={handleChange}
                      className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Dark</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={settings.theme === 'system'}
                      onChange={handleChange}
                      className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">System</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => alert('Settings saved successfully!')}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">API Keys</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">OpenAI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sk-••••••••••••••••••••</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 week ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Anthropic</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sk-ant-••••••••••••••</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 days ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                      {/* Añadir más proveedores de IA mencionados en el pitch */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Google AI</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AIza••••••••••••••••••</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 days ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => alert('Add new API key form would open here.')}
                >
                  Add New API Key
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">User Management</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Editor</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                      {/* Añadir más tipos de usuarios basados en el documento */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Carlos Rodriguez</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">carlos@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Project Manager</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maria Gomez</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">maria@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Viewer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add New User
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                    </div>
                    <label className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle-email" 
                        name="notifications.email"
                        checked={settings.notifications.email}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <span className={`block h-6 w-10 rounded-full transition-colors duration-200 ease-in ${settings.notifications.email ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${settings.notifications.email ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Agent Error Alerts</h4>
                      <p className="text-sm text-gray-500">Be notified when agents encounter errors</p>
                    </div>
                    <label className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle-errors" 
                        name="notifications.errors"
                        checked={settings.notifications.errors}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <span className={`block h-6 w-10 rounded-full transition-colors duration-200 ease-in ${settings.notifications.errors ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${settings.notifications.errors ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Weekly Reports</h4>
                      <p className="text-sm text-gray-500">Get weekly usage and performance reports</p>
                    </div>
                    <label className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle-reports" 
                        name="notifications.reports"
                        checked={settings.notifications.reports}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <span className={`block h-6 w-10 rounded-full transition-colors duration-200 ease-in ${settings.notifications.reports ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${settings.notifications.reports ? 'translate-x-4' : 'translate-x-0'}`}></span>
                      </span>
                    </label>
                  </div>
                  
                  {/* Añadir más opciones de notificaciones relevantes para gestión de proyectos */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Project Deadline Alerts</h4>
                      <p className="text-sm text-gray-500">Receive notifications about approaching deadlines</p>
                    </div>
                    <label className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle-deadlines" 
                        className="sr-only" 
                      />
                      <span className="block h-6 w-10 rounded-full bg-gray-300">
                        <span className="block h-6 w-6 rounded-full bg-white shadow transform translate-x-0"></span>
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Risk Alerts</h4>
                      <p className="text-sm text-gray-500">Get alerts when new project risks are identified</p>
                    </div>
                    <label className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle-risks" 
                        className="sr-only" 
                      />
                      <span className="block h-6 w-10 rounded-full bg-gray-300">
                        <span className="block h-6 w-6 rounded-full bg-white shadow transform translate-x-0"></span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Nueva pestaña de seguridad basada en lo mencionado en el documento */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Security & Compliance Settings</h3>
                
                <div className="border-b pb-4 mb-4">
                  <h4 className="font-medium mb-2">Data Governance</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Residency</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="us">United States</option>
                        <option value="eu">European Union</option>
                        <option value="mx">Mexico</option>
                        <option value="la">Latin America</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Select the geographic region where your data will be stored and processed.</p>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable Data Encryption at Rest</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable TLS/HTTPS for all connections</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4 mb-4">
                  <h4 className="font-medium mb-2">Access Control</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={false}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enforce IP Restrictions</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        defaultValue={30}
                        min={5}
                        max={1440}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-4 mb-4">
                  <h4 className="font-medium mb-2">Compliance</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={true}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable Audit Logging</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period (days)</label>
                      <input
                        type="number"
                        defaultValue={90}
                        min={30}
                        max={3650}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">How long to retain user activity data for compliance purposes.</p>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={false}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable Data Anonymization for Benchmarking</span>
                      </label>
                      <p className="ml-6 mt-1 text-xs text-gray-500">When enabled, project data used for benchmarking will be anonymized.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Save Security Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Nuevo componente para la gestión de proyectos (mencionado en el pitch deck)
export function Projects() {
  const [projects] = useState([
    { 
      id: 1, 
      name: 'Website Redesign', 
      status: 'In Progress', 
      completion: 65, 
      dueDate: '2025-06-15',
      priority: 'High',
      manager: 'Jane Smith',
      team: ['Design', 'Development', 'QA'],
      risksCount: 3
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      status: 'Planning', 
      completion: 20, 
      dueDate: '2025-08-30',
      priority: 'Medium',
      manager: 'John Doe',
      team: ['Development', 'UX Research'],
      risksCount: 2
    },
    { 
      id: 3, 
      name: 'CRM Integration', 
      status: 'On Hold', 
      completion: 40, 
      dueDate: '2025-07-10',
      priority: 'Low',
      manager: 'Carlos Rodriguez',
      team: ['Development', 'IT'],
      risksCount: 5
    },
    { 
      id: 4, 
      name: 'Product Launch Campaign', 
      status: 'In Progress', 
      completion: 75, 
      dueDate: '2025-05-30',
      priority: 'Critical',
      manager: 'Maria Gomez',
      team: ['Marketing', 'Sales', 'Design'],
      risksCount: 1
    },
  ]);
  
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const statusColors: Record<string, string> = {
    'Planning': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-green-100 text-green-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-gray-100 text-gray-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  
  const priorityColors: Record<string, string> = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-md">
            <button 
              className={`p-2 ${viewType === 'grid' ? 'bg-blue-100' : 'bg-white'}`}
              onClick={() => setViewType('grid')}
              title="Grid View"
            >
              📊
            </button>
            <button 
              className={`p-2 ${viewType === 'list' ? 'bg-blue-100' : 'bg-white'}`}
              onClick={() => setViewType('list')}
              title="List View"
            >
              📋
            </button>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <span className="mr-2">+</span> New Project
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full border border-gray-300 rounded-md pl-10 py-2"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
          
          <div className="ml-4">
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="ml-4">
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <div>{new Date(project.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Priority:</span>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${priorityColors[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Manager:</span>
                    <div>{project.manager}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Risks:</span>
                    <div className="flex items-center">
                      <span className="text-red-500 mr-1">⚠️</span>
                      <span>{project.risksCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-b-lg">
                <div className="flex flex-wrap gap-2">
                  {project.team.map((department, i) => (
                    <span key={i} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      {department}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProject(project.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">
                      {project.team.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                      <span>{project.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[project.priority]}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.manager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
            {/* Modal para detalles del proyecto */}
            {selectedProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                  <h3 className="text-lg font-medium mb-4">Project Details</h3>
                  <button 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedProject(null)}
                  >
                    ✕
                  </button>
                  {/* Add project details content here */}
                </div>
              </div>
            )}
          </div>
        );
      }
