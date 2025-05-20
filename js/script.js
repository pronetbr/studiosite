document.addEventListener('DOMContentLoaded', () => {
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

    // 3. Subtle Background Animation for Hero Section (index.html)
    const heroSection = document.getElementById('hero');

    if (heroSection) { // Ensure hero section exists on the page
        const numberOfParticles = 30; // Adjust number of particles as desired
        for (let i = 0; i < numberOfParticles; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Vary size
            const size = Math.random() * 5 + 2; // Size between 2px and 7px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Vary horizontal position
            particle.style.left = `${Math.random() * 100}%`;
            
            // Vary animation delay and duration
            // This creates a more staggered and natural effect.
            particle.style.animationDelay = `${Math.random() * 10}s`; // Delay up to 10s
            particle.style.animationDuration = `${Math.random() * 5 + 8}s`; // Duration between 8s and 13s
            
            heroSection.appendChild(particle);
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

});
