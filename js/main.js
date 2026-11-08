
/* ==========================================================================
   MAIN.JS — Portfolio Interactions & Animations
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       1. DOM ELEMENTS
       ---------------------------------------------------------------------- */

    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const localTime = document.getElementById('local-time');
    const header = document.querySelector('.header');

    const DESKTOP_BREAKPOINT = 900;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


    /* ----------------------------------------------------------------------
       2. MOBILE NAVIGATION
       ---------------------------------------------------------------------- */

    function initNavigation() {

        if (!navToggle || !navLinks) return;
        
        navToggle.setAttribute('aria-expanded', 'false');
navLinks.classList.remove('is-open');

        function openMenu() {
            navToggle.classList.add('is-active');
            navLinks.classList.add('is-open');

            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close menu');

            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            navToggle.classList.remove('is-active');
            navLinks.classList.remove('is-open');

            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');

            document.body.classList.remove('menu-open');
        }

        navToggle.addEventListener('click', function () {

            const isOpen =
                navToggle.getAttribute('aria-expanded') === 'true';

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close menu with Escape
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {

            if (
                navLinks.classList.contains('is-open') &&
                !navLinks.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close menu when returning to desktop
        window.addEventListener('resize', function () {

            if (window.innerWidth >= DESKTOP_BREAKPOINT) {
                closeMenu();
            }
        });

    }


    /* ----------------------------------------------------------------------
       3. RABAT LOCAL TIME
       ---------------------------------------------------------------------- */

    function initLocalTime() {

        if (!localTime) return;

        function updateTime() {

            try {

                const time = new Intl.DateTimeFormat('en-GB', {
                    timeZone: 'Africa/Casablanca',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(new Date());

                localTime.textContent = 'Rabat, MAROC · ' + time;

            } catch (error) {

                localTime.textContent = 'Rabat, MAROC';

            }
        }

        updateTime();

        // Update every minute
        setInterval(updateTime, 60000);
    }


    /* ----------------------------------------------------------------------
       4. HEADER SCROLL EFFECT
       ---------------------------------------------------------------------- */

    function initHeaderScroll() {

        if (!header) return;

        function updateHeader() {

            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        }

        updateHeader();

        window.addEventListener('scroll', updateHeader, {
            passive: true
        });
    }


    /* ----------------------------------------------------------------------
       5. FAQ ACCORDION
       ---------------------------------------------------------------------- */

    function initFAQ() {

        const faqButtons = document.querySelectorAll(
            '.faq-item__question'
        );

        if (!faqButtons.length) return;

        faqButtons.forEach(function (button) {

            button.addEventListener('click', function () {

                const currentItem = button.closest('.faq-item');

                if (!currentItem) return;

                const currentAnswer = currentItem.querySelector(
                    '.faq-item__answer'
                );

                const isOpen =
                    button.getAttribute('aria-expanded') === 'true';

                // Close all FAQ items
                faqButtons.forEach(function (otherButton) {

                    const otherItem = otherButton.closest('.faq-item');

                    const otherAnswer = otherItem
                        ? otherItem.querySelector('.faq-item__answer')
                        : null;

                    otherButton.setAttribute('aria-expanded', 'false');

                    if (otherItem) {
                        otherItem.classList.remove('is-open');
                    }

                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                });

                // Open selected item
                if (!isOpen) {

                    button.setAttribute('aria-expanded', 'true');

                    currentItem.classList.add('is-open');

                    if (currentAnswer) {
                        currentAnswer.style.maxHeight =
                            currentAnswer.scrollHeight + 'px';
                    }
                }
            });
        });
    }


    /* ----------------------------------------------------------------------
       6. LENIS SMOOTH SCROLL
       ---------------------------------------------------------------------- */

    function initLenis() {

        if (
            typeof Lenis === 'undefined' ||
            prefersReducedMotion
        ) {
            return;
        }

        try {

            const lenis = new Lenis({
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.5,
                easing: function (t) {
                    return Math.min(
                        1,
                        1.001 - Math.pow(2, -10 * t)
                    );
                }
            });

            // Connect Lenis with GSAP ScrollTrigger
            if (
                typeof gsap !== 'undefined' &&
                typeof ScrollTrigger !== 'undefined'
            ) {

                lenis.on('scroll', ScrollTrigger.update);

                gsap.ticker.add(function (time) {
                    lenis.raf(time * 1000);
                });

                gsap.ticker.lagSmoothing(0);

            } else {

                // Fallback when GSAP is unavailable
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);
            }

            window.portfolioLenis = lenis;

        } catch (error) {

            console.warn('Lenis initialization failed:', error);

        }
    }


   


    /* ----------------------------------------------------------------------
       8. INITIALIZATION
       ---------------------------------------------------------------------- */

   function init() {

    initNavigation();
    initLocalTime();
    initHeaderScroll();
    initFAQ();
    initLenis();

}

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init, {
            once: true
        });

    } else {

        init();

    }

})();
