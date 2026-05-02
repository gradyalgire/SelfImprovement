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