import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    <div class="track">
        <a href="${s.spotify_link}" target="_blank">
            <img src="${s.image_path}" alt="${s.title} - ${s.artist}">
        </a>
        <div class="track-content">
            <h2>${s.title} - ${s.artist}</h2><br>
            <p>${s.description}</p>
            ${s.triggers?.length ? `<p><strong>Triggers:</strong> ${s.triggers.join(', ')}</p>` : ''}
        </div>
    </div>
`).join('')