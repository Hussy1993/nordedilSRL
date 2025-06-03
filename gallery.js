/**
 * NORD EDIL S.R.L. - Gallery Script con Slideshow
 * Script per la gestione della galleria fotografica con slideshow laterale e lightbox
 */

// Array delle immagini GALLERYX
const galleryImages = [];
for (let i = 1; i <= 42; i++) {
    galleryImages.push({
        src: `FOTO2/GALLERYX (${i}).jpeg`,
        alt: `Progetto NORD EDIL ${i}`,
        title: `Progetto ${i}`,
        description: `Realizzazione professionale NORD EDIL`
    });
}

let gallerySwiper = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Inizializza la galleria con slideshow
    initGallerySlideshow();
});

/**
 * Inizializza lo slideshow principale
 */
function initGallerySlideshow() {
    const swiperWrapper = document.querySelector('#gallery-slideshow .swiper-wrapper');
    
    if (!swiperWrapper) return;
    
    // Genera le slide dinamicamente
    galleryImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide gallery-slide';
        slide.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-slide-overlay">
                <h3 class="text-xl font-bold mb-2">${image.title}</h3>
                <p class="text-sm opacity-90">${image.description}</p>
            </div>
        `;
        
        // Aggiungi evento click per aprire lightbox
        slide.addEventListener('click', () => {
            openLightbox(index);
        });
        
        swiperWrapper.appendChild(slide);
    });
    
    // Inizializza Swiper con configurazione avanzata
    gallerySwiper = new Swiper('#gallery-slideshow', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            hide: false,
        },
        effect: 'slide',
        speed: 1000,
        grabCursor: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        mousewheel: {
            enabled: false,
        },
        breakpoints: {
            640: {
                speed: 800,
            },
            768: {
                speed: 1000,
            },
        },
        on: {
            slideChange: function() {
                // Aggiorna l'indice corrente
                currentImageIndex = this.realIndex;
            },
            init: function() {
                // Animazione di entrata
                this.el.style.opacity = '0';
                setTimeout(() => {
                    this.el.style.transition = 'opacity 0.8s ease';
                    this.el.style.opacity = '1';
                }, 100);
            }
        }
    });
}



/**
 * Apre il lightbox con l'immagine selezionata
 * @param {number} index - Indice dell'immagine
 */
function openLightbox(index) {
    currentImageIndex = index;
    
    // Crea l'elemento lightbox se non esiste
    let lightbox = document.getElementById('gallery-lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 opacity-0 transition-opacity duration-300';
        
        const lightboxContent = `
            <div class="relative max-w-6xl w-full h-full mx-4 flex flex-col">
                <!-- Barra superiore con controlli -->
                <div class="flex justify-between items-center p-4 text-white">
                    <div class="flex items-center space-x-4">
                        <span id="lightbox-counter" class="text-sm opacity-75"></span>
                    </div>
                    <button id="close-lightbox" class="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all duration-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Contenitore immagine principale -->
                <div class="flex-1 flex items-center justify-center relative">
                    <button id="prev-lightbox" class="absolute left-4 z-10 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    
                    <img id="lightbox-image" class="max-w-full max-h-full object-contain" src="" alt="">
                    
                    <button id="next-lightbox" class="absolute right-4 z-10 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Informazioni immagine -->
                <div class="p-6 text-white text-center">
                    <h3 id="lightbox-title" class="text-2xl font-bold mb-2"></h3>
                    <p id="lightbox-description" class="text-gray-300"></p>
                </div>
            </div>
        `;
        
        lightbox.innerHTML = lightboxContent;
        document.body.appendChild(lightbox);
        
        // Gestione eventi del lightbox
        document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
        document.getElementById('prev-lightbox').addEventListener('click', showPrevImage);
        document.getElementById('next-lightbox').addEventListener('click', showNextImage);
        
        // Gestione tastiera
        document.addEventListener('keydown', handleKeydown);
        
        // Chiudi il lightbox cliccando fuori dall'immagine
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // Aggiorna i contenuti del lightbox
    updateLightboxContent();
    
    // Mostra il lightbox
    setTimeout(() => {
        lightbox.classList.add('opacity-100');
    }, 10);
    
    // Pausa l'autoplay dello slideshow
    if (gallerySwiper && gallerySwiper.autoplay) {
        gallerySwiper.autoplay.stop();
    }
}

/**
 * Aggiorna il contenuto del lightbox
 */
function updateLightboxContent() {
    const image = galleryImages[currentImageIndex];
    
    document.getElementById('lightbox-image').src = image.src;
    document.getElementById('lightbox-image').alt = image.alt;
    document.getElementById('lightbox-title').textContent = image.title;
    document.getElementById('lightbox-description').textContent = image.description;
    document.getElementById('lightbox-counter').textContent = `${currentImageIndex + 1} di ${galleryImages.length}`;
}

/**
 * Chiude il lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('opacity-100');
    
    setTimeout(() => {
        lightbox.remove();
    }, 300);
    
    // Riprendi l'autoplay dello slideshow
    if (gallerySwiper && gallerySwiper.autoplay) {
        gallerySwiper.autoplay.start();
    }
}

/**
 * Mostra l'immagine precedente nel lightbox
 */
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Mostra l'immagine successiva nel lightbox
 */
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Gestisce gli eventi della tastiera
 * @param {KeyboardEvent} e - Evento tastiera
 */
function handleKeydown(e) {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

/**
 * Sincronizza lo slideshow con il lightbox
 * @param {number} index - Indice dell'immagine
 */
function syncSlideshowToIndex(index) {
    if (gallerySwiper) {
        gallerySwiper.slideToLoop(index);
    }
}