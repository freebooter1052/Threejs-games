import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runCodingAgent() {
  // Map GEMINI_API_KEY to GOOGLE_GENERATIVE_AI_API_KEY for compatibility with Google SDKs in child processes
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }

  const ideaPath = path.resolve(__dirname, './current-idea.json');
  const workspacePath = path.resolve(__dirname, './workspace');

  if (!fs.existsSync(ideaPath)) {
    console.error(`Error: Cannot find generated idea file at ${ideaPath}`);
    process.exit(1);
  }

  const idea = JSON.parse(fs.readFileSync(ideaPath, 'utf8'));
  
  if (!fs.existsSync(workspacePath)) {
    fs.mkdirSync(workspacePath, { recursive: true });
  }

  console.log(`🤖 Coding Agent initializing to build: ${idea.title}...`);
  
  // Construct the command instructing your execution framework/CLI
  // Escape quotes in the prompt to avoid shell parsing errors
  const escapedPrompt = idea.agentPrompt.replace(/"/g, '\\"');
  const command = `npx skills run threejs-game-director --prompt "${escapedPrompt}" --cwd "${workspacePath}"`;
  
  console.log(`Running execution command: ${command}`);
  
  // Execute the agent execution block
  execSync(command, { stdio: 'inherit' });
}

runCodingAgent();
