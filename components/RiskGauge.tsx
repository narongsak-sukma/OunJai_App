import React from 'react';
import { RiskLevel } from '../types';
import { RISK_COLORS, RISK_LABELS_TH, RISK_LABELS_EN } from '../constants';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level }) => {
  // SVG Config
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Gradient definitions based on level
  let gradientId = 'gradientSafe';
  if (level === RiskLevel.MEDIUM) gradientId = 'gradientMedium';
  if (level === RiskLevel.HIGH) gradientId = 'gradientHigh';
  if (level === RiskLevel.CRITICAL) gradientId = 'gradientCritical';

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="gradientSafe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradientMedium" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="gradientHigh" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="gradientCritical" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            stroke="#1e3a8a" /* Dark Blue Track */
            strokeOpacity="0.3"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle with Gradient */}
          <circle
            stroke={`url(#${gradientId})`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute flex flex-col items-center">
            <span className={`text-4xl font-bold ${RISK_COLORS[level]}`}>
                {score}%
            </span>
            <span className="text-blue-200/50 text-xs font-light tracking-widest uppercase">
                ระดับความเสี่ยง
            </span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <h2 className={`text-2xl font-bold ${RISK_COLORS[level]}`}>
            {RISK_LABELS_TH[level]}
        </h2>
        <p className="text-blue-200/60 text-sm">
            {RISK_LABELS_EN[level]}
        </p>
      </div>
    </div>
  );
};

export default RiskGauge;