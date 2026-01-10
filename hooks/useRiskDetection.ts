import { useState, useEffect } from 'react';
import { RiskZone } from '../types';

/**
 * Haversine formula to calculate distance between two lat/lng points in meters
 */
const getDistanceFromLatLonInM = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Distance in meters
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};

export interface Location {
    lat: number;
    lng: number;
}

/**
 * Custom hook to detect if user is near any risk zones (ATM/Banks)
 * @param userLocation - Current user location
 * @param riskZones - Array of risk zones to check against
 * @param detectionRadius - Detection radius in meters (default 200m)
 * @returns Object with isAtRiskZone boolean and nearest zone distance
 */
export const useRiskDetection = (
    userLocation: Location | null,
    riskZones: RiskZone[],
    detectionRadius: number = 200
) => {
    const [isAtRiskZone, setIsAtRiskZone] = useState(false);
    const [nearestDistance, setNearestDistance] = useState<number | null>(null);

    useEffect(() => {
        if (!userLocation || riskZones.length === 0) {
            setIsAtRiskZone(false);
            setNearestDistance(null);
            return;
        }

        let minDistance = Infinity;
        let isNear = false;

        riskZones.forEach((zone) => {
            const distance = getDistanceFromLatLonInM(
                userLocation.lat,
                userLocation.lng,
                zone.lat,
                zone.lng
            );

            if (distance < minDistance) {
                minDistance = distance;
            }

            if (distance <= detectionRadius) {
                isNear = true;
            }
        });

        setIsAtRiskZone(isNear);
        setNearestDistance(minDistance === Infinity ? null : Math.round(minDistance));
    }, [userLocation, riskZones, detectionRadius]);

    return { isAtRiskZone, nearestDistance };
};
