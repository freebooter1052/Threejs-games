// main.js - AGENT.ARCADE dynamic platform logic

let gamesData = [];
let activeCategory = 'ALL GAMES';
let searchQuery = '';

// Clock UI
function updateClock() {
    const clockEl = document.getElementById('digital-clock');
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
}

// Countdown UI (Counts down to the next hourly drop)
function updateCountdown() {
    const timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
    const diff = nextHour - now;
    const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    timerEl.textContent = `${hrs}:${mins}:${secs} UNTIL DROP`;
}

// Renders the Hero Area using the "NEW DROP" or first available game
function renderHero(games) {
    const container = document.getElementById('hero-container');
    if (!container) return;

    // Try to find a game tagged as "NEW DROP"
    const heroGame = games.find(g => g.tags && g.tags.includes('NEW DROP')) || games[0];
    if (!heroGame) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <section class="relative w-full rounded-xl overflow-hidden group">
            <div class="h-[450px] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('${heroGame.image}')"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-10 w-full md:w-2/3 lg:w-1/2">
                <div class="flex items-center gap-2 mb-4">
                    <span class="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] font-bold tracking-widest rounded-full uppercase">NEW DROP</span>
                    <span class="text-on-surface/60 font-label-mono text-label-mono uppercase tracking-widest">Released Today</span>
                </div>
                <h2 class="font-display-xl text-display-xl text-white mb-4 drop-shadow-lg">${heroGame.title}</h2>
                <p class="text-on-surface-variant text-body-base max-w-lg mb-8 leading-relaxed">${heroGame.description}</p>
                <div class="flex items-center gap-4">
                    <button id="play-hero-btn" class="active-gradient px-8 py-3 rounded-lg font-bold text-white shadow-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group/btn">
                        <span>PLAY NOW</span>
                        <span class="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">rocket_launch</span>
                    </button>
                    <button id="details-hero-btn" class="glass-panel px-6 py-3 rounded-lg font-bold text-white hover:bg-white/10 transition-all">
                        VIEW DETAILS
                    </button>
                </div>
            </div>
        </section>
    `;

    document.getElementById('play-hero-btn')?.addEventListener('click', () => openGameModal(heroGame.id));
    document.getElementById('details-hero-btn')?.addEventListener('click', () => openGameModal(heroGame.id));
}

// Renders category filters dynamically based on games array
function renderFilters(games) {
    const container = document.getElementById('filters-container');
    if (!container) return;

    // Get unique categories and filter out empty values
    const categories = ['ALL GAMES', ...new Set(games.map(g => g.category.toUpperCase()).filter(Boolean))];
    
    container.innerHTML = categories.map(cat => {
        const isActive = activeCategory === cat;
        const btnClass = isActive 
            ? 'active-gradient text-white font-bold' 
            : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-semibold hover:text-on-surface border border-white/5';
        return `
            <button class="px-4 py-1.5 rounded-full text-xs transition-all duration-200 uppercase filter-btn" data-cat="${cat}">
                ${cat}
            </button>
        `;
    }).join('');

    // Apply active classes to buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
        const cat = btn.getAttribute('data-cat');
        if (cat === activeCategory) {
            btn.className = 'active-gradient px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase filter-btn';
        } else {
            btn.className = 'bg-surface-container hover:bg-surface-container-highest px-4 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant transition-colors border border-white/5 uppercase filter-btn';
        }
        btn.addEventListener('click', () => {
            activeCategory = cat;
            renderFilters(games);
            renderGrid(games);
        });
    });
}

// Renders the game cards grid based on filters and search queries
function renderGrid(games) {
    const grid = document.getElementById('games-grid');
    const countEl = document.getElementById('games-count');
    if (!grid) return;

    // Filter games
    const filtered = games.filter(game => {
        const matchesCategory = activeCategory === 'ALL GAMES' || game.category.toUpperCase() === activeCategory;
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              game.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                <span class="material-symbols-outlined text-on-surface-variant text-5xl opacity-40">search_off</span>
                <div>
                    <h3 class="text-lg font-bold text-white">No Modules Found</h3>
                    <p class="text-on-surface-variant text-sm mt-1">Try clearing your filters or adjustment search criteria.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(game => {
        const isTrending = game.tags && game.tags.includes('TRENDING');
        const badgeText = isTrending ? 'TRENDING' : game.status;
        const badgeColor = isTrending 
            ? 'bg-secondary/10 text-secondary border-secondary/20' 
            : 'bg-surface-container/80 text-primary border-primary/20';

        return `
            <div class="group glass-panel rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 neon-glow game-card" data-id="${game.id}">
                <div class="h-48 overflow-hidden relative">
                    <div class="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                    <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style="background-image: url('${game.image}')"></div>
                    ${badgeText ? `
                    <div class="absolute top-4 right-4 z-20">
                        <span class="backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold border ${badgeColor}">${badgeText}</span>
                    </div>` : ''}
                </div>
                <div class="p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-secondary font-label-mono text-[10px] uppercase tracking-widest">${game.category}</span>
                        <span class="text-on-surface-variant/60 text-[10px] uppercase">${game.released}</span>
                    </div>
                    <h3 class="text-xl font-bold group-hover:text-primary transition-colors">${game.title}</h3>
                    <div class="flex items-center gap-2 pt-2 border-t border-white/5">
                        <span class="material-symbols-outlined text-sm text-on-surface-variant">person</span>
                        <span class="text-xs text-on-surface-variant">${game.activePlayers} active</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach click listeners to cards
    grid.querySelectorAll('.game-card').forEach(card => {
        const id = card.getAttribute('data-id');
        card.addEventListener('click', () => openGameModal(id));
    });
}

