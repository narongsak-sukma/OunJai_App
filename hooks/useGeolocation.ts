import { useState, useEffect, useRef } from 'react';

export interface Location {
    lat: number;
    lng: number;
}

export interface UseGeolocationResult {
    location: Location | null;
    error: string | null;
    isLoading: boolean;
}

/**
 * Custom hook for managing user geolocation with real-time tracking
 * Falls back to Bangkok coordinates if geolocation is unavailable
 */
export const useGeolocation = (): UseGeolocationResult => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            // Fallback to Bangkok
            setLocation({ lat: 13.7563, lng: 100.5018 });
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setError(null);
                setIsLoading(false);
            },
            (err) => {
                console.warn('Geolocation error:', err.message);
                setError(err.message);
                setIsLoading(false);
                // Fallback to Bangkok if location fails
                setLocation({ lat: 13.7563, lng: 100.5018 });
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 60000,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return { location, error, isLoading };
};
