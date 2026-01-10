export enum RiskLevel {
  SAFE = 'SAFE',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface RiskAnalysis {
  score: number; // 0-100
  level: RiskLevel;
  details: {
    textScore: number;
    behaviorScore: number;
    contextScore: number;
    matchedKeywords: string[];
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RiskZone {
  id: string;
  lat: number;
  lng: number;
  type: 'ATM' | 'BANK';
  name: string;
  address?: string;
}

export interface TrustedContact {
  name: string;
  phone: string;
  isEnabled: boolean;
}

export interface AppState {
  inputText: string;
  isCallActive: boolean;
  isAtATM: boolean;
  activeView: 'dashboard' | 'analyze' | 'report';
  // Location & Map Features
  userLocation: Coordinates | null;
  riskZones: RiskZone[];
  detectionRadius: number; // in meters
  showSettings: boolean;
  // Personal Safety Settings
  trustedContact: TrustedContact;
  notifyOnRiskLevel: RiskLevel; // Level at which to auto-trigger SMS/Actions
}

export interface ScamReport {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  location: string;
}