// Modal Interaction
function openGameModal(id) {
    const game = gamesData.find(g => g.id === id);
    if (!game) return;

    const modal = document.getElementById('game-modal');
    const placeholder = document.getElementById('game-placeholder');
    const iframe = document.getElementById('game-iframe');
    const modalTitle = document.getElementById('modal-game-title');
    const controlsContainer = document.getElementById('modal-controls');
    const mouseControlsEl = document.getElementById('modal-mouse-controls');
    const mouseText = document.getElementById('modal-mouse-text');
    const sessionDataContainer = document.getElementById('modal-session-data');

    if (!modal) return;

    // Reset iframe state & show loading spinner
    placeholder.style.opacity = '1';
    placeholder.style.pointerEvents = 'auto';
    iframe.src = '';
    iframe.classList.remove('opacity-100');
    iframe.classList.add('opacity-0');
    
    modalTitle.textContent = `INITIALIZING: ${game.title}`;

    // Populating controls sidebar
    if (controlsContainer) {
        if (game.controls && game.controls.keys && game.controls.keys.length > 0) {
            controlsContainer.innerHTML = game.controls.keys.map(k => `
                <div class="bg-surface p-3 rounded-lg border border-white/5 flex flex-col items-center gap-2">
                    <span class="bg-surface-container-highest px-3 py-1 rounded font-bold text-sm text-white">${k.key}</span>
                    <span class="text-[10px] text-on-surface-variant uppercase text-center">${k.action}</span>
                </div>
            `).join('');
        } else {
            controlsContainer.innerHTML = `
                <div class="col-span-2 text-center text-xs text-on-surface-variant py-4">
                    Standard System Controls
                </div>
            `;
        }
    }

    if (mouseControlsEl && mouseText) {
        if (game.controls && game.controls.mouse) {
            mouseControlsEl.style.display = 'flex';
            mouseText.textContent = game.controls.mouse;
        } else {
            mouseControlsEl.style.display = 'none';
        }
    }

    // Populating session data
    if (sessionDataContainer && game.sessionData) {
        sessionDataContainer.innerHTML = `
            <div class="flex justify-between text-xs py-2 border-b border-white/5">
                <span class="text-on-surface-variant">LATENCY</span>
                <span class="text-primary font-bold">${game.sessionData.latency}</span>
            </div>
            <div class="flex justify-between text-xs py-2 border-b border-white/5">
                <span class="text-on-surface-variant">RESOLUTION</span>
                <span class="text-white font-bold">${game.sessionData.resolution}</span>
            </div>
            <div class="flex justify-between text-xs py-2 border-b border-white/5">
                <span class="text-on-surface-variant">RANK</span>
                <span class="text-tertiary font-bold">${game.sessionData.rank}</span>
            </div>
        `;
    }

    // Set source to open the specific isolated subdirectory build
    iframe.src = `games/${game.id}/index.html`;

    // Handle iframe load
    iframe.onload = () => {
        modalTitle.textContent = game.title.toUpperCase();
        placeholder.style.opacity = '0';
        placeholder.style.pointerEvents = 'none';
        iframe.classList.remove('opacity-0');
        iframe.classList.add('opacity-100');
    };

    // Show modal and disable body scroll
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('game-modal');
    const iframe = document.getElementById('game-iframe');
    if (!modal) return;

    iframe.src = '';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Initial Setup & Event Listeners
async function init() {
    try {
        const response = await fetch('/games.json');
        if (!response.ok) throw new Error('Failed to load games manifest');
        gamesData = await response.json();
        
        renderHero(gamesData);
        renderFilters(gamesData);
        renderGrid(gamesData);
    } catch (err) {
        console.error('Error loading game portal manifest:', err);
    }

    // Setup clocks
    setInterval(updateClock, 1000);
    updateClock();
    
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Hook up search input
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGrid(gamesData);
    });

    // Close modal triggers
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', closeModal);

    // Sidebar navigation hooks
    document.getElementById('nav-all-games')?.addEventListener('click', (e) => {
        e.preventDefault();
        activeCategory = 'ALL GAMES';
        renderFilters(gamesData);
        renderGrid(gamesData);
    });

    document.getElementById('nav-latest-drop')?.addEventListener('click', (e) => {
        e.preventDefault();
        const heroGame = gamesData.find(g => g.tags && g.tags.includes('NEW DROP')) || gamesData[0];
        if (heroGame) openGameModal(heroGame.id);
    });

    // Fullscreen capability inside the modal
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
        const iframe = document.getElementById('game-iframe');
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) { /* Safari */
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { /* IE11 */
                iframe.msRequestFullscreen();
            }
        }
    });

    // ESC close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

window.addEventListener('DOMContentLoaded', init);
