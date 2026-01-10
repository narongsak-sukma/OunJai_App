import React from 'react';
import { X, MapPin, Zap, User, Phone, Shield, Bell } from 'lucide-react';
import { RiskLevel, TrustedContact } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  radius: number;
  onRadiusChange: (value: number) => void;
  contact: TrustedContact;
  onContactChange: (contact: TrustedContact) => void;
  notifyLevel: RiskLevel;
  onNotifyLevelChange: (level: RiskLevel) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  radius, 
  onRadiusChange,
  contact,
  onContactChange,
  notifyLevel,
  onNotifyLevelChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-[#051024] animate-in slide-in-from-bottom duration-300">
      {/* Samsung One UI Style Header */}
      <div className="pt-12 pb-6 px-6 bg-[#051024] border-b border-blue-900/20 shrink-0 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white font-prompt">การตั้งค่า</h2>
          <p className="text-blue-200/60 text-sm">Settings & Safety</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-blue-900/20 rounded-full text-blue-200 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Section: Trusted Contact */}
        <div className="space-y-3">
          <h3 className="text-blue-300 text-xs font-bold uppercase tracking-wider ml-2">ผู้ติดต่อฉุกเฉิน (Trusted Contact)</h3>
          <div className="bg-[#0f2445] rounded-3xl overflow-hidden border border-blue-900/30">
            <div className="p-4 border-b border-blue-900/30 flex items-center gap-4">
              <User className="text-[#0057B8] w-5 h-5" />
              <div className="flex-1">
                <label className="text-xs text-blue-200/50 block">ชื่อ (Name)</label>
                <input 
                  type="text" 
                  value={contact.name}
                  onChange={(e) => onContactChange({...contact, name: e.target.value})}
                  className="w-full bg-transparent text-white outline-none placeholder:text-blue-200/20"
                  placeholder="เช่น พี่สาว, คุณพ่อ"
                />
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <Phone className="text-[#0057B8] w-5 h-5" />
              <div className="flex-1">
                <label className="text-xs text-blue-200/50 block">เบอร์โทรศัพท์ (Phone)</label>
                <input 
                  type="tel" 
                  value={contact.phone}
                  onChange={(e) => onContactChange({...contact, phone: e.target.value})}
                  className="w-full bg-transparent text-white outline-none placeholder:text-blue-200/20"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-blue-200/40 px-2">
            ระบบจะเตรียมส่งข้อความหาบุคคลนี้เมื่อระดับความเสี่ยงถึงขั้นวิกฤต
          </p>
        </div>

        {/* Section: Automation Rules */}
        <div className="space-y-3">
          <h3 className="text-blue-300 text-xs font-bold uppercase tracking-wider ml-2">การแจ้งเตือนอัตโนมัติ (Automation)</h3>
          <div className="bg-[#0f2445] rounded-3xl overflow-hidden border border-blue-900/30 p-4">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <Bell className="text-[#ff9500] w-5 h-5" />
                   <div>
                      <h4 className="text-white text-sm font-medium">ระดับความเสี่ยงที่จะแจ้งเตือน</h4>
                      <p className="text-blue-200/50 text-xs">Send SMS Alert at Risk Level</p>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onNotifyLevelChange(RiskLevel.HIGH)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${notifyLevel === RiskLevel.HIGH ? 'bg-[#ff9500]/20 border-[#ff9500] text-[#ff9500]' : 'bg-blue-900/10 border-transparent text-blue-200/50'}`}
                >
                  สูง (High)
                </button>
                <button 
                   onClick={() => onNotifyLevelChange(RiskLevel.CRITICAL)}
                   className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${notifyLevel === RiskLevel.CRITICAL ? 'bg-[#ff3b30]/20 border-[#ff3b30] text-[#ff3b30]' : 'bg-blue-900/10 border-transparent text-blue-200/50'}`}
                >
                  วิกฤต (Critical)
                </button>
             </div>
          </div>
        </div>

        {/* Section: Radius */}
        <div className="space-y-3">
          <h3 className="text-blue-300 text-xs font-bold uppercase tracking-wider ml-2">พื้นที่ตรวจจับ (Safe Zone)</h3>
          <div className="bg-[#0f2445] rounded-3xl p-5 border border-blue-900/30">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#4cd964]" />
                  <span className="text-white text-sm">รัศมีแจ้งเตือน ATM</span>
                </div>
                <span className="text-[#0057B8] font-bold text-lg bg-[#0057B8]/10 px-3 py-1 rounded-lg">
                  {radius} m
                </span>
             </div>
             <input 
              type="range" 
              min="50" 
              max="2000" 
              step="50"
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-[#0057B8]"
            />
          </div>
        </div>

        <div className="h-10"></div> {/* Spacer */}
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-blue-900/30 bg-[#051024]/95 backdrop-blur">
         <button 
            onClick={onClose}
            className="w-full bg-[#0057B8] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
         >
            บันทึก (Save)
         </button>
      </div>
    </div>
  );
};

export default SettingsPanel;