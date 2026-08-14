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

export function initSwipers() {
    // Podcasts — up to 2 slides per view
    new Swiper('.podcasts .media-wrapper', {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 2,
        pagination: {
            el: '.podcasts .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.podcasts .swiper-button-next',
            prevEl: '.podcasts .swiper-button-prev',
        },
        breakpoints: {
            0:  { slidesPerView: 1 },
            1020:  { slidesPerView: 2 }
        }
    });

    // Books — up to 3 slides per view
    new Swiper('.books .media-wrapper', {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 2,
        pagination: {
            el: '.books .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.books .swiper-button-next',
            prevEl: '.books .swiper-button-prev',
        },
        breakpoints: {
            0:  { slidesPerView: 1 },
            1020:  { slidesPerView: 2 },
            1420:  { slidesPerView: 3 }
        }
    });

    // Videos — up to 2 slides per view
    new Swiper('.videos .media-wrapper', {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 2,
        pagination: {
            el: '.videos .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.videos .swiper-button-next',
            prevEl: '.videos .swiper-button-prev',
        },
        breakpoints: {
            0:  { slidesPerView: 1 },
            1420:  { slidesPerView: 2 }
        }
    });

    // Movies — up to 2 slides per view
    new Swiper('.movies .media-wrapper', {
        loop: true,
        spaceBetween: 30,
        slidesPerView: 1,
        pagination: {
            el: '.movies .swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.movies .swiper-button-next',
            prevEl: '.movies .swiper-button-prev',
        },
        breakpoints: {
            0:  { slidesPerView: 1 },
            1020:  { slidesPerView: 2 },
            1420:  { slidesPerView: 3 }
        }
    });
}

function generateMediaSliderCard(mediatype, media) {
    const container = document.getElementById(`${mediatype}`);

    container.innerHTML = media.map(m => `
        <li class="media-item swiper-slide">
            <div class="media-content">
                <a href="${safeUrl(m.media_url)}" target="_blank"><img src="${safeUrl(m.image_url)}" alt="${sanitize(m.title)} ${sanitize(m.type)}" class="media-image"></a>
                <div class="media-item-content">
                    <div class="media-title-host">
                        <h2 class="media-title">${sanitize(m.title)}</h2>
                        <h4 class="media-host">${sanitize(m.creator)}</h4>
                    </div>
                    <p class="media-description">${sanitize(m.description)}</p>
                    ${m.triggers?.length ? `<p class="media-triggers"><strong>Triggers:</strong> ${sanitize(m.triggers.join(', '))}</p>` : `<a href="/recommendations/recommendations?type=trigger&title=${encodeURIComponent(m.title)}&artist=${encodeURIComponent(m.creator)}" class="media-triggers-suggest">Suggest Triggers</a>`}
                </div>
            </div>
        </li>
    `).join('')
}

function generateMediaSliderVideo(mediatype, media) {
    const container = document.getElementById(`${mediatype}`);

    container.innerHTML = media.map(m => `
        <li class="media-item swiper-slide">
            <div class="media-content">
                <iframe width="359" height="197" src="${safeUrl(m.media_link)}" title="${sanitize(m.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <div class="media-item-content">
                    <div class="media-title-creator">
                        <h2 class="media-title">${sanitize(m.title)}</h2>
                        <h4 class="media-creator">${sanitize(m.creator)}</h4>
                    </div>
                    <p class="media-description">${sanitize(m.description)}</p>
                    ${m.triggers?.length ? `<p class="media-triggers"><strong>Triggers:</strong> ${sanitize(m.triggers.join(', '))}</p>` : `<a href="recommendations.html?type=trigger&title=${encodeURIComponent(m.title)}&artist=${encodeURIComponent(m.creator)}" class="media-triggers-suggest">Suggest Triggers</a>`}
                </div>
            </div>
        </li>
    `).join('')
}

const supabase = createClient(
    'https://mqjeuhvltukwidrwecrt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xamV1aHZsdHVrd2lkcndlY3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTg3OTQsImV4cCI6MjA4MzQ5NDc5NH0.CNZpiDxh9HPL0LoDg89ovAa9xHdxp_XbhG7mxafqWn4'
)

const { data: podcasts, podcastError } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'Podcast')
        .order('sort_order')   

const { data: books, bookError } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'Book')
        .order('sort_order')  

const { data: videos, videoError } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'Video')
        .order('sort_order')  

const { data: movies, movieError } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'Movie')
        .order('sort_order')  

if (podcastError || bookError || videoError || movieError) {
    if (podcastError) {
        console.error(podcastError);
        alert(`ERROR: ${podcastError.message}`);
    }
    if (bookError) {
        console.error(bookError);
        alert(`ERROR: ${bookError.message}`);
    }
    if (videoError) {
        console.error(videoError);
        alert(`ERROR: ${videoError.message}`);
    }
    if (movieError) {
        console.error(movieError);
        alert(`ERROR: ${movieError.message}`);
    }
}
else {
    generateMediaSliderCard('podcasts', podcasts);
    generateMediaSliderCard('books', books);
    generateMediaSliderVideo('videos', videos);
    generateMediaSliderCard('movies', movies);
    initSwipers();
}