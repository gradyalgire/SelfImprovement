new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,

    // Pgination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        1920: {
            slidesPerView: 1
        },
    }
});