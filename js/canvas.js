
/* ==========================================================================
   CANVAS.JS — Interactive Particles in the Hero
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       1. CHECK BROWSER SUPPORT
       ---------------------------------------------------------------------- */

    const canvas = document.getElementById('hero-canvas');

    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const hero = canvas.parentElement;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;


    /* ----------------------------------------------------------------------
       2. CONFIGURATION
       ---------------------------------------------------------------------- */

    const CONFIG = {
        particleCount: 60,
        maxDistance: 150,
        particleSize: 1.5,

        particleColor: 'rgba(255, 69, 0, 0.6)',
        lineColor: 'rgba(255, 69, 0, 0.15)',

        mouseRadius: 180,
        mouseForce: 2,

        speed: 0.3,
        maxDPR: 2
    };


    /* ----------------------------------------------------------------------
       3. VARIABLES
       ---------------------------------------------------------------------- */

    let width = 0;
    let height = 0;
    let dpr = 1;

    let particles = [];
    let animationId = null;

   

    const mouse = {
        x: null,
        y: null
    };


    /* ----------------------------------------------------------------------
       4. RESIZE CANVAS
       ---------------------------------------------------------------------- */

    function resizeCanvas() {

        const rect = hero.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        if (width <= 0 || height <= 0) return;

        // Limit pixel ratio for better performance
        dpr = Math.min(
            window.devicePixelRatio || 1,
            CONFIG.maxDPR
        );

        // Update canvas resolution
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // Reset transformation before applying the new DPR
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Calculate particle density based on hero size
        const density = Math.floor(
            (width * height) / 15000
        );

        CONFIG.particleCount = Math.min(
            Math.max(density, 30),
            100
        );

        initParticles();

        // Draw immediately when animation is disabled
        if (prefersReducedMotion) {
            drawParticles();
        }
    }


    /* ----------------------------------------------------------------------
       5. INITIALIZE PARTICLES
       ---------------------------------------------------------------------- */

    function initParticles() {

        particles = [];

        for (let i = 0; i < CONFIG.particleCount; i++) {

            particles.push({

                x: Math.random() * width,

                y: Math.random() * height,

                vx: (Math.random() - 0.5) * CONFIG.speed,

                vy: (Math.random() - 0.5) * CONFIG.speed,

                size: Math.random() * CONFIG.particleSize + 0.5

            });

        }

    }


    /* ----------------------------------------------------------------------
       6. UPDATE PARTICLES
       ---------------------------------------------------------------------- */

    function updateParticles() {

        particles.forEach(function (particle) {

            // Move particles
            particle.x += particle.vx;
            particle.y += particle.vy;


            // Bounce horizontally
            if (particle.x < 0 || particle.x > width) {

                particle.vx *= -1;

                particle.x = Math.max(
                    0,
                    Math.min(particle.x, width)
                );

            }


            // Bounce vertically
            if (particle.y < 0 || particle.y > height) {

                particle.vy *= -1;

                particle.y = Math.max(
                    0,
                    Math.min(particle.y, height)
                );

            }


            // Mouse interaction: gentle repulsion
            if (mouse.x !== null && mouse.y !== null) {

                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (
                    distance < CONFIG.mouseRadius &&
                    distance > 0
                ) {

                    const force =
                        (CONFIG.mouseRadius - distance) /
                        CONFIG.mouseRadius;

                    particle.x +=
                        (dx / distance) *
                        force *
                        CONFIG.mouseForce;

                    particle.y +=
                        (dy / distance) *
                        force *
                        CONFIG.mouseForce;

                }

            }

        });

    }


    /* ----------------------------------------------------------------------
       7. DRAW CONNECTION LINES
       ---------------------------------------------------------------------- */

    function drawConnections() {

        for (let i = 0; i < particles.length; i++) {

            for (let j = i + 1; j < particles.length; j++) {

                const dx = particles[i].x - particles[j].x;

                const dy = particles[i].y - particles[j].y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );


                if (distance < CONFIG.maxDistance) {

                    const opacity =
                        (1 - distance / CONFIG.maxDistance) * 0.15;

                    ctx.strokeStyle =
                        `rgba(255, 69, 0, ${opacity})`;

                    ctx.lineWidth = 0.5;

                    ctx.beginPath();

                    ctx.moveTo(
                        particles[i].x,
                        particles[i].y
                    );

                    ctx.lineTo(
                        particles[j].x,
                        particles[j].y
                    );

                    ctx.stroke();

                }

            }

        }

    }


    /* ----------------------------------------------------------------------
       8. DRAW PARTICLES
       ---------------------------------------------------------------------- */

    function drawDots() {

        particles.forEach(function (particle) {

            ctx.fillStyle = CONFIG.particleColor;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });

    }


    /* ----------------------------------------------------------------------
       9. DRAW EVERYTHING
       ---------------------------------------------------------------------- */

    function drawParticles() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        drawConnections();

        drawDots();

    }


    /* ----------------------------------------------------------------------
       10. ANIMATION LOOP
       ---------------------------------------------------------------------- */

    function animate() {

    updateParticles();

    drawParticles();

    requestAnimationFrame(animate);

}


    /* ----------------------------------------------------------------------
       11. POINTER INTERACTION
       ---------------------------------------------------------------------- */

    function handlePointerMove(event) {

        // Ignore touch movement
        if (event.pointerType === 'touch') return;

        const rect = hero.getBoundingClientRect();

        mouse.x = event.clientX - rect.left;

        mouse.y = event.clientY - rect.top;

    }


    function handlePointerLeave() {

        mouse.x = null;

        mouse.y = null;

    }


    /* ----------------------------------------------------------------------
       12. INITIALIZATION
       ---------------------------------------------------------------------- */

function init() {

    resizeCanvas();

    // Observe hero size changes
    if ('ResizeObserver' in window) {

        const resizeObserver = new ResizeObserver(function () {
            resizeCanvas();
        });

        resizeObserver.observe(hero);

    } else {

        window.addEventListener(
            'resize',
            resizeCanvas,
            { passive: true }
        );

    }

    // Pointer interaction
    if (!prefersReducedMotion) {

        hero.addEventListener(
            'pointermove',
            handlePointerMove,
            { passive: true }
        );

        hero.addEventListener(
            'pointerleave',
            handlePointerLeave
        );

        // Start animation
        animate();

    }

}
    /* ----------------------------------------------------------------------
       13. START
       ---------------------------------------------------------------------- */

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            init,
            { once: true }
        );

    } else {

        init();

    }

})();
