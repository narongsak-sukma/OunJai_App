import React from 'react';
import { RiskLevel, TrustedContact } from '../types';
import { ShieldCheck, Info, AlertCircle, BellRing } from 'lucide-react';

interface StatusBannerProps {
  level: RiskLevel;
  score: number;
  contact: TrustedContact;
  notifyLevel: RiskLevel;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ level }) => {
  // If High or Critical, the RiskOverlay will take over the main attention.
  // This banner serves as a persistent reminder underneath or when dismissed.

  if (level === RiskLevel.SAFE) {
    return (
      <div className="bg-[#0057B8]/20 border-b border-[#0057B8]/30 p-4 flex items-center gap-3 animate-in fade-in">
        <div className="p-2 bg-[#0057B8]/20 rounded-full">
            <ShieldCheck className="text-[#4cd964] w-6 h-6" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">สถานะปกติ (All Good)</h4>
          <p className="text-blue-200/80 text-xs">ระบบกำลังดูแลคุณ • System Active</p>
        </div>
      </div>
    );
  }

  if (level === RiskLevel.MEDIUM) {
    return (
      <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-4 flex items-center gap-3 animate-in fade-in">
        <div className="p-2 bg-yellow-500/10 rounded-full animate-pulse">
            <Info className="text-[#ffcc00] w-6 h-6" />
        </div>
        <div>
          <h4 className="text-[#ffcc00] font-bold text-sm">มีข้อสังเกต (Caution)</h4>
          <p className="text-yellow-100/80 text-xs">เพิ่มระดับการเฝ้าระวัง • Monitoring Increased</p>
        </div>
      </div>
    );
  }

  if (level === RiskLevel.HIGH) {
    return (
      <div className="bg-orange-500/10 border-b border-orange-500/30 p-4 flex items-center gap-3 animate-in fade-in">
        <div className="p-2 bg-orange-500/10 rounded-full">
            <AlertCircle className="text-[#ff9500] w-6 h-6" />
        </div>
        <div>
          <h4 className="text-[#ff9500] font-bold text-sm">ระวังความเสี่ยงสูง (High Risk)</h4>
          <p className="text-orange-100/80 text-xs">อย่าโอนเงินเด็ดขาด จนกว่าจะตรวจสอบ</p>
        </div>
      </div>
    );
  }

  // Critical
  return (
    <div className="bg-red-500/10 border-b border-[#ff3b30]/50 p-4 flex items-center gap-3 animate-pulse">
      <div className="p-2 bg-red-500/20 rounded-full">
         <BellRing className="text-[#ff3b30] w-6 h-6" />
      </div>
      <div>
        <h4 className="text-[#ff3b30] font-bold text-sm">อันตรายสูงสุด (Critical)</h4>
        <p className="text-red-100/80 text-xs">ตรวจพบมิจฉาชีพ กรุณาวางสายทันที</p>
      </div>
    </div>
  );
};

export default StatusBanner;