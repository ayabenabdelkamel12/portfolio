
/* ==========================================================================
   SCROLL.JS — GSAP Scroll Animations
   ========================================================================== */

(function () {
    'use strict';

    // Respect accessibility preferences
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Check GSAP availability
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded.');
        return;
    }

    // Check ScrollTrigger availability
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger is not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    function animateOnScroll(target, options) {

    const elements = gsap.utils.toArray(target);

    if (!elements.length) return;

    const trigger = options.trigger || elements[0];

    if (
        typeof trigger === 'string' &&
        !document.querySelector(trigger)
    ) {
        return;
    }

    gsap.from(elements, {
        ...options,
        scrollTrigger: {
            ...options.scrollTrigger,
            trigger,
            once: true
        }
    });
}

    /* ----------------------------------------------------------------------
       1. GLOBAL SETTINGS
       ---------------------------------------------------------------------- */

    gsap.defaults({
        ease: 'power3.out',
        duration: 0.8
    });

    /* ----------------------------------------------------------------------
       2. HERO ANIMATION
       ---------------------------------------------------------------------- */

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out'
        }
    });

    heroTimeline
        .from('.hero .tag', {
            y: 20,
            opacity: 0,
            duration: 0.6
        })
        .from('.hero__title', {
            y: 40,
            opacity: 0,
            duration: 0.9
        }, '-=0.3')
        .from('.hero__description', {
            y: 25,
            opacity: 0,
            duration: 0.7
        }, '-=0.5')
        .from('.hero__tags .pill', {
            y: 15,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5
        }, '-=0.4')
        .from('.hero__cta .btn', {
            y: 20,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6
        }, '-=0.3')
        .from('.hero__card', {
            x: 40,
            opacity: 0,
            duration: 1
        }, '-=0.8');

    /* ----------------------------------------------------------------------
       3. SECTION HEADINGS
       ---------------------------------------------------------------------- */

    gsap.utils.toArray('.section > .container').forEach((container) => {

        const tag = container.querySelector('.tag');
        const title = container.querySelector('.section__title');

        const elements = [tag, title].filter(Boolean);

        if (!elements.length) return;

        gsap.from(elements, {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: container,
                start: 'top 85%',
                once: true
            }
        });
    });

    /* ----------------------------------------------------------------------
       4. ABOUT SECTION
       ---------------------------------------------------------------------- */

    gsap.from('.about__image-wrapper', {
        x: -40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about__grid',
            start: 'top 80%',
            once: true
        }
    });

    gsap.from('.about__content p', {
        y: 25,
        opacity: 0,
        stagger: 0.2,
        duration: 0.7,
        scrollTrigger: {
            trigger: '.about__content',
            start: 'top 80%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       5. EXPERIENCE
       ---------------------------------------------------------------------- */

    gsap.from('.experience__item', {
        x: -35,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
            trigger: '.experience__list',
            start: 'top 85%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       6. PROJECT CARDS
       ---------------------------------------------------------------------- */

    gsap.from('.project-card', {
        y: 45,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.work__grid',
            start: 'top 80%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       7. SERVICES
       ---------------------------------------------------------------------- */

    gsap.from('.service-item', {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        scrollTrigger: {
            trigger: '.services__list',
            start: 'top 85%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       8. PROCESS CARDS
       ---------------------------------------------------------------------- */

    gsap.from('.process-card', {
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.process__grid',
            start: 'top 80%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       9. SKILLS CARDS
       ---------------------------------------------------------------------- */

    gsap.from('.skill-card', {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        scrollTrigger: {
            trigger: '.skills__grid',
            start: 'top 85%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       10. FAQ
       ---------------------------------------------------------------------- */

    gsap.from('.faq-item', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.faq__list',
            start: 'top 85%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       11. CONTACT
       ---------------------------------------------------------------------- */

    gsap.from('.contact__info', {
        x: -35,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
            trigger: '.contact__grid',
            start: 'top 80%',
            once: true
        }
    });

    gsap.from('.contact__form-wrapper', {
        x: 35,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
            trigger: '.contact__grid',
            start: 'top 80%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       12. FOOTER
       ---------------------------------------------------------------------- */

    gsap.from('.footer__brand, .footer__links', {
        y: 25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.footer__top',
            start: 'top 90%',
            once: true
        }
    });

    /* ----------------------------------------------------------------------
       13. REFRESH SCROLLTRIGGER
       ---------------------------------------------------------------------- */

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

})();
