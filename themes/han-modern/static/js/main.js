// Modern interactions and enhancements for han.life
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            // Add a subtle loading indicator if needed
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
    
    // Simple fade-in animation observer for elements that come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add a subtle parallax effect to hero background on scroll
    const hero = document.querySelector('.hero');
    if (hero) {
        let ticking = false;

        function updateHero() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHero);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);

        // Create floating particles effect
        createParticles(hero);
    }
});

// Floating particles effect for hero section
function createParticles(hero) {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.setAttribute('aria-hidden', 'true');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    `;
    hero.appendChild(particleContainer);

    // Create particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        const size = 4 + Math.random() * 4;
        const delay = Math.random() * 8;
        const duration = 12 + Math.random() * 8;
        const startX = Math.random() * 100;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0;
            left: ${startX}%;
            bottom: -20px;
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
        `;
        particleContainer.appendChild(particle);
    }

    // Add particle animation keyframes if not already added
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.15;
                }
                90% {
                    opacity: 0.15;
                }
                100% {
                    transform: translateY(-100vh) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
