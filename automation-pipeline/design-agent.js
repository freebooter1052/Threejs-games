import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';
import z from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateGameIdea() {
  // Map GEMINI_API_KEY to GOOGLE_GENERATIVE_AI_API_KEY for Vercel AI SDK
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }

  // Read existing games to avoid repetition
  const manifestPath = path.resolve(__dirname, '../platform-portal/public/games.json');
  const existingGames = fs.existsSync(manifestPath) 
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : [];
  
  const pastTitles = existingGames.map(g => g.title).join(', ');

  console.log("Existing games detected:", pastTitles || "None");
  console.log("Calling Gemini API to brainstorm a new game idea...");

  try {
    const response = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        title: z.string().describe("Catchy arcade game title (e.g., Star Chaser, Grid Runner)"),
        description: z.string().describe("1-2 sentence elevator pitch of the gameplay"),
        genre: z.string().describe("The primary genre tag, in upper case (e.g., TOWER DEFENSE, RACING, SPACE STRATEGY)"),
        agentPrompt: z.string().describe("The explicit master prompt detailing mechanics, lighting, controls, and assets for the coding agent"),
        controls: z.object({
          keys: z.array(z.object({
            key: z.string().describe("Keyboard key, e.g. W, A / D, SPACE, SHIFT"),
            action: z.string().describe("Action performed, e.g. Accelerate, Steer, Jump, Dash")
          })).describe("The keyboard key mappings"),
          mouse: z.string().describe("Description of mouse interaction, e.g. Mouse to aim / click to shoot")
        }).describe("Control scheme mapping for the sidebar"),
        sessionData: z.object({
          latency: z.string().describe("Mock latency, e.g., 10ms, 15ms"),
          resolution: z.string().describe("Mock resolution, e.g., 4K ADAPTIVE, 1080p NATIVE"),
          rank: z.string().describe("Mock ranking, e.g., #10 GLOBAL, #42 LOCAL")
        }).describe("Mock session statistics for the dashboard sidebar")
      }),
      prompt: `You are an elite, avant-garde game designer. Brainstorm a unique, hyper-addictive browser-based 3D game concept using Three.js.
      
      CRITICAL: Do not repeat or copy these previous game ideas: [${pastTitles}].
      
      Craft a deep, highly descriptive instruction for the coding agent. The instruction MUST use 'threejs-game-director' and detail out the game loop, desktop/mobile controls, lighting style, and asset requirements.
      
      IMPORTANT: The coding agent should NOT generate custom 3D models or speech audio via Tripo or ElevenLabs APIs. Instead, explicitly instruct the coder to use standard procedural 3D shapes (Three.js primitives like Sphere, Box, Torus, Cylinder, etc.) or load free public assets, textures, and sounds directly from open internet CDNs (e.g., standard audio repositories, free sound effects directories, or public texture links). Make it sound incredibly engaging and technically precise.`,
    });

    // Save the generated idea metadata temporarily for the pipeline to consume
    const outputPath = path.resolve(__dirname, './current-idea.json');
    fs.writeFileSync(outputPath, JSON.stringify(response.object, null, 2));
    console.log(`💡 Brainstormed New Game: ${response.object.title}`);
  } catch (err) {
    console.error("Error generating game idea:", err);
    process.exit(1);
  }
}

generateGameIdea();
