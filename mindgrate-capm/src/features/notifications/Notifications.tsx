// src/features/notifications/Notifications.tsx
import React, { useState } from 'react';
import type { NotificationItem } from '../../types';

// New Notifications component
export function Notifications() {
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