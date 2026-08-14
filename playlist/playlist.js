import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// prevents xss by escaping a database value before injecting it into innerHTML
function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

// prevents xss by ensuring a database URL uses http(s) before injecting it into an href — blocks javascript: and other malicious protocols
function safeUrl(url) {
    try {
        const parsed = new URL(url);
        return ['https:', 'http:'].includes(parsed.protocol) ? url : '#';
    } catch {
        return '#';
    }
}

const supabase = createClient(
    'https://mqjeuhvltukwidrwecrt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamV1aHZsdHVrd2lkcndlY3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTg3OTQsImV4cCI6MjA4MzQ5NDc5NH0.CNZpiDxh9HPL0LoDg89ovAa9xHdxp_XbhG7mxafqWn4'
)

const { data: songs, error } = await supabase
    .from('song')
    .select('*')
    .order('sort_order')

const playlistContainer = document.getElementById('playlist');
const noResultsEl = document.getElementById('playlist-no-results');
const resultsCountEl = document.getElementById('playlist-results-count');
const searchInput = document.getElementById('playlist-search-input');
const genresPillsEl = document.getElementById('genres-pills');
const categoriesPillsEl = document.getElementById('categories-pills');
const genresClearBtn = document.getElementById('genres-clear');
const categoriesClearBtn = document.getElementById('categories-clear');

const displayNumberById = new Map();
if (songs) {
    songs.forEach((s, i) => displayNumberById.set(s.id, i + 1));
}

const state = {
    search: '',
    genres: new Set(),
    categories: new Set()
};

function renderSongs(songsToRender) {
    if (!songsToRender.length) {
        playlistContainer.innerHTML = '';
        noResultsEl.hidden = false;
        return;
    }

    noResultsEl.hidden = true;

    playlistContainer.innerHTML = songsToRender.map(s => `
        <div class="song" style="background-color: ${sanitize(s.background_color)};">
            <a href="https://open.spotify.com/track/${sanitize(s.id)}" target="_blank">
                <img src="${safeUrl(s.image_url)}" alt="${sanitize(s.title)} - ${sanitize(s.artist)}">
            </a>
            <div class="song-content">
                <div class="song-title-artist">
                    <h2 class="song-title">${displayNumberById.get(s.id)}. ${sanitize(s.title)}${s.explicit ? ' <span class="explicit-tag">E</span>' : ''}</h2>
                    <h4 class="song-artist">${sanitize(s.artist)}</h4>
                </div>
                <p class="song-description">${sanitize(s.description)}</p>
                ${s.triggers?.length ? `<p class="song-triggers"><strong>Triggers:</strong> ${sanitize(s.triggers.join(', '))}</p>` : `<a href="/recommendations/recommendations?type=trigger&title=${encodeURIComponent(s.title)}&artist=${encodeURIComponent(s.artist)}"class="song-triggers-suggest">Suggest Triggers</a>`}
                <a class="song-lyrics" href="${safeUrl(s.lyrics_url)}" target="_blank">View Lyrics</a>
            </div>
        </div>
    `).join('');
}

function songMatchesSearch(song, query) {
    if (!query) return true;
    const haystack = [
        song.sort_order,
        song.title,
        song.artist,
        song.description
    ].filter(v => v !== null && v !== undefined)
     .join(' ')
     .toLowerCase();
    return haystack.includes(query);
}

function songMatchesGenres(song, selectedGenres) {
    if (selectedGenres.size === 0) return true;
    const songGenres = song.genres || [];
    return songGenres.some(g => selectedGenres.has(g));
}

function songMatchesCategories(song, selectedCategories) {
    if (selectedCategories.size === 0) return true;
    const songCategories = song.categories || [];
    return [...selectedCategories].every(c => songCategories.includes(c));
}

function applyFilters() {
    const query = state.search.trim().toLowerCase();

    const filtered = songs.filter(s =>
        songMatchesSearch(s, query) &&
        songMatchesGenres(s, state.genres) &&
        songMatchesCategories(s, state.categories)
    );

    renderSongs(filtered);

    resultsCountEl.textContent = filtered.length === songs.length
        ? `Showing all ${songs.length} songs`
        : `Showing ${filtered.length} of ${songs.length} songs`;

    genresClearBtn.hidden = state.genres.size === 0;
    categoriesClearBtn.hidden = state.categories.size === 0;
}

function getUniqueValues(items, field) {
    const values = new Set();
    items.forEach(item => {
        (item[field] || []).forEach(v => {
            if (v) values.add(v);
        });
    });
    return [...values].sort((a, b) => a.localeCompare(b));
}

function renderPills(container, values, selectedSet, onToggle) {
    container.innerHTML = values.map(value => `
        <button type="button" class="playlist-pill" data-value="${sanitize(value)}">${sanitize(value)}</button>
    `).join('');

    container.querySelectorAll('.playlist-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const value = pill.dataset.value;
            if (selectedSet.has(value)) {
                selectedSet.delete(value);
                pill.classList.remove('active');
            } else {
                selectedSet.add(value);
                pill.classList.add('active');
            }
            onToggle();
        });
    });
}

function clearPillGroup(container, selectedSet) {
    selectedSet.clear();
    container.querySelectorAll('.playlist-pill.active').forEach(p => p.classList.remove('active'));
    applyFilters();
}

if (error) {
    console.error(error);
    alert(`ERROR: ${error.message}`);
}
else {
    renderSongs(songs);
    resultsCountEl.textContent = `Showing all ${songs.length} songs`;

    const genreValues = getUniqueValues(songs, 'genres');
    const categoryValues = getUniqueValues(songs, 'categories');

    renderPills(genresPillsEl, genreValues, state.genres, applyFilters);
    renderPills(categoriesPillsEl, categoryValues, state.categories, applyFilters);

    let searchDebounce;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            state.search = e.target.value;
            applyFilters();
        }, 150);
    });

    genresClearBtn.addEventListener('click', () => clearPillGroup(genresPillsEl, state.genres));
    categoriesClearBtn.addEventListener('click', () => clearPillGroup(categoriesPillsEl, state.categories));
}