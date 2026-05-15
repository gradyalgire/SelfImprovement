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

if (error) {
    console.error(error);
    alert(`ERROR: ${error.message}`);
}
else {
    const container = document.getElementById('playlist')

    container.innerHTML = songs.map(s => `
        <div class="song"
            style="background-color: ${sanitize(s.background_color)};"
            data-title="${sanitize(s.title).toLowerCase()}"
            data-artist="${sanitize(s.artist).toLowerCase()}"
            data-order="${sanitize(String(s.sort_order))}"
            data-description="${sanitize(s.description).toLowerCase()}"
            data-category="${sanitize(s.category ?? '').toLowerCase()}"
            data-genre="${sanitize(s.genre ?? '').toLowerCase()}">
            <a href="${safeUrl(s.spotify_link)}" target="_blank">
                <img src="images/songs/song${sanitize(s.sort_order)}.png" alt="${sanitize(s.title)} - ${sanitize(s.artist)}">
            </a>
            <div class="song-content">
                <div class="song-title-artist">
                    <h2 class="song-title">${sanitize(s.sort_order)}. ${sanitize(s.title)}${s.explicit ? ' <span class="explicit-tag">E</span>' : ''}</h2>
                    <h4 class="song-artist">${sanitize(s.artist)}</h4>
                </div>
                <p class="song-description">${sanitize(s.description)}</p>
                ${s.triggers?.length ? `<p class="song-triggers"><strong>Triggers:</strong> ${sanitize(s.triggers.join(', '))}</p>` : `<a href="recommendations.html?type=trigger&title=${encodeURIComponent(s.title)}&artist=${encodeURIComponent(s.artist)}" class="song-triggers-suggest">Suggest Triggers</a>`}
                <a class="song-lyrics" href="${safeUrl(s.genius_link)}" target="_blank">View Lyrics</a>
            </div>
        </div>
    `).join('')

    initSearchAndFilters()
}

function initSearchAndFilters() {
    const searchInput   = document.querySelector('.playlist-search')
    const filterBtns    = document.querySelectorAll('.playlist-filter-btn')
    const clearBtn      = document.querySelector('.playlist-filter-clear')
    const resultsCount  = document.getElementById('playlist-results-count')
    const noResults     = document.getElementById('playlist-no-results')
    const allSongs      = document.querySelectorAll('#playlist .song')
    const totalCount    = allSongs.length

    // track active filters
    const activeFilters = { category: new Set(), genre: new Set() }

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase()
        const hasCategory = activeFilters.category.size > 0
        const hasGenre    = activeFilters.genre.size > 0
        const hasSearch   = query.length > 0
        const anyActive   = hasCategory || hasGenre || hasSearch

        let visibleCount = 0

        allSongs.forEach(song => {
            // search match
            const searchMatch = !hasSearch || (
                song.dataset.title.includes(query) ||
                song.dataset.artist.includes(query) ||
                song.dataset.order.includes(query) ||
                song.dataset.description.includes(query)
            )

            // category/genre stored as comma-separated strings from db
            const songCategories = song.dataset.category
                ? song.dataset.category.split(',').map(c => c.trim())
                : []
            const categoryMatch = !hasCategory ||
                [...activeFilters.category].some(f => songCategories.includes(f.toLowerCase()))

            // genre match
            const songGenres = song.dataset.genre
                ? song.dataset.genre.split(',').map(g => g.trim())
                : []
            const genreMatch = !hasGenre ||
                [...activeFilters.genre].some(f => songGenres.includes(f.toLowerCase()))

            const visible = searchMatch && categoryMatch && genreMatch

            song.style.display = visible ? '' : 'none'
            if (visible) visibleCount++
        })

        // results count
        if (anyActive) {
            resultsCount.textContent = `Showing ${visibleCount} of ${totalCount} songs`
            resultsCount.removeAttribute('hidden')
        } else {
            resultsCount.setAttribute('hidden', '')
        }

        // no results message
        if (visibleCount === 0) {
            noResults.classList.add('visible')
        } else {
            noResults.classList.remove('visible')
        }

        // clear button visibility
        if (hasCategory || hasGenre) {
            clearBtn.removeAttribute('hidden')
        } else {
            clearBtn.setAttribute('hidden', '')
        }
    }

    // search input
    searchInput.addEventListener('input', applyFilters)

    // filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type  = btn.dataset.filterType   // category or genre
            const value = btn.dataset.filterValue

            if (activeFilters[type].has(value)) {
                activeFilters[type].delete(value)
                btn.classList.remove('active')
            } else {
                activeFilters[type].add(value)
                btn.classList.add('active')
            }

            applyFilters()
        })
    })

    // clear all filters
    clearBtn.addEventListener('click', () => {
        activeFilters.category.clear()
        activeFilters.genre.clear()
        filterBtns.forEach(btn => btn.classList.remove('active'))
        applyFilters()
    })
}