import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
    'https://mqjeuhvltukwidrwecrt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamV1aHZsdHVrd2lkcndlY3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTg3OTQsImV4cCI6MjA4MzQ5NDc5NH0.CNZpiDxh9HPL0LoDg89ovAa9xHdxp_XbhG7mxafqWn4'
)

const { data: songs, error } = await supabase
    .from('song')
    .select('*')
    .order('sort_order')

if (error) {
    console.error(error)
}

const container = document.getElementById('playlist')

container.innerHTML = songs.map(s => `
    <div class="song" style="background-color: ${s.background_color};">
        <a href="${s.spotify_link}" target="_blank">
            <img src="images/songs/song${s.sort_order}.png" alt="${s.title} - ${s.artist}">
        </a>
        <div class="song-content">
            <div class="song-title-artist">
                <h2 class="song-title">${s.sort_order}. ${s.title}${s.explicit ? ' <span class="explicit-tag">E</span>' : ''}</h2>
                <h4 class="song-artist">${s.artist}</h4>
            </div>
            <p class="song-description">${s.description}</p>
            ${s.triggers?.length ? `<p class="song-triggers"><strong>Triggers:</strong> ${s.triggers.join(', ')}</p>` : '<a href="recommendations.html" class="song-triggers-suggest">Suggest Triggers</a>'}
            <a class="song-lyrics" href="${s.genius_link}" target="_blank">View Lyrics</a>
        </div>
    </div>
`).join('')