// src/features/data/Data.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import type { DataSource } from '../../types';

// Simplified Data component for CSV and Sheets connections
export function Data() {
  const { user, loading: authLoading } = useAuth();

  // Estados del componente
  const [activeMindOpId, setActiveMindOpId] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoadingMindOp, setIsLoadingMindOp] = useState<boolean>(true);
  const [isLoadingDataSources, setIsLoadingDataSources] = useState<boolean>(false);
  const [isAddingDataSource, setIsAddingDataSource] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null; message: string }>({ 
    type: null, 
    message: '' 
  });

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'CSV',
    url: '',
    sheetName: '',
    hasHeaders: true,
    syncInterval: 15,
  });

  // Función para obtener el ID del MindOp activo del usuario
  const loadActiveMindOp = async () => {
    if (!user?.id) return;

    setIsLoadingMindOp(true);
    setStatusMessage({ type: null, message: '' });

    try {
      const { data: mindOpData, error } = await supabase
        .from('MindOps')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró ningún MindOp
          setStatusMessage({ 
            type: 'error', 
            message: 'No MindOp found. Please create a MindOp first.' 
          });
        } else {
          console.error('Error loading MindOp:', error);
          setStatusMessage({ 
            type: 'error', 
            message: 'Error loading MindOp: ' + error.message 
          });
        }
        return;
      }

      if (mindOpData) {
        setActiveMindOpId(mindOpData.id);
      }
    } catch (error) {
      console.error('Unexpected error loading MindOp:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Unexpected error loading MindOp' 
      });
    } finally {
      setIsLoadingMindOp(false);
    }
  };

  // Función para cargar los DataSources del MindOp activo
  const loadDataSources = async () => {
    if (!activeMindOpId) return;

    setIsLoadingDataSources(true);
    setStatusMessage({ type: null, message: '' });

    try {
      const { data: dataSourcesData, error } = await supabase
        .from('DataSources')
        .select('*')
        .eq('mind_op_id', activeMindOpId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading DataSources:', error);
        setStatusMessage({ 
          type: 'error', 
          message: 'Error loading data sources: ' + error.message 
        });
        return;
      }

      // Mapear los datos de la base de datos al formato esperado por la interfaz
      const mappedDataSources: DataSource[] = (dataSourcesData || []).map(ds => ({
        name: ds.name,
        type: ds.type as 'CSV' | 'Google Sheets',
        status: ds.status as 'Connected' | 'Error' | 'Pending',
        lastSync: formatLastSync(ds.created_at) // Usar created_at como aproximación de lastSync
      }));

      setDataSources(mappedDataSources);
    } catch (error) {
      console.error('Unexpected error loading DataSources:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Unexpected error loading data sources' 
      });
    } finally {
      setIsLoadingDataSources(false);
    }
  };

  // Función auxiliar para formatear la fecha de último sync
  const formatLastSync = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // useEffect para cargar el MindOp activo
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadActiveMindOp();
    }
  }, [user?.id, authLoading]);

  // useEffect para cargar los DataSources cuando se obtiene el activeMindOpId
  useEffect(() => {
    if (activeMindOpId) {
      loadDataSources();
    }
  }, [activeMindOpId]);

  // Función para manejar la adición de un nuevo DataSource
  const handleAddDataSource = async () => {
    // Validaciones previas
    if (!activeMindOpId) {
      setStatusMessage({ 
        type: 'error', 
        message: 'No active MindOp found to associate data source.' 
      });
      return;
    }

    if (!newConnection.name.trim()) {
      setStatusMessage({ 
        type: 'error', 
        message: 'Name is required.' 
      });
      return;
    }

    if (activeForm === 'sheets' && !newConnection.url.trim()) {
      setStatusMessage({ 
        type: 'error', 
        message: 'Spreadsheet URL is required for Google Sheets.' 
      });
      return;
    }

    setIsAddingDataSource(true);
    setStatusMessage({ type: null, message: '' });

    try {
      // Preparar datos para insertar
      const type = activeForm === 'sheets' ? 'Google Sheets' : 'CSV';
      
      // Preparar metadatos
      const metadata: Record<string, any> = {
        hasHeaders: newConnection.hasHeaders
      };
      
      if (activeForm === 'sheets' && newConnection.sheetName) {
        metadata.sheetName = newConnection.sheetName;
      }

      // Preparar datos de inserción
      const insertData = {
        name: newConnection.name.trim(),
        type: type,
        url: activeForm === 'sheets' ? newConnection.url.trim() : null,
        metadata: metadata,
        mind_op_id: activeMindOpId,
        status: activeForm === 'sheets' ? 'Connected' : 'Pending' // Google Sheets: Connected, CSV: Pending
      };

      const { data, error } = await supabase
        .from('DataSources')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error adding DataSource:', error);
        setStatusMessage({ 
          type: 'error', 
          message: 'Error adding data source: ' + error.message 
        });
        return;
      }

      // Éxito: añadir el nuevo DataSource al estado local
      const newDataSource: DataSource = {
        name: data.name,
        type: data.type as 'CSV' | 'Google Sheets',
        status: data.status as 'Connected' | 'Error' | 'Pending',
        lastSync: 'Just now'
      };

      setDataSources(prev => [newDataSource, ...prev]);
      
      // Resetear formulario
      setNewConnection({
        name: '',
        type: 'CSV',
        url: '',
        sheetName: '',
        hasHeaders: true,
        syncInterval: 15,
      });
      setActiveForm(null);

      setStatusMessage({ 
        type: 'success', 
        message: `${type} data source added successfully!` 
      });

    } catch (error) {
      console.error('Unexpected error adding DataSource:', error);
      setStatusMessage({ 
        type: 'error', 
        message: 'Unexpected error adding data source' 
      });
    } finally {
      setIsAddingDataSource(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewConnection(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Mostrar loading mientras se cargan los datos iniciales
  if (isLoadingMindOp) {
    return (
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading MindOp...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Data Sources</h2>
        <button 
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
            !activeMindOpId || isAddingDataSource ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => setActiveForm(activeForm ? null : 'choose')}
          disabled={!activeMindOpId || isAddingDataSource}
        >
          <span className="mr-2">+</span> Add Data Source
        </button>
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

      {/* No MindOp Warning */}
      {!activeMindOpId && !isLoadingMindOp && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please configure your MindOp first before adding data sources.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DataSources Grid */}
      {isLoadingDataSources ? (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading data sources...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dataSources.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No data sources connected yet.</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Data Source" to get started.</p>
            </div>
          ) : (
            dataSources.map((source, index) => (
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
                      source.status === 'Connected' ? 'bg-green-500' : 
                      source.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    <span className="text-xs">{source.status} • Last sync: {source.lastSync}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="text-gray-400 hover:text-gray-600" title="Settings">⚙️</button>
                  <button className="text-gray-400 hover:text-gray-600" title="Refresh">🔄</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {activeForm && (
        <div className="bg-white rounded-lg shadow p-6">
          {activeForm === 'choose' && (
            <>
              <h3 className="text-lg font-medium mb-4">Connect New Data Source</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 cursor-pointer ${
                    isAddingDataSource ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !isAddingDataSource && setActiveForm('sheets')}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    📊
                  </div>
                  <div className="font-medium">Google Sheets</div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center hover:bg-blue-50 hover:border-blue-300 cursor-pointer ${
                    isAddingDataSource ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !isAddingDataSource && setActiveForm('csv')}
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
                  disabled={isAddingDataSource}
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
                    disabled={isAddingDataSource}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isAddingDataSource}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={isAddingDataSource}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Sheet1"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasHeaders"
                    checked={newConnection.hasHeaders}
                    onChange={handleInputChange}
                    disabled={isAddingDataSource}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label className="ml-2 text-sm text-gray-700">First row contains headers</label>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    onClick={handleAddDataSource}
                    disabled={isAddingDataSource}
                  >
                    {isAddingDataSource && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isAddingDataSource ? 'Connecting...' : 'Connect to Sheet'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeForm === 'csv' && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">CSV Data Source</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setActiveForm('choose')}
                  disabled={isAddingDataSource}
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
                    disabled={isAddingDataSource}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Sales Data"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CSV File (MVP - Metadata Only)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
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
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">File upload coming soon</p>
                        <p>For now, we'll save the metadata</p>
                      </div>
                      <p className="text-xs text-gray-500">CSV up to 10MB (future feature)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasHeaders"
                    checked={newConnection.hasHeaders}
                    onChange={handleInputChange}
                    disabled={isAddingDataSource}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label className="ml-2 text-sm text-gray-700">First row contains headers</label>
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    onClick={handleAddDataSource}
                    disabled={isAddingDataSource}
                  >
                    {isAddingDataSource && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isAddingDataSource ? 'Adding...' : 'Add CSV Data Source'}
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