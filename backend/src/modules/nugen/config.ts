// src/config/nugen.ts
import dotenv from 'dotenv';

dotenv.config();

export const NUGEN_API_KEY = process.env.NUGEN_API_KEY || 'YOUR_NUGEN_API_KEY_HERE';
export const LLM_API_URL = "https://api.nugen.cloud/inference";
export const NUGEN_MODEL_LLM = "nugen-flash-instruct";
export const NUGEN_MODEL_EMBED = "nugen-flash-embed"; // Re-added
