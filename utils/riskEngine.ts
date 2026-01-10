import { RiskAnalysis, RiskLevel } from '../types';
import { SCAM_KEYWORDS, WEIGHTS } from '../constants';

export const calculateRisk = (
  text: string,
  isCallActive: boolean,
  isAtATM: boolean
): RiskAnalysis => {
  
  // 1. Text Analysis (40%)
  let matchedKeywords: string[] = [];
  let textRawScore = 0;
  
  if (text) {
    SCAM_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    });
    
    // Heuristic: More matches = higher confidence
    if (matchedKeywords.length >= 3) textRawScore = 100;
    else if (matchedKeywords.length === 2) textRawScore = 65;
    else if (matchedKeywords.length === 1) textRawScore = 35;
  }

  // 2. Behavior Analysis (35%)
  // "User is on a long call with a stranger"
  const behaviorRawScore = isCallActive ? 100 : 0;

  // 3. Context Analysis (25%)
  // "User is currently at an ATM location"
  const contextRawScore = isAtATM ? 100 : 0;

  // Calculate Weighted Average
  const totalScore = Math.round(
    (textRawScore * WEIGHTS.TEXT) +
    (behaviorRawScore * WEIGHTS.BEHAVIOR) +
    (contextRawScore * WEIGHTS.CONTEXT)
  );

  // Determine Level based on strict table
  // Safe: 0-49%
  // Medium: 50-69%
  // High: 70-84%
  // Critical: 85-100%
  let level = RiskLevel.SAFE;
  if (totalScore >= 85) level = RiskLevel.CRITICAL;
  else if (totalScore >= 70) level = RiskLevel.HIGH;
  else if (totalScore >= 50) level = RiskLevel.MEDIUM;

  return {
    score: totalScore,
    level,
    details: {
      textScore: Math.round(textRawScore * WEIGHTS.TEXT),
      behaviorScore: Math.round(behaviorRawScore * WEIGHTS.BEHAVIOR),
      contextScore: Math.round(contextRawScore * WEIGHTS.CONTEXT),
      matchedKeywords
    }
  };
};