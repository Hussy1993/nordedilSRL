// OTTIMIZZAZIONI MOBILE AVANZATE - NORD EDIL S.R.L.
// File JavaScript dedicato alle ottimizzazioni mobile

document.addEventListener('DOMContentLoaded', function() {
    
    // LAZY LOADING OTTIMIZZATO PER MOBILE
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Preload dell'immagine
                        const imageLoader = new Image();
                        imageLoader.onload = function() {
                            img.src = img.dataset.src;
                            img.classList.remove('lazyload');
                            img.classList.add('lazyloaded');
                        };
                        imageLoader.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // TOUCH EVENTS OTTIMIZZATI
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Gestione swipe per navigazione
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGestures();
    }, { passive: true });
    
    function handleSwipeGestures() {
        const swipeThreshold = 50;
        const swipeUp = touchEndY < touchStartY - swipeThreshold;
        const swipeDown = touchEndY > touchStartY + swipeThreshold;
        const swipeLeft = touchEndX < touchStartX - swipeThreshold;
        const swipeRight = touchEndX > touchStartX + swipeThreshold;
        
        // Swipe up per nascondere elementi fissi temporaneamente
        if (swipeUp) {
            const whatsappBtn = document.querySelector('a[href*="wa.me"]');
            const backToTopBtn = document.getElementById('back-to-top');
            
            if (whatsappBtn) {
                whatsappBtn.style.transform = 'translateY(100px)';
                setTimeout(() => {
                    whatsappBtn.style.transform = '';
                }, 3000);
            }
        }
    }
    
    // PERFORMANCE MONITORING MOBILE
    function optimizeForMobile() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Throttle scroll events per performance
            let ticking = false;
            
            function updateOnScroll() {
                const scrollY = window.scrollY;
                
                // Aggiorna back-to-top button
                const backToTopButton = document.getElementById('back-to-top');
                if (backToTopButton) {
                    if (scrollY > 300) {
                        backToTopButton.classList.remove('opacity-0', 'invisible');
                        backToTopButton.classList.add('opacity-100', 'visible');
                    } else {
                        backToTopButton.classList.remove('opacity-100', 'visible');
                        backToTopButton.classList.add('opacity-0', 'invisible');
                    }
                }
                
                // Nascondi header su scroll down, mostra su scroll up
                const header = document.querySelector('.sticky-header');
                if (header) {
                    if (scrollY > 100) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }
                }
                
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateOnScroll);
                    ticking = true;
                }
            }, { passive: true });
            
            // Ottimizza animazioni per dispositivi lenti
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (prefersReducedMotion.matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            }
        }
    }
    
    // GESTIONE ORIENTAMENTO DISPOSITIVO
    function handleOrientationChange() {
        // Forza re-layout dopo cambio orientamento
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
        
        // Chiudi menu mobile se aperto
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // PREVENZIONE ZOOM ACCIDENTALE iOS
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
    
    // OTTIMIZZAZIONE FORM MOBILE
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Previeni zoom su focus per iOS
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                }
            });
            
            input.addEventListener('blur', function() {
                if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
                    }
                }
            });
        });
    });
    
    // INIZIALIZZAZIONE
    optimizeForMobile();
    
    // Re-ottimizza su resize con debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(optimizeForMobile, 250);
    }, { passive: true });
    
    // ACCESSIBILITY MOBILE
    // Migliora la navigazione da tastiera su mobile
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // PERFORMANCE METRICS (opzionale)
    if ('performance' in window && 'PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    }
                    if (entry.entryType === 'layout-shift') {
                        console.log('CLS:', entry.value);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch (e) {
            // PerformanceObserver non supportato
        }
    }
    
    console.log('🚀 Ottimizzazioni mobile NORD EDIL caricate con successo!');
});