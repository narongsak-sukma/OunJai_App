import { GoogleGenAI } from "@google/genai";
import { RiskZone } from "../types";

export interface SafetyPlaceResult {
  text: string;
  chunks: any[]; // Grounding chunks containing map URIs
}

export const findNearbySafetyPlaces = async (lat: number, lng: number): Promise<SafetyPlaceResult> => {
  try {
    // API Key must be from process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Find the 3 nearest police stations and 3 nearest bank branches relative to my location. List them clearly with estimated distance.",
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    
    return {
      text: response.text || "ไม่พบข้อมูลในบริเวณนี้ (No data found)",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("AI Safety Scan Error:", error);
    throw error;
  }
};

export const fetchNearbyRiskZones = async (lat: number, lng: number): Promise<{ zones: RiskZone[], chunks: any[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We strictly prompt for JSON array in text because responseSchema is not supported with googleMaps tool.
    const prompt = `
      I am at Latitude: ${lat}, Longitude: ${lng}.
      Find up to 5 nearest ATMs or Bank branches within 500 meters of this location.
      
      For each location found, provide the Name, a short Address, and its estimated Latitude and Longitude.
      
      Return ONLY a raw JSON array string (no markdown, no code blocks) in this exact format:
      [
        {
          "name": "Place Name",
          "address": "Short Address",
          "lat": 13.123,
          "lng": 100.123,
          "type": "ATM" 
        }
      ]
      Use "ATM" for ATMs and "BANK" for Bank branches.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Clean up potential markdown code blocks to parse JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Try to find the array bracket
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
        const jsonString = cleanText.substring(firstBracket, lastBracket + 1);
        try {
            const zones = JSON.parse(jsonString) as any[];
            const parsedZones: RiskZone[] = zones.map((z: any, index: number) => ({
                id: `ai-zone-${index}`,
                name: z.name,
                address: z.address,
                lat: typeof z.lat === 'number' ? z.lat : lat + 0.001, // Fallback if AI hallucinates type
                lng: typeof z.lng === 'number' ? z.lng : lng + 0.001,
                type: ((z.type || 'ATM').toUpperCase() === 'BANK' ? 'BANK' : 'ATM') as 'ATM' | 'BANK'
            }));
            return { zones: parsedZones, chunks };
        } catch (e) {
            console.warn("Failed to parse AI JSON for risk zones:", e);
        }
    }
    
    console.warn("No valid JSON found in AI response for Risk Zones.");
    return { zones: [], chunks: [] };

  } catch (error) {
    console.error("Error fetching risk zones:", error);
    return { zones: [], chunks: [] };
  }
};