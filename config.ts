/**
 * Application Configuration
 * Centralized configuration for map settings, API timeouts, and app defaults
 */

export const CONFIG = {
    map: {
        defaultCenter: { lat: 13.7563, lng: 100.5018 }, // Bangkok, Thailand
        defaultZoom: 15,
        maxZoom: 18,
        minZoom: 10,
    },
    api: {
        timeout: 20000, // 20 seconds
        retries: 3,
    },
    geolocation: {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000, // 1 minute
    },
    riskDetection: {
        defaultRadius: 200, // meters
        minRadius: 50,
        maxRadius: 500,
    },
    ui: {
        animationDuration: 300, // milliseconds
        toastDuration: 3000,
    },
    storage: {
        keys: {
            detectionRadius: 'ounjai_detection_radius',
            trustedContact: 'ounjai_trusted_contact',
            notifyLevel: 'ounjai_notify_level',
            onboardingCompleted: 'ounjai_onboarding_completed',
        },
    },
} as const;

export default CONFIG;
