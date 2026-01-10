import React, { useEffect, useState } from 'react';
import { RiskLevel, TrustedContact } from '../types';
import { ShieldAlert, BellRing, Phone, MessageSquare, X, Clock, Send } from 'lucide-react';

interface RiskOverlayProps {
  level: RiskLevel;
  contact: TrustedContact;
  onDismiss: () => void;
}

const RiskOverlay: React.FC<RiskOverlayProps> = ({ level, contact, onDismiss }) => {
  const [countdown, setCountdown] = useState(10);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const isCritical = level === RiskLevel.CRITICAL;

  useEffect(() => {
    // Reset state when level changes
    setCountdown(10);
    setIsSendingSMS(false);
    setSmsSent(false);

    // High Risk Countdown Logic
    if (level === RiskLevel.HIGH) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // After 10s delay, simulate preparing the alert
            setIsSendingSMS(true);
            setTimeout(() => {
                setIsSendingSMS(false);
                setSmsSent(true);
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } 
    
    // Critical Risk: Immediate Action
    if (level === RiskLevel.CRITICAL) {
        setCountdown(0);
        setIsSendingSMS(true);
        setTimeout(() => {
            setIsSendingSMS(false);
            setSmsSent(true);
        }, 1500);
    }

  }, [level]);

  // Generate SMS Link
  const getSMSLink = () => {
    const message = isCritical 
        ? `[SOS] ช่วยด้วย! ฉันอาจกำลังถูกหลอกโอนเงิน พิกัด: GPS_LOCATION (ระบบอุ่นใจ)` 
        : `[Alert] ระบบอุ่นใจตรวจพบความเสี่ยงสูง ช่วยติดต่อฉันกลับหน่อย`;
    
    // Check if iOS or Android for delimiter (not strictly necessary for simple body but good practice)
    const separator = navigator.userAgent.match(/iPhone|iPad|iPod/i) ? '&' : '?';
    return `sms:${contact.phone}${separator}body=${encodeURIComponent(message)}`;
  };

  // If Safe/Medium, don't show overlay
  if (level === RiskLevel.SAFE || level === RiskLevel.MEDIUM) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop with Red tint for Critical, Orange for High */}
      <div 
        className={`absolute inset-0 backdrop-blur-md transition-colors duration-500 ${isCritical ? 'bg-red-950/80' : 'bg-orange-950/70'}`}
        onClick={onDismiss} 
      />

      {/* Main Card - Samsung Bottom Sheet Style */}
      <div className="relative bg-[#051024] rounded-t-[2.5rem] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[90vh] flex flex-col">
        
        {/* Pulsing Status Indicator */}
        <div className={`w-full h-2 ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />

        <div className="p-8 flex flex-col items-center text-center space-y-6">
            
            {/* Icon */}
            <div className={`p-6 rounded-full ${isCritical ? 'bg-red-500/20' : 'bg-orange-500/20'} relative`}>
                <div className={`absolute inset-0 rounded-full animate-ping ${isCritical ? 'bg-red-500/30' : 'bg-orange-500/20'}`} />
                {isCritical ? <BellRing className="w-12 h-12 text-red-500" /> : <ShieldAlert className="w-12 h-12 text-orange-500" />}
            </div>

            {/* Texts */}
            <div className="space-y-2">
                <h2 className={`text-3xl font-bold font-prompt ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                    {isCritical ? 'อันตรายสูงสุด!' : 'ความเสี่ยงสูง'}
                </h2>
                <p className="text-white/80 text-lg">
                    {isCritical 
                        ? 'ระบบตรวจพบพฤติกรรมเสี่ยงระดับวิกฤต กรุณายุติการสนทนาทันที' 
                        : 'มีโอกาสสูงที่จะเป็นมิจฉาชีพ กรุณาตรวจสอบข้อมูลก่อนโอนเงิน'}
                </p>
            </div>

            {/* Dynamic Status Box */}
            <div className="w-full bg-[#0f2445] rounded-2xl p-4 border border-blue-900/30">
                {!isCritical && countdown > 0 ? (
                    <div className="flex items-center justify-between text-orange-400">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="w-4 h-4" /> ระบบจะแจ้งเตือนครอบครัวใน
                        </span>
                        <span className="text-2xl font-bold font-mono">{countdown}s</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {isSendingSMS ? (
                            <div className="flex items-center justify-center gap-3 text-blue-300">
                                <Send className="w-5 h-5 animate-bounce" />
                                <span>กำลังเตรียมข้อมูลแจ้งเตือน...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-3 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                                <div className="text-left text-sm">
                                    <div className="font-bold">เตรียมข้อความแล้ว</div>
                                    <div className="text-xs opacity-70">ถึง: {contact.name || 'Emergency Contact'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 pt-2">
                {/* 1. SMS / Notify Button */}
                <a 
                   href={getSMSLink()}
                   className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 ${
                       smsSent ? 'bg-green-600 shadow-lg shadow-green-900/30' : 'bg-slate-700 opacity-50 cursor-not-allowed pointer-events-none'
                   }`}
                   style={{ pointerEvents: smsSent ? 'auto' : 'none', opacity: smsSent ? 1 : 0.5 }}
                >
                    <MessageSquare className="w-5 h-5" />
                    {smsSent ? 'กดเพื่อส่งข้อความแจ้งเตือน' : 'รอระบบเตรียมข้อมูล...'}
                </a>

                {/* 2. Call Button (Always Active for Critical) */}
                <a 
                    href={`tel:${contact.phone}`}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${isCritical ? 'bg-red-600 shadow-red-900/30' : 'bg-[#0057B8] shadow-blue-900/30'}`}
                >
                    <Phone className="w-5 h-5" />
                    โทรหา {contact.name || 'คนสนิท'}
                </a>

                {/* 3. Dismiss Button */}
                <button 
                    onClick={onDismiss}
                    className="w-full py-4 text-white/40 text-sm font-medium hover:text-white transition-colors"
                >
                    รับทราบความเสี่ยง (Dismiss)
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default RiskOverlay;