// list-models.js - Diagnostic script
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined.");
  process.exit(1);
}

console.log("Fetching accessible models with key prefix:", apiKey.substring(0, 6) + "...");

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error (Status ${res.status}):`, errorText);
      return;
    }
    const data = await res.json();
    console.log("Successfully retrieved models list!");
    if (data.models) {
      console.log("Available models:");
      data.models.forEach(m => console.log(` - ${m.name} (${m.displayName})`));
    } else {
      console.log("No models returned in response:", data);
    }
  } catch (err) {
    console.error("Network or Fetch error:", err);
  }
}

listModels();
