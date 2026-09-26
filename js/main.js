// Smooth scrolling for navigation links
        function smoothScroll(event, blockPosition = 'start') {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: blockPosition });
            }
        }

        // Highlight a feature card
        function highlightFeature(event, cardId) {
            event.preventDefault();
            const card = document.getElementById(cardId);
            if (!card) return;

            // Scroll to the feature card's position
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Use a timeout to apply the highlight after the scroll has likely started
            setTimeout(() => {
                // Remove highlight from any other card
                document.querySelectorAll('.feature-card.highlighted').forEach(c => c.classList.remove('highlighted'));
                
                card.classList.add('highlighted');
                
                // Remove the highlight after 2.5 seconds
                setTimeout(() => {
                    card.classList.remove('highlighted');
                }, 2500); 
            }, 600); // Delay to allow for smooth scroll animation
        }

        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after it's visible so it doesn't re-trigger
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1
        });

        const targets = document.querySelectorAll('.fade-in, .feature-card');
        targets.forEach(target => {
            observer.observe(target);
        });
        
        // Interactive heading animation
        function setupHeadingAnimation() {
            const heading = document.getElementById('main-heading');
            if (!heading) return;

            const text = heading.textContent.trim();
            heading.innerHTML = ''; // Clear the original text

            const chars = text.split('').map(char => {
                const span = document.createElement('span');
                span.textContent = char;
                // Check if the character is 'Q' (case-insensitive) and add the highlight class
                if (char.toLowerCase() === 'q') {
                    span.className = 'char q-highlight';
                } else {
                    span.className = 'char';
                }
                heading.appendChild(span);
                return span;
            });

            chars.forEach((char, index) => {
                char.addEventListener('mouseenter', () => {
                    // Clear previous highlights first to avoid sticky states
                    chars.forEach(c => {
                        c.classList.remove('hover-char', 'neighbor-char');
                    });

                    // Add classes to the current char and its neighbors
                    char.classList.add('hover-char');
                    if (chars[index - 1]) chars[index - 1].classList.add('neighbor-char');
                    if (chars[index + 1]) chars[index + 1].classList.add('neighbor-char');
                });
            });

            heading.addEventListener('mouseleave', () => {
                // Reset all characters when the mouse leaves the heading area
                chars.forEach(c => {
                    c.classList.remove('hover-char', 'neighbor-char');
                });
            });
        }

        // Typing animation for quotes
        function setupTypingAnimation() {
            const quotes = [
                "Alone we can do so little; together we can do so much.",
                "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
                "The science of today is the technology of tomorrow.",
                "An investment in knowledge pays the best interest.",
                "Logic will get you from A to B. Imagination will take you everywhere."
            ];
            const quoteElement = document.getElementById('animated-quote');
            if (!quoteElement) return;

            let quoteIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingSpeed = 100;
            const deletingSpeed = 50;
            const delayBetweenQuotes = 2000;

            function type() {
                const currentQuote = quotes[quoteIndex];
                let displayText;
                let timeoutSpeed = typingSpeed;

                if (isDeleting) {
                    // Deleting
                    displayText = currentQuote.substring(0, charIndex - 1);
                    charIndex--;
                    timeoutSpeed = deletingSpeed;
                } else {
                    // Typing
                    displayText = currentQuote.substring(0, charIndex + 1);
                    charIndex++;
                }

                quoteElement.textContent = displayText;

                if (!isDeleting && charIndex === currentQuote.length) {
                    // Finished typing, pause then start deleting
                    isDeleting = true;
                    timeoutSpeed = delayBetweenQuotes;
                } else if (isDeleting && charIndex === 0) {
                    // Finished deleting, move to next quote
                    isDeleting = false;
                    quoteIndex = (quoteIndex + 1) % quotes.length;
                    timeoutSpeed = 500; // Pause before starting next quote
                }

                setTimeout(type, timeoutSpeed);
            }
            
            // Start the animation
            type();
        }
        
       // Scroll to top and rocket animation logic
        function setupScrollToTop() {
            const btn = document.getElementById('scrollToTopBtn');
            const rocket = document.getElementById('rocket');
            const logo = document.getElementById('logo');
            let isAnimating = false;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
            });

            btn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                const btnRect = btn.getBoundingClientRect();
                const logoRect = logo.getBoundingClientRect();

                // Set initial rocket position
                rocket.style.display = 'block';
                rocket.style.left = `${btnRect.left + (btnRect.width / 2) - 30}px`;
                rocket.style.top = `${btnRect.top + (btnRect.height / 2) - 30}px`;
                rocket.style.transform = 'translate(0, 0) rotate(-45deg)';
                rocket.style.transition = 'transform 1.2s cubic-bezier(0.5, 0, 1, 0.5)';

                // Animate to target
                requestAnimationFrame(() => {
                    const targetX = logoRect.left + (logoRect.width / 2) - (btnRect.left + (btnRect.width / 2));
                    const targetY = logoRect.top + (logoRect.height / 2) - (btnRect.top + (btnRect.height / 2));
                    rocket.style.transform = `translate(${targetX}px, ${targetY}px) rotate(0deg)`;
                });
                
                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    rocket.style.display = 'none';
                    rocket.style.transition = 'none';
                    createBurst(logoRect.left + logoRect.width / 2, logoRect.top + logoRect.height / 2);
                    logo.classList.add('impact');
                    
                    setTimeout(() => {
                        logo.classList.remove('impact');
                        isAnimating = false;
                    }, 700);
                }, 1200);
            });

            function createBurst(x, y) {
                const burst = document.createElement('div');
                burst.className = 'burst';
                burst.style.left = `${x}px`;
                burst.style.top = `${y}px`;
                for (let i = 0; i < 15; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const angle = Math.random() * 360;
                    const distance = Math.random() * 60 + 30;
                    particle.style.setProperty('--x', `${Math.cos(angle * Math.PI / 180) * distance}px`);
                    particle.style.setProperty('--y', `${Math.sin(angle * Math.PI / 180) * distance}px`);
                    burst.appendChild(particle);
                }
                document.body.appendChild(burst);
                setTimeout(() => {
                    document.body.removeChild(burst);
                }, 600);
            }
        }

        // Call the setup functions after the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            setupHeadingAnimation();
            setupScrollToTop();
            setupTypingAnimation();
        });