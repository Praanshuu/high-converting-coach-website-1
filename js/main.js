// main.js - Interactivity and animations

document.addEventListener("DOMContentLoaded", () => {
    
    // 0. Navbar Scroll Effect (Glassmorphism transition)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 0.5 Hero Cursor-Tracking Glow
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const cursor_glow = document.createElement('div');
        cursor_glow.style.cssText = `
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1), top 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 0;
            will-change: left, top;
        `;
        heroSection.appendChild(cursor_glow);

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            cursor_glow.style.left = (e.clientX - rect.left) + 'px';
            cursor_glow.style.top = (e.clientY - rect.top) + 'px';
        });

        heroSection.addEventListener('mouseleave', () => {
            cursor_glow.style.left = '50%';
            cursor_glow.style.top = '50%';
        });
    }

    // 1. FAQ Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // prevent default on empty links
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Subtle Scroll Fade-in Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-element, .card');
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const delay = el.style.transitionDelay;
        if(delay) {
            el.style.transitionProperty = 'opacity, transform';
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Video Modal Logic
    const videoModal = document.getElementById('videoModal');
    const modalTrigger = document.querySelector('.video-modal-trigger');
    const closeModalBtn = document.getElementById('closeModal');
    const videoWrapper = document.querySelector('.modal-video-wrapper');

    if (modalTrigger && videoModal) {
        modalTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = modalTrigger.getAttribute('href');
            
            // Inject iframe
            videoWrapper.innerHTML = `
                <iframe 
                    src="${videoUrl}?autoplay=1" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            `;
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        const closeModal = () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Remove iframe after transition to stop video
            setTimeout(() => {
                videoWrapper.innerHTML = '';
            }, 300);
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // Close on clicking overlay
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 5. Booking Modal Logic
    const bookingModal = document.getElementById('bookingModal');
    const bookingTriggers = document.querySelectorAll('.booking-modal-trigger');
    const closeBookingBtn = document.getElementById('closeBookingModal');

    if (bookingModal) {
        const openBookingModal = (e) => {
            if (e) e.preventDefault();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeBookingModal = () => {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        bookingTriggers.forEach(trigger => {
            trigger.addEventListener('click', openBookingModal);
        });

        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', closeBookingModal);
        }

        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
        });
    }

    // 6. ScrollSpy for Active Navigation Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        const scrollSpyOptions = {
            root: null,
            rootMargin: '-40% 0px -60% 0px',
            threshold: 0
        };

        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, scrollSpyOptions);

        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    }

});
