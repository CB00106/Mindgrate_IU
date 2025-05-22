// src/types/index.ts

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
}

export interface Stat {
  title: string;
  value: number | string;
  change: string;
  color: string;
}

export interface ChatMessage {
  from: 'user' | 'agent';
  text: string;
  timestamp?: Date;
}

// Updated AgentConfig interface with new social network fields
export interface AgentConfig {
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
export interface DataSource {
  name: string;
  type: 'CSV' | 'Google Sheets';
  status: 'Connected' | 'Error' | 'Pending';
  lastSync: string;
}

// New interface for MindOp discovery results
export interface MindOpProfile {
  id: string;
  name: string;
  description: string;
  tags: string[];
  connectionStatus: 'none' | 'pending' | 'connected';
}

// New interface for connection notifications
export interface NotificationItem {
  id: string;
  fromMindOp: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}