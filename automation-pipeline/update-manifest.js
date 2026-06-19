// update-manifest.js
// Writes the new game details to platform-portal/public/games.json.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse CLI arguments
function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index !== -1 && index + 1 < process.argv.length) {
    return process.argv[index + 1];
  }
  return null;
}

async function main() {
  console.log("Starting Update Manifest...");

  // Get date from --date argument
  let gameDate = getArg('--date');
  if (!gameDate) {
    const today = new Date();
    gameDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  const ideaPath = path.resolve(__dirname, './current-idea.json');
  const manifestPath = path.resolve(__dirname, '../platform-portal/public/games.json');

  if (!fs.existsSync(ideaPath)) {
    console.error(`Error: Cannot find generated idea file at ${ideaPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(manifestPath)) {
    console.error(`Error: Cannot find games manifest file at ${manifestPath}`);
    process.exit(1);
  }

  // Load the newly brainstormed game idea
  const idea = JSON.parse(fs.readFileSync(ideaPath, 'utf8'));

  // Load existing manifest
  const existingGames = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Select context-aware high quality image based on category
  const category = (idea.genre || '').toUpperCase();
  let imageUrl = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800'; // fallback neon game setup

  if (category.includes('RACING')) {
    imageUrl = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800';
  } else if (category.includes('SPACE') || category.includes('STAR')) {
    imageUrl = 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800';
  } else if (category.includes('ACTION') || category.includes('PLATFORMER') || category.includes('RUNNER')) {
    imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800';
  } else if (category.includes('DEFENSE') || category.includes('TOWER') || category.includes('CIRCUIT')) {
    imageUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';
  } else if (category.includes('STRATEGY') || category.includes('TACTICAL') || category.includes('RPG')) {
    imageUrl = 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=800';
  } else if (category.includes('PHYSICS') || category.includes('PUZZLER')) {
    imageUrl = 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800';
  }

  // Generate release date label e.g., "Jun 19, 2026"
  const dateObj = new Date(gameDate);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const releasedLabel = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;

  // Construct new game entry
  const newGame = {
    id: `game-${gameDate}`,
    title: idea.title,
    category: category,
    description: idea.description,
    released: releasedLabel,
    date: gameDate,
    status: 'OPERATIONAL',
    tags: ['NEW DROP', 'TRENDING'],
    activePlayers: `${(Math.random() * 4.5 + 0.5).toFixed(1)}k`,
    image: imageUrl,
    controls: idea.controls || {
      keys: [
        { key: "W / S", action: "Move Forward / Backward" },
        { key: "A / D", action: "Steer Left / Right" }
      ],
      mouse: "Mouse cursor aiming"
    },
    sessionData: idea.sessionData || {
      latency: "15ms",
      resolution: "1080p NATIVE",
      rank: "#50 LOCAL"
    }
  };

  // Clean up existing games: remove 'NEW DROP' tag from older drops
  const updatedGames = existingGames.map(game => {
    if (game.tags && game.tags.includes('NEW DROP')) {
      return {
        ...game,
        tags: game.tags.filter(t => t !== 'NEW DROP')
      };
    }
    return game;
  });

  // Prepend the new game to the manifest so it stands at the front of the list
  updatedGames.unshift(newGame);

  // Write updated manifest back to file
  fs.writeFileSync(manifestPath, JSON.stringify(updatedGames, null, 2));

  console.log(`✔️ Manifest updated. Successfully registered game: "${idea.title}" (id: game-${gameDate})`);
}

main().catch(err => {
  console.error("Error in Update Manifest:", err);
  process.exit(1);
});
