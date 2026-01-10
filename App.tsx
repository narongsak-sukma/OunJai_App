import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Home,
  SearchCheck,
  ShieldAlert,
  PhoneCall,
  CreditCard,
  Send,
  ShieldCheck,
  Zap,
  MapPin,
  Bot,
  Map,
  Loader2,
  ExternalLink,
  Settings,
  RefreshCw
} from 'lucide-react';

import { AppState, RiskLevel, RiskZone } from './types';
import { calculateRisk } from './utils/riskEngine';
import RiskGauge from './components/RiskGauge';
import ThreatMap from './components/ThreatMap';
import StatusBanner from './components/StatusBanner';
import SettingsPanel from './components/SettingsPanel';
import RiskOverlay from './components/RiskOverlay';
import { fetchNearbyRiskZones } from './utils/aiService';
import { useGeolocation, useRiskDetection, useAIScan, usePersistedState } from './hooks';
import CONFIG from './config';

// Mock Component for Reporter
const ReportView = () => (
  <div className="p-6 space-y-6 animate-in slide-in-from-right duration-500 pb-24">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-white">แจ้งเบาะแส</h2>
      <p className="text-blue-200/70 text-sm">ช่วยกันดูแลชุมชนของเราให้ปลอดภัย</p>
    </div>

    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <label className="text-blue-200 text-sm">ประเภท (Type)</label>
        <select className="w-full bg-[#0f2445] border border-blue-900/30 text-white p-4 rounded-2xl focus:ring-2 focus:ring-[#0057B8] outline-none transition-all">
          <option>ข้อความน่าสงสัย (Suspicious SMS)</option>
          <option>สายแปลกหน้า (Unknown Call)</option>
          <option>ชวนลงทุน (Investment Scam)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-blue-200 text-sm">รายละเอียด (Details)</label>
        <textarea
          className="w-full bg-[#0f2445] border border-blue-900/30 text-white p-4 rounded-2xl h-32 focus:ring-2 focus:ring-[#0057B8] outline-none transition-all placeholder:text-blue-200/30"
          placeholder="วางข้อความหรือเล่าเหตุการณ์ให้เราฟังหน่อยครับ..."
        ></textarea>
      </div>

      <button className="w-full bg-[#0057B8] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
        <Send className="w-4 h-4" /> ส่งข้อมูลเพื่อดูแลกัน (Submit)
      </button>
    </form>

    <div className="bg-[#0f2445] p-5 rounded-2xl border border-blue-900/30">
      <h4 className="text-[#4cd964] text-sm font-semibold mb-2 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> สถิติชุมชนอุ่นใจ
      </h4>
      <div className="flex justify-between text-xs text-blue-200/60">
        <span>เพื่อนบ้านช่วยแจ้งวันนี้: <span className="text-white font-bold">1,204</span></span>
        <span>ช่วยระงับเหตุแล้ว: <span className="text-white font-bold">892</span></span>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  // Custom Hooks
  const { location: userLocation } = useGeolocation();
  const { scan: aiScan, result: aiResult, isScanning } = useAIScan();

  // Persisted Settings
  const [detectionRadius, setDetectionRadius] = usePersistedState<number>(
    CONFIG.storage.keys.detectionRadius,
    CONFIG.riskDetection.defaultRadius
  );
  const [trustedContact, setTrustedContact] = usePersistedState(
    CONFIG.storage.keys.trustedContact,
    { name: '', phone: '', isEnabled: true }
  );
  const [notifyOnRiskLevel, setNotifyOnRiskLevel] = usePersistedState(
    CONFIG.storage.keys.notifyLevel,
    RiskLevel.CRITICAL
  );

  // Local State
  const [inputText, setInputText] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'analyze' | 'report'>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [dismissedRiskLevel, setDismissedRiskLevel] = useState<RiskLevel | null>(null);

  // Risk Data Loading State
  const [isLoadingRiskData, setIsLoadingRiskData] = useState(false);
  const [mapChunks, setMapChunks] = useState<any[]>([]);
  const hasInitialFetchRef = useRef(false);

  // Risk Detection using custom hook
  const { isAtRiskZone: isAtATM } = useRiskDetection(userLocation, riskZones, detectionRadius);

  // Helper to update risk zones from AI
  const updateRiskZones = useCallback(async (lat: number, lng: number) => {
    setIsLoadingRiskData(true);
    setMapChunks([]);
    try {
      const { zones, chunks } = await fetchNearbyRiskZones(lat, lng);
      if (zones.length > 0) {
        setRiskZones(zones);
        setMapChunks(chunks);
      } else {
        console.log("No risk zones found by AI");
      }
    } catch (e) {
      console.error("Failed to update risk zones", e);
    } finally {
      setIsLoadingRiskData(false);
    }
  }, []);

  // Fetch risk zones when location first becomes available
  useEffect(() => {
    if (userLocation && !hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      updateRiskZones(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, updateRiskZones]);


  const riskAnalysis = useMemo(() => {
    return calculateRisk(inputText, isCallActive, isAtATM);
  }, [inputText, isCallActive, isAtATM]);

  // Reset dismissed state if risk level drops or changes significantly
  useEffect(() => {
    if (riskAnalysis.level === RiskLevel.SAFE || riskAnalysis.level === RiskLevel.MEDIUM) {
      setDismissedRiskLevel(null);
    }
  }, [riskAnalysis.level]);

  const toggleCall = useCallback(() => setIsCallActive(prev => !prev), []);

  const simulateHighRisk = useCallback(() => {
    setInputText('คุณเป็นผู้โชคดีได้รับรางวัลใหญ่ กรุณาโอนเงินเพื่อชำระภาษี ด่วน!');
    setIsCallActive(true);
    setActiveView('analyze');
    setDismissedRiskLevel(null);
  }, []);

  const clearSimulation = useCallback(() => {
    setInputText('');
    setIsCallActive(false);
    setDismissedRiskLevel(null);
  }, []);

  const handleSafetyScan = useCallback(async () => {
    if (!userLocation) return;
    await aiScan(userLocation.lat, userLocation.lng);
  }, [userLocation, aiScan]);

  const handleRefreshMap = useCallback(() => {
    if (userLocation) {
      updateRiskZones(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, updateRiskZones]);

  const getContainerGlow = () => {
    if (riskAnalysis.level === RiskLevel.CRITICAL) return 'shadow-[0_0_50px_rgba(255,59,48,0.2)] border-red-500/30';
    if (riskAnalysis.level === RiskLevel.HIGH) return 'shadow-[0_0_30px_rgba(255,149,0,0.2)] border-orange-500/30';
    return 'border-blue-900/20';
  }

  // Determine if overlay should show
  const showOverlay = (riskAnalysis.level === RiskLevel.HIGH || riskAnalysis.level === RiskLevel.CRITICAL)
    && dismissedRiskLevel !== riskAnalysis.level;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center overflow-hidden font-sarabun">
      <div className={`w-full max-w-md bg-[#051024] relative flex flex-col min-h-screen shadow-2xl transition-all duration-500 border-x ${getContainerGlow()}`}>

        {/* Full Screen Risk Warning Overlay */}
        {showOverlay && (
          <RiskOverlay
            level={riskAnalysis.level}
            contact={trustedContact}
            onDismiss={() => setDismissedRiskLevel(riskAnalysis.level)}
          />
        )}

        {/* Settings Panel Overlay */}
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          radius={detectionRadius}
          onRadiusChange={setDetectionRadius}
          contact={trustedContact}
          onContactChange={setTrustedContact}
          notifyLevel={notifyOnRiskLevel}
          onNotifyLevelChange={setNotifyOnRiskLevel}
        />

        {/* Persistent Status Banner (Visible if overlay dismissed or safe/medium) */}
        <StatusBanner
          level={riskAnalysis.level}
          score={riskAnalysis.score}
          contact={trustedContact}
          notifyLevel={notifyOnRiskLevel}
        />

        <div className="flex-1 overflow-y-auto pb-24">

          {activeView === 'dashboard' && (
            <div className="p-6 space-y-6 animate-in fade-in zoom-in duration-300">

              {/* Main Header with Settings Button */}
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-white font-prompt">อุ่นใจ</h1>
                  <p className="text-blue-200/60 text-xs">ระบบความปลอดภัยส่วนตัว</p>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-3 bg-[#0f2445] border border-blue-900/30 rounded-full text-blue-200 hover:text-white hover:bg-[#1e3a8a] transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-[#0f2445]/80 rounded-[2rem] p-2 border border-blue-900/30 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
                <RiskGauge score={riskAnalysis.score} level={riskAnalysis.level} />
                <div className="px-4 pb-4">
                  <button
                    onClick={simulateHighRisk}
                    className="w-full bg-[#1428A0]/20 hover:bg-[#1428A0]/30 active:bg-[#1428A0]/40 text-blue-100 py-3.5 px-4 rounded-xl text-sm font-semibold border border-[#1428A0]/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] hover:shadow-lg hover:shadow-[#1428A0]/30"
                  >
                    <Zap className="w-4 h-4 text-[#ffcc00]" />
                    ทดสอบระบบ (Test Safety System)
                  </button>
                </div>
              </div>

              {/* Real Interactive Map Section */}
              <div className="relative space-y-2">
                {/* Map Loading Overlay */}
                {isLoadingRiskData && (
                  <div className="absolute inset-0 z-30 bg-[#051024]/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center text-blue-200">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0057B8]" />
                    <span className="text-xs font-medium">กำลังดึงข้อมูล ATM/ธนาคาร...</span>
                  </div>
                )}

                {/* Refresh Button for Map Data */}
                <button
                  onClick={handleRefreshMap}
                  disabled={isLoadingRiskData || !userLocation}
                  className="absolute bottom-16 right-4 z-40 p-2 bg-[#0057B8] text-white rounded-full shadow-lg hover:bg-blue-600 disabled:opacity-50 active:scale-95"
                  title="Refresh Map Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingRiskData ? 'animate-spin' : ''}`} />
                </button>

                <ThreatMap
                  userLocation={userLocation}
                  riskZones={riskZones}
                  radius={detectionRadius}
                  onOpenSettings={() => setShowSettings(true)}
                />

                {/* Map Data Sources (Grounding) */}
                {mapChunks.length > 0 && (
                  <div className="px-2">
                    <p className="text-[10px] text-blue-200/40 uppercase font-bold mb-1">ข้อมูลแผนที่จาก Google Maps:</p>
                    <div className="flex flex-wrap gap-2">
                      {mapChunks.slice(0, 3).map((chunk, idx) => {
                        const uri = chunk.web?.uri || chunk.maps?.uri;
                        const title = chunk.web?.title || chunk.maps?.title || "Google Maps";
                        if (!uri) return null;
                        return (
                          <a
                            key={idx}
                            href={uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#0057B8] hover:text-white underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> {title}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Safety Scanner Section */}
              <div className="bg-[#0f2445] rounded-2xl border border-blue-900/30 overflow-hidden">
                <div className="p-4 bg-blue-900/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#4cd964]" />
                    <h3 className="text-white font-semibold text-sm">ค้นหาจุดปลอดภัย (AI Scan)</h3>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {!aiResult && !isScanning && (
                    <button
                      onClick={handleSafetyScan}
                      disabled={!userLocation}
                      className="w-full bg-[#0057B8] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95"
                    >
                      <Map className="w-4 h-4" />
                      {userLocation ? 'ค้นหาสถานีตำรวจ/ธนาคาร ใกล้ฉัน' : 'กำลังระบุตำแหน่ง...'}
                    </button>
                  )}

                  {isScanning && (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 text-blue-200">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0057B8]" />
                      <span className="text-xs">AI กำลังตรวจสอบพื้นที่...</span>
                    </div>
                  )}

                  {aiResult && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-sm text-blue-100 whitespace-pre-wrap leading-relaxed">
                        {aiResult.text}
                      </p>

                      {aiResult.chunks && aiResult.chunks.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">ตำแหน่งที่พบ (Map Links)</p>
                          <div className="grid gap-2">
                            {aiResult.chunks.map((chunk, idx) => {
                              // Extract URI safely
                              const uri = chunk.web?.uri || chunk.maps?.uri;
                              const title = chunk.web?.title || chunk.maps?.title || `Location ${idx + 1}`;
                              if (!uri) return null;
                              return (
                                <a
                                  key={idx}
                                  href={uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-blue-900/20 rounded-lg border border-blue-900/30 hover:bg-blue-900/40 transition-colors text-xs text-blue-100"
                                >
                                  <ExternalLink className="w-3 h-3 text-[#4cd964]" />
                                  {title}
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSafetyScan}
                        className="mt-4 text-xs text-[#0057B8] hover:text-white underline w-full text-center"
                      >
                        สแกนใหม่อีกครั้ง
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${isCallActive ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#0f2445] border-blue-900/30'} transition-all`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneCall className={`w-5 h-5 ${isCallActive ? 'text-orange-400' : 'text-blue-400'}`} />
                    <span className="text-xs text-blue-300/80">การสนทน า</span>
                  </div>
                  <p className={`font-semibold text-sm ${isCallActive ? 'text-orange-400' : 'text-slate-200'}`}>
                    {isCallActive ? 'กำลังคุยสาย' : 'ปกติ'}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl border ${isAtATM ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#0f2445] border-blue-900/30'} transition-all`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className={`w-5 h-5 ${isAtATM ? 'text-orange-400' : 'text-blue-400'}`} />
                    <span className="text-xs text-blue-300/80">
                      {userLocation ? 'GPS: Active' : 'GPS: Waiting'}
                    </span>
                  </div>
                  <p className={`font-semibold text-sm ${isAtATM ? 'text-orange-400' : 'text-slate-200'}`}>
                    {isAtATM ? 'ใกล้ตู้ ATM' : 'โซนปลอดภัย'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeView === 'analyze' && (
            <div className="p-6 space-y-6 animate-in slide-in-from-right duration-500 pb-24">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">ตรวจสอบความปลอดภัย</h2>
                  <p className="text-blue-200/70 text-sm">Safety Check Engine</p>
                </div>
                <button
                  onClick={clearSimulation}
                  className="text-xs text-blue-400 hover:text-white underline"
                >
                  ล้างค่า (Reset)
                </button>
              </div>

              <div className="bg-[#0f2445] p-1 rounded-2xl border border-blue-900/30 focus-within:ring-2 focus-within:ring-[#0057B8] transition-all">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-transparent text-white p-4 h-40 outline-none resize-none font-sarabun text-lg placeholder:text-blue-200/30"
                  placeholder="วางข้อความที่สงสัยที่นี่ เพื่อให้เราช่วยตรวจสอบครับ..."
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-blue-300/60 text-xs font-bold uppercase tracking-wider">ปัจจัยแวดล้อม (Context)</h3>

                <button
                  onClick={toggleCall}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isCallActive ? 'bg-[#0057B8]/20 border-[#0057B8] shadow-lg shadow-blue-900/20' : 'bg-[#0f2445] border-blue-900/30 hover:border-blue-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isCallActive ? 'bg-[#0057B8] text-white' : 'bg-blue-900/30 text-blue-400'}`}>
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${isCallActive ? 'text-white' : 'text-blue-200'}`}>
                        สายสนทนาไม่คุ้นเคย
                      </div>
                      <div className="text-xs text-blue-200/60">Unknown call detected</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={toggleCall}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isAtATM ? 'bg-[#0057B8]/20 border-[#0057B8] shadow-lg shadow-blue-900/20' : 'bg-[#0f2445] border-blue-900/30 hover:border-blue-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isAtATM ? 'bg-[#0057B8] text-white' : 'bg-blue-900/30 text-blue-400'}`}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${isAtATM ? 'text-white' : 'text-blue-200'}`}>
                        อยู่ใกล้ตู้ ATM
                      </div>
                      <div className="text-xs text-blue-200/60">
                        {userLocation ? 'GPS Tracking Active' : 'Manual Override'}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-[#0f2445] rounded-xl p-5 border border-blue-900/30">
                <h3 className="text-white text-sm font-semibold mb-3">ผลการวิเคราะห์ (Breakdown)</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200/70">คำสำคัญ (Keywords)</span>
                    <span className={`${riskAnalysis.details.textScore > 0 ? 'text-[#ff9500]' : 'text-blue-200/50'}`}>{riskAnalysis.details.textScore > 0 ? 'พบคำต้องสงสัย' : 'ปกติ'}</span>
                  </div>
                  <div className="w-full bg-blue-900/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0057B8] h-full transition-all duration-500" style={{ width: `${riskAnalysis.details.textScore}%` }}></div>
                  </div>

                  {riskAnalysis.details.matchedKeywords.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {riskAnalysis.details.matchedKeywords.map(k => (
                        <span key={k} className="px-3 py-1 bg-[#ff9500]/10 text-[#ff9500] rounded-lg border border-[#ff9500]/20">{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeView === 'report' && <ReportView />}

        </div>

        <div className="absolute bottom-0 w-full bg-[#051024]/95 backdrop-blur-2xl border-t border-blue-900/30 flex justify-around items-center p-4 pb-safe z-40 shadow-2xl shadow-black/50">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 p-2 rounded-xl ${activeView === 'dashboard' ? 'text-[#1428A0]' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">หน้าหลัก</span>
          </button>

          <button
            onClick={() => setActiveView('analyze')}
            className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 p-2 rounded-xl ${activeView === 'analyze' ? 'text-[#1428A0]' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <div className={`p-3.5 -mt-8 rounded-full border-4 border-[#051024] transition-all duration-300 ${activeView === 'analyze' ? 'bg-[#1428A0] text-white shadow-2xl shadow-[#1428A0]/50 scale-110' : 'bg-[#0f2445] text-slate-400 hover:bg-[#1e3a8a]/30'}`}>
              <SearchCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium mt-1">ตรวจสอบ</span>
          </button>

          <button
            onClick={() => setActiveView('report')}
            className={`flex flex-col items-center gap-1 transition-all duration-200 active:scale-95 p-2 rounded-xl ${activeView === 'report' ? 'text-[#1428A0]' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <ShieldAlert className="w-6 h-6" />
            <span className="text-[10px] font-medium">แจ้งเบาะแส</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;