
export interface Channel {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  isLive: boolean;
  viewers?: number;
  category?: string;
  addedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  speed: number;
  status: 'uploading' | 'completed' | 'failed' | 'paused';
}

export interface DownloadProgress {
  id: string;
  fileName: string;
  progress: number;
  speed: number;
  status: 'downloading' | 'completed' | 'failed' | 'paused';
}

export interface NetworkSpeed {
  uploadSpeed: number;
  downloadSpeed: number;
  lastUpdated: Date;
}
