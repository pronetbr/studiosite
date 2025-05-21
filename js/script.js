document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // 1. Responsive Navigation Menu (Hamburger Menu)
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav'); // Select the <nav> element

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            // Toggles the class on the body or a specific header/nav container
            // The CSS uses '.nav-open' on the <body> or <header> to show the nav.
            // My CSS is set up to react to 'nav-open' on the <body>.
            document.body.classList.toggle('nav-open'); 
        });
    }

    // 2. Interactive Image Gallery (Lightbox for portfolio.html)
    // This code should only run if the necessary elements are on the page.
    const portfolioImages = document.querySelectorAll('#portfolio-grid .project-item img');
    const modal = document.getElementById('lightbox-modal');
    
    if (modal && portfolioImages.length > 0) { // Ensure modal and images exist
        const modalImg = document.getElementById('lightbox-image');
        const captionText = document.getElementById('lightbox-caption');
        const closeBtn = modal.querySelector('.lightbox-close');

        portfolioImages.forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = 'flex'; // Show modal (using flex as per CSS)
                modalImg.src = this.src;
                // Try to get caption from alt text or a sibling paragraph or parent's h4
                let itemCaption = this.alt;
                if (!itemCaption && this.parentNode.querySelector('p')) {
                    itemCaption = this.parentNode.querySelector('p').textContent;
                } else if (!itemCaption && this.parentNode.querySelector('h4')) {
                     itemCaption = this.parentNode.querySelector('h4').textContent;
                }
                captionText.innerHTML = itemCaption || '';
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal if user clicks outside the image content
        modal.addEventListener('click', (e) => {
            // If the click is on the modal backdrop itself (not the image or caption)
            if (e.target === modal) { 
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    // New Hero Animation with GSAP
    if (document.querySelector('#hero')) { // Check if we are on a page with hero
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Animate title words
        tl.to(".hero-title span", {
            opacity: 1,
            y: -20, // Move up slightly
            stagger: 0.3, // Delay between each span
            duration: 0.8
        });

        // Animate subtitle
        tl.to(".hero-subtitle", {
            opacity: 1,
            y: -10,
            duration: 0.6
        }, "-=0.4"); // Start slightly before previous animation ends

        // Animate CTA button
        tl.to(".hero-cta", {
            opacity: 1,
            y: -10,
            duration: 0.6
        }, "-=0.3");

        // Mouse move interaction for background shapes
        const shapes = gsap.utils.toArray(".shape");
        const heroSection = document.getElementById('hero'); // Re-declare heroSection for this scope
            
        if (heroSection && shapes.length > 0) {
            heroSection.addEventListener('mousemove', (e) => {
                // Calculate mouse position relative to the center of the hero section
                let rect = heroSection.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;

                // Move shapes based on mouse position
                // Adjust the multiplier for more/less movement
                gsap.to(shapes, {
                    x: (x - rect.width / 2) * 0.03, 
                    y: (y - rect.height / 2) * 0.03,
                    stagger: 0.02, // Slight delay between shapes for a more fluid feel
                    ease: "power1.out",
                    duration: 0.5
                });
            });
        }
    }

    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split("/").pop();
        // Handle index.html specifically for root path
        if ((currentPath === "" || currentPath === "index.html") && (linkPath === "" || linkPath === "index.html")) {
            link.classList.add('active');
        } else if (linkPath === currentPath && linkPath !== "" && linkPath !== "index.html") {
            link.classList.add('active');
        }
    });

    // Page Transition Logic
    const transitionWrapper = document.querySelector('.page-transition-wrapper');

    // Fade-in animation for current page
    if (transitionWrapper) {
        gsap.to(transitionWrapper, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2 // Slight delay to ensure assets are loading
        });
    }

    // Fade-out animation for navigation
    const pageNavLinks = document.querySelectorAll('header nav a, .cta-button'); // Renamed to avoid conflict with previous navLinks

    pageNavLinks.forEach(link => {
        // Filter out links to external sites or non-http/https links (like mailto)
        if (link.href && (link.protocol === "http:" || link.protocol === "https:")) {
            // Filter out links that are just for sections on the current page (hash links)
            // or links that open in a new tab
            if (link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
                link.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent default navigation
                    const destination = this.href;

                    document.body.classList.add('is-transitioning');

                    gsap.to(transitionWrapper || 'body', { // Fallback to body if wrapper not found
                        opacity: 0,
                        y: -20, // Optional: slight upward movement
                        duration: 0.5,
                        ease: "power2.in",
                        onComplete: () => {
                            window.location.href = destination;
                        }
                    });
                });
            }
        }
    });

    // Handle back/forward button navigation (simplified version)
    // This ensures the fade-in happens, but might not be perfect for all scenarios
    window.addEventListener('pageshow', function(event) {
        // event.persisted is true if page is from bfcache
        if (event.persisted && transitionWrapper) {
            document.body.classList.remove('is-transitioning');
            gsap.set(transitionWrapper, { opacity: 0, y: 20 }); // Reset before fade-in
            gsap.to(transitionWrapper, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.1
            });
        }
    });

    // --- Enhanced Hover Effects & Microinteractions ---

    // 1. Navigation Links Hover Effect
    const allNavLinks = document.querySelectorAll('header nav a, .nav__link'); // Combined selector
    allNavLinks.forEach(link => {
        // GSAP will animate the ::after pseudo-element's 'left' property
        // by changing a CSS variable on the link itself.
        // Ensure the CSS for ::after uses var(--underline-left, -100%) for its left property.
        gsap.set(link, {css: {'--underline-left': "-100%"}}); // Initialize CSS variable

        const hoverTimeline = gsap.timeline({ paused: true });
        hoverTimeline.to(link, { 
            css: {'--underline-left': "0%"},
            duration: 0.4,
            ease: "power2.out"
        });
        // Optional: text moving up slightly
        // hoverTimeline.to(link, { y: -3, duration: 0.2, ease: "power1.out" }, 0);

        link.addEventListener('mouseenter', () => hoverTimeline.play());
        link.addEventListener('mouseleave', () => hoverTimeline.reverse());
    });

    // 2. Button Hover Effects (Shine/Glint)
    const buttons = document.querySelectorAll('.cta-button, #contact-form-section button[type="submit"]');
    buttons.forEach(button => {
        const shineElement = document.createElement('span');
        shineElement.style.position = 'absolute';
        shineElement.style.top = '0';
        shineElement.style.left = '-150%';
        shineElement.style.width = '50%';
        shineElement.style.height = '100%';
        shineElement.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)';
        shineElement.style.transform = 'skewX(-25deg)';
        button.appendChild(shineElement);

        const buttonHoverTimeline = gsap.timeline({ paused: true });
        buttonHoverTimeline.to(shineElement, {
            left: '150%',
            duration: 0.75,
            ease: 'power1.inOut'
        }).to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power1.out'
        }, 0);

        button.addEventListener('mouseenter', () => buttonHoverTimeline.play());
        button.addEventListener('mouseleave', () => {
            buttonHoverTimeline.reverse();
            // Consider adding: gsap.set(shineElement, {left: '-150%'}); 
            // if the reverse() doesn't perfectly reset on quick mouse out.
        });
    });
    
    // 3. Microinteraction: Form Field Focus (Contact Page)
    const formFields = document.querySelectorAll('#contact-form-section input[type="text"], #contact-form-section input[type="email"], #contact-form-section textarea');
    formFields.forEach(field => {
        const focusTimeline = gsap.timeline({ paused: true });
        focusTimeline.to(field, {
            borderBottomColor: 'var(--accent-color)', // Animate border-bottom-color
            duration: 0.4,
            ease: 'power2.out'
        });

        field.addEventListener('focus', () => focusTimeline.play());
        field.addEventListener('blur', () => focusTimeline.reverse());
    });

    // 4. Microinteraction: Button Click Feedback
    buttons.forEach(button => {
        button.addEventListener('click', (e) => { // Added 'e' parameter
            // Prevent default for actual <button> elements or anchors acting as buttons if needed
            if (button.tagName === 'BUTTON' || (button.tagName === 'A' && button.getAttribute('href') === '#')) {
                // e.preventDefault(); // Only if it's an anchor button causing page jump.
                                   // For actual submit buttons, this would prevent form submission.
            }

            gsap.timeline()
                .to(button, { scale: 0.9, duration: 0.1, ease: 'power1.in' })
                .to(button, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // --- Custom Cursor Logic ---

    // Create cursor elements and append to body
    const cursorDot = document.createElement('div');
    cursorDot.id = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.id = 'custom-cursor-ring';
    document.body.appendChild(cursorRing);

    // GSAP for smooth following (can also be done with requestAnimationFrame)
    gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
    gsap.set(cursorRing, { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(cursorDot, "x", { duration: 0.2, ease: "power2.out" });
    let yTo = gsap.quickTo(cursorDot, "y", { duration: 0.2, ease: "power2.out" });
    let xRingTo = gsap.quickTo(cursorRing, "x", { duration: 0.4, ease: "power2.out" }); // Ring can be slightly slower
    let yRingTo = gsap.quickTo(cursorRing, "y", { duration: 0.4, ease: "power2.out" });

    window.addEventListener('mousemove', e => {
        xTo(e.clientX);
        yTo(e.clientY);
        xRingTo(e.clientX);
        yRingTo(e.clientY);
    });

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, input[type="submit"], input[type="text"], input[type="email"], textarea, .project-item img'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // --- Dynamic Portfolio Presentation ---

    // 1. Animate portfolio items into view on scroll
    const portfolioItems = gsap.utils.toArray("#portfolio-grid .project-item");
    if (portfolioItems.length > 0) {
        portfolioItems.forEach((item, index) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%", // When top of item is 85% from top of viewport
                    toggleActions: "play none none none", // Play animation once when it enters
                    // markers: true, // For debugging ScrollTrigger positions
                }
            });
        });
    }

    // 2. Enhanced hover effect on portfolio items (Image scale)
    portfolioItems.forEach(item => { // Re-using portfolioItems if it was populated
        const img = item.querySelector('img');
        // const overlay = item.querySelector('.project-info-overlay'); // CSS handles overlay animation

        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(img, { scale: 1.1, duration: 0.4, ease: "power1.out" });

        item.addEventListener('mouseenter', () => hoverTl.play());
        item.addEventListener('mouseleave', () => hoverTl.reverse());
    });
});
