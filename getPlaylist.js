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
        <div class="song" style="background-color: ${sanitize(s.background_color)};">
            <a href="${safeUrl(s.spotify_link)}" target="_blank">
                <img src="images/songs/song${sanitize(s.sort_order)}.png" alt="${sanitize(s.title)} - ${sanitize(s.artist)}">
            </a>
            <div class="song-content">
                <div class="song-title-artist">
                    <h2 class="song-title">${sanitize(s.sort_order)}. ${sanitize(s.title)}${s.explicit ? ' <span class="explicit-tag">E</span>' : ''}</h2>
                    <h4 class="song-artist">${sanitize(s.artist)}</h4>
                </div>
                <p class="song-description">${sanitize(s.description)}</p>
                ${s.triggers?.length ? `<p class="song-triggers"><strong>Triggers:</strong> ${sanitize(s.triggers.join(', '))}</p>` : '<a href="recommendations.html" class="song-triggers-suggest">Suggest Triggers</a>'}
                <a class="song-lyrics" href="${safeUrl(s.genius_link)}" target="_blank">View Lyrics</a>
            </div>
        </div>
    `).join('')
}