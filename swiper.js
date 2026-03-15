// Podcasts — up to 2 slides per view
new Swiper('.podcasts .card-wrapper', {
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
        768:  { slidesPerView: 1 },
        1200: { slidesPerView: 2 }
    }
});

// Books — up to 2 slides per view
new Swiper('.swiper-books .card-wrapper', {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 2,
    pagination: {
        el: '.swiper-books .swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-books .swiper-button-next',
        prevEl: '.swiper-books .swiper-button-prev',
    },
    breakpoints: {
        768:  { slidesPerView: 1 },
        1200: { slidesPerView: 2 }
    }
});

// Videos — up to 2 slides per view
new Swiper('.videos .card-wrapper', {
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
        768:  { slidesPerView: 1 },
        1200: { slidesPerView: 2 }
    }
});

// Movies — up to 3 slides per view
new Swiper('.swiper-movies .card-wrapper', {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 1,
    pagination: {
        el: '.swiper-movies .swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-movies .swiper-button-next',
        prevEl: '.swiper-movies .swiper-button-prev',
    },
    breakpoints: {
        768:  { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
    }
});