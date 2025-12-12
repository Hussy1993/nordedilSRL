// NORD EDIL S.R.L. - Main Application Script

// Initialize EmailJS
try {
    emailjs.init({
        publicKey: 'YOUR_PUBLIC_KEY', // Sostituire con la chiave pubblica di EmailJS
        blockHeadless: true,
        limitRate: {
            id: 'app',
            throttle: 10000,
        },
    });
} catch (e) {
    console.warn("EmailJS not initialized (missing script or key)");
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("App initialized");

    // --- 1. SLIDERS & CAROUSELS ---

    // Client Logo Slider
    if (document.querySelector('.client-logo-slider')) {
        new Swiper('.client-logo-slider', {
            loop: true,
            slidesPerView: 2,
            spaceBetween: 20,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.client-logo-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 3, spaceBetween: 30 },
                768: { slidesPerView: 4, spaceBetween: 40 },
                1024: { slidesPerView: 5, spaceBetween: 50 }
            }
        });
    }

    // Prima e Dopo Slider (Custom Implementation)
    const sliderContainer = document.getElementById('sliderContainer');
    if (sliderContainer) {
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');

        // Define functions globally for HTML onclick access or attach listeners
        window.changeSlide = function (direction) {
            currentSlideIndex += direction;
            showSlide(currentSlideIndex);
        };

        window.currentSlide = function (index) {
            currentSlideIndex = index - 1;
            showSlide(currentSlideIndex);
        };

        function showSlide(index) {
            if (index >= slides.length) currentSlideIndex = 0;
            if (index < 0) currentSlideIndex = slides.length - 1;

            sliderContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        }

        // Auto-play
        setInterval(() => {
            changeSlide(1);
        }, 5000);

        // Mobile Swipe Support
        let startX = 0;
        let endX = 0;
        sliderContainer.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
        sliderContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50;
            const diff = startX - endX;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) changeSlide(1);
                else changeSlide(-1);
            }
        }
    }

    // --- 2. ANIMATIONS (AOS) ---
    if (typeof AOS !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        AOS.init({
            duration: isMobile ? 600 : 800,
            easing: 'ease-in-out',
            once: true,
            offset: isMobile ? 50 : 120,
            delay: isMobile ? 0 : 100,
            disable: function () {
                return window.innerWidth < 480 && navigator.hardwareConcurrency < 4;
            }
        });
    }

    // --- 3. PERFORMANCE & LAZY LOADING ---

    // Native Lazy Loading Fallback / Custom Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '500px 0px', threshold: 0.01 });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // Preload Critical Images
    const criticalImages = [
        '/FOTO2/IMMAGINE PRO.png',
        '/FOTO2/WhatsApp Image 2025-04-04 at 17.50.06 (2).jpeg'
    ];
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });

    // Scroll Optimization
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Logic for parallax or other scroll effects can go here

                // Back to Top Button Logic
                const backToTopButton = document.getElementById('back-to-top');
                if (backToTopButton) {
                    if (window.scrollY > 300) {
                        backToTopButton.classList.remove('opacity-0', 'invisible');
                        backToTopButton.classList.add('opacity-100', 'visible');
                    } else {
                        backToTopButton.classList.remove('opacity-100', 'visible');
                        backToTopButton.classList.add('opacity-0', 'invisible');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- 4. NAVIGATION & MOBILE ---

    // Mobile Menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    if (mobileMenuButton && mobileMenu) {
        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('show');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('show');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                setTimeout(() => { if (!isMenuOpen) mobileMenu.classList.add('hidden'); }, 300);
            }
        }
        mobileMenuButton.addEventListener('click', toggleMobileMenu);

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { if (isMenuOpen) toggleMobileMenu(); });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                toggleMobileMenu();
            }
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Device Orientation
    window.addEventListener('orientationchange', function () {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    });

    // --- 5. FORMS & INTERACTION ---

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        const cookieModal = document.getElementById('cookie-modal');
        const cookieAccept = document.getElementById('cookie-accept');
        const cookieReject = document.getElementById('cookie-reject');
        const cookieSettings = document.getElementById('cookie-settings');
        const cookieModalClose = document.getElementById('cookie-modal-close');

        function checkCookieConsent() {
            if (!localStorage.getItem('cookie_consent')) {
                setTimeout(() => cookieBanner.classList.remove('translate-y-full'), 1000);
            }
        }

        function setCookieConsent(type) {
            localStorage.setItem('cookie_consent', JSON.stringify({ type, timestamp: Date.now() }));
            cookieBanner.classList.add('translate-y-full');
        }

        if (cookieAccept) cookieAccept.addEventListener('click', () => setCookieConsent('all'));
        if (cookieReject) cookieReject.addEventListener('click', () => setCookieConsent('necessary'));
        if (cookieSettings && cookieModal) cookieSettings.addEventListener('click', () => cookieModal.classList.remove('hidden'));
        if (cookieModalClose && cookieModal) cookieModalClose.addEventListener('click', () => cookieModal.classList.add('hidden'));

        checkCookieConsent();
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio...';

            emailjs.sendForm('service_nordedil', 'template_nordedil', this)
                .then(() => {
                    alert('Messaggio inviato con successo!');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Errore:', error);
                    alert('Errore nell\'invio. Riprova più tardi.');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                });
        });
    }

    // Back to Top (Click listener)
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
