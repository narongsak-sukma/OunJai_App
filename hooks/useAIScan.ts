import { useState, useCallback } from 'react';
import { findNearbySafetyPlaces, SafetyPlaceResult } from '../utils/aiService';

export interface UseAIScanResult {
    result: SafetyPlaceResult | null;
    isScanning: boolean;
    error: string | null;
    scan: (lat: number, lng: number) => Promise<void>;
    reset: () => void;
}

/**
 * Custom hook for AI-powered safety place scanning
 * Finds nearby police stations, banks, and safe locations using Google Gemini AI
 */
export const useAIScan = (): UseAIScanResult => {
    const [result, setResult] = useState<SafetyPlaceResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scan = useCallback(async (lat: number, lng: number) => {
        setIsScanning(true);
        setError(null);
        setResult(null);

        try {
            const scanResult = await findNearbySafetyPlaces(lat, lng);
            setResult(scanResult);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setResult({
                text: 'ไม่สามารถเชื่อมต่อ AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
                chunks: [],
            });
        } finally {
            setIsScanning(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResult(null);
        setError(null);
        setIsScanning(false);
    }, []);

    return { result, isScanning, error, scan, reset };
};
