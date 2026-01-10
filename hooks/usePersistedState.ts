import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Custom hook for persisting state to localStorage
 * Automatically syncs state changes with localStorage
 * 
 * @param key - localStorage key
 * @param defaultValue - Default value if no stored value exists
 * @returns [state, setState] tuple similar to useState
 */
export const usePersistedState = <T>(
    key: string,
    defaultValue: T
): [T, Dispatch<SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.warn(`Error saving to localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};
