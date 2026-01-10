import { RiskLevel } from './types';

// Risk Weights
export const WEIGHTS = {
  TEXT: 0.40,
  BEHAVIOR: 0.35,
  CONTEXT: 0.25
};

// Thai Scam Keywords
export const SCAM_KEYWORDS = [
  'โอนเงิน', // transfer money
  'ด่วน', // urgent
  'ระงับ', // suspend
  'บัญชี', // account
  'ตรวจสอบ', // inspect/verify
  'ผู้โชคดี', // lucky person/winner
  'รางวัล', // prize
  'ลิงก์', // link
  'คลิก', // click
  'รหัส', // code/password
  'OTP',
  'ตำรวจ', // police
  'ศาล', // court
  'พัสดุ', // parcel
  'ค้างชำระ' // overdue payment
];

// Color mapping for risk levels - Softer, friendlier palette
export const RISK_COLORS = {
  [RiskLevel.SAFE]: 'text-[#4cd964]', // Soft Green
  [RiskLevel.MEDIUM]: 'text-[#ffcc00]', // Soft Yellow
  [RiskLevel.HIGH]: 'text-[#ff9500]', // Soft Orange
  [RiskLevel.CRITICAL]: 'text-[#ff3b30]', // Soft Red/Coral
};

export const RISK_BG_COLORS = {
  [RiskLevel.SAFE]: 'bg-[#4cd964]',
  [RiskLevel.MEDIUM]: 'bg-[#ffcc00]',
  [RiskLevel.HIGH]: 'bg-[#ff9500]',
  [RiskLevel.CRITICAL]: 'bg-[#ff3b30]',
};

export const RISK_LABELS_TH = {
  [RiskLevel.SAFE]: 'ปลอดภัยดี',
  [RiskLevel.MEDIUM]: 'น่าสงสัย',
  [RiskLevel.HIGH]: 'ควรระวัง',
  [RiskLevel.CRITICAL]: 'ตรวจสอบด่วน',
};

export const RISK_LABELS_EN = {
  [RiskLevel.SAFE]: 'Secure',
  [RiskLevel.MEDIUM]: 'Caution',
  [RiskLevel.HIGH]: 'Check Needed',
  [RiskLevel.CRITICAL]: 'Action Required',
};

// Branding Colors
export const BRAND = {
  PRIMARY: '#0057B8', // Trust Blue
  SECONDARY: '#4cd964', // Soft Green
  BACKGROUND: '#051024',
  SURFACE: '#0f2445',
};