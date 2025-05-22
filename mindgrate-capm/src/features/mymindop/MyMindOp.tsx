// src/features/mymindop/MyMindOp.tsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import type { AgentConfig } from '../../types';

// Renamed and updated Agent component to MyMindOp
export function MyMindOp() {
  const { user, loading: authLoading } = useAuth();

  // Estados del componente
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

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mindOpId, setMindOpId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; message: string }>({ 
    type: null, 
    message: '' 
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

  // Función para cargar la configuración del MindOp desde Supabase
  const loadMindOpConfig = async () => {
    if (!user?.id) return;

    setIsLoadingData(true);
    setStatusMessage({ type: null, message: '' });

    try {
      const { data: mindOpData, error } = await supabase
        .from('MindOps')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró ningún MindOp, mantener los valores por defecto
          console.log('No existing MindOp found, creating new one');
        } else {
          console.error('Error loading MindOp:', error);
          setStatusMessage({ 
            type: 'error', 
            message: 'Error loading MindOp configuration: ' + error.message 
          });
        }
        return;
      }

      if (mindOpData) {
        // Mapear los datos de la base de datos al estado del formulario
        setFormData({
          name: mindOpData.name || 'My MindOp',
          role: mindOpData.role || 'Personal Assistant',
          description: mindOpData.description || '',
          prompt_template: mindOpData.prompt_template || '{{input}} - Process this request as a personal MindOp.',
          temperature: mindOpData.temperature || 0.7,
          max_tokens: mindOpData.max_tokens || 512,
          verbosity_level: mindOpData.verbosity_level || 'Medium',
          enabled: mindOpData.enabled !== false, // Default to true if null
          tags: mindOpData.tags || ['Personal', 'Assistant'],
          data_sources: mindOpData.data_sources || ['MyData'],
          retry_on_fail: mindOpData.retry_on_fail !== false, // Default to true if null
          rate_limit_per_minute: mindOpData.rate_limit_per_minute || 60,
          model: mindOpData.model || 'gpt-4',
          discoverability: mindOpData.discoverability || 'public',
          connectionPolicy: mindOpData.connection_policy || 'manual_approval_all'
        });

        setMindOpId(mindOpData.id);
        setStatusMessage({ 
          type: 'success', 
          message: 'MindOp configuration loaded successfully' 
        });
      }
    } catch (error) {
      console.error('Unexpected error loading MindOp:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Unexpected error loading configuration' 
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // useEffect para cargar la configuración cuando el user esté disponible
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadMindOpConfig();
    }
  }, [user?.id, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setStatusMessage({ 
        type: 'error', 
        message: 'User not authenticated' 
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage({ type: null, message: '' });

    try {
      if (mindOpId) {
        // Actualizar MindOp existente
        const updateData = {
          name: formData.name,
          role: formData.role,
          description: formData.description,
          prompt_template: formData.prompt_template,
          temperature: formData.temperature,
          max_tokens: formData.max_tokens,
          verbosity_level: formData.verbosity_level,
          enabled: formData.enabled,
          tags: formData.tags,
          data_sources: formData.data_sources,
          retry_on_fail: formData.retry_on_fail,
          rate_limit_per_minute: formData.rate_limit_per_minute,
          model: formData.model,
          discoverability: formData.discoverability,
          connection_policy: formData.connectionPolicy,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('MindOps')
          .update(updateData)
          .eq('id', mindOpId)
          .select()
          .single();

        if (error) {
          console.error('Error updating MindOp:', error);
          setStatusMessage({ 
            type: 'error', 
            message: 'Error updating configuration: ' + error.message 
          });
          return;
        }

        setStatusMessage({ 
          type: 'success', 
          message: 'MindOp configuration updated successfully!' 
        });

      } else {
        // Crear nuevo MindOp
        const newMindOpId = uuidv4();
        
        // Obtener la URL base del proyecto Supabase desde variables de entorno
        const projectBaseUrl = import.meta.env.VITE_SUPABASE_URL;

        if (!projectBaseUrl) {
          console.error("VITE_SUPABASE_URL no está definida en las variables de entorno del frontend.");
          setStatusMessage({ 
            type: 'error', 
            message: 'Error de configuración: No se pudo determinar la URL base para el Agent Card.' 
          });
          setIsSaving(false);
          return;
        }

        // Definir el nombre de la Edge Function A2A
        const a2aEndpointFunctionName = 'a2a-service-endpoint';

        // Construir el newAgentCardUrl correctamente
        const newAgentCardUrl = `${projectBaseUrl}/functions/v1/${a2aEndpointFunctionName}/${newMindOpId}`;

        // Mapear formData a los nombres de columna de la base de datos (snake_case)
        const insertData = {
          id: newMindOpId,
          user_id: user.id,
          name: formData.name,
          role: formData.role,
          description: formData.description,
          prompt_template: formData.prompt_template,
          temperature: formData.temperature,
          max_tokens: formData.max_tokens,
          verbosity_level: formData.verbosity_level,
          enabled: formData.enabled,
          tags: formData.tags,
          data_sources: formData.data_sources,
          retry_on_fail: formData.retry_on_fail,
          rate_limit_per_minute: formData.rate_limit_per_minute,
          model: formData.model,
          discoverability: formData.discoverability,
          connection_policy: formData.connectionPolicy,
          agent_card_url: newAgentCardUrl
        };

        const { data, error } = await supabase
          .from('MindOps')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Error creating MindOp:', error);
          if (error.code === '23505' && error.message.includes('agent_card_url')) {
            setStatusMessage({ 
              type: 'error', 
              message: 'Agent card URL already exists. Please try again.' 
            });
          } else {
            setStatusMessage({ 
              type: 'error', 
              message: 'Error creating MindOp: ' + error.message 
            });
          }
          return;
        }

        setMindOpId(newMindOpId);
        
        // Actualizar formData con el agent_card_url generado
        setFormData(prev => ({...prev, agent_card_url: newAgentCardUrl}));
        
        setStatusMessage({ 
          type: 'success', 
          message: 'MindOp created successfully!' 
        });
      }
    } catch (error) {
      console.error('Unexpected error saving MindOp:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Unexpected error saving configuration' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
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
    setMindOpId(null);
    setStatusMessage({ type: null, message: '' });
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoadingData) {
    return (
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading MindOp configuration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {mindOpId ? 'Edit MindOp Configuration' : 'Create New MindOp'}
          </h2>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${formData.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500">{formData.enabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage.type && (
          <div className={`mb-4 p-4 rounded-md ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-400 text-green-700' 
              : 'bg-red-50 border-l-4 border-red-400 text-red-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {statusMessage.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{statusMessage.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MindOp Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role / Function</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSaving}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isSaving}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isSaving}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSaving}
                      className="rounded-full border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isSaving}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isSaving}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-24 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isSaving}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  name="retry_on_fail"
                  type="checkbox"
                  checked={formData.retry_on_fail}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className="ml-2">Retry on failure</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}