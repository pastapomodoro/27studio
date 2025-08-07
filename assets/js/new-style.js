/**
 * New Style JavaScript - Consistent with Hero Component
 * Handles all animations, interactions, and responsive behavior
 */

class NewStyleSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupNavigationScroll();
        this.setupMobileMenu();
        this.setupFormProgress();
        this.setupFormValidation();
        this.setupSmoothScrolling();
        this.setupButtonInteractions();
        this.setupFAQ();
        this.handleResponsiveFeatures();
        this.addKeyboardNavigation();
        this.addReducedMotionSupport();
        this.setupShowcaseCarousel();
    }

    /**
     * Setup Intersection Observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            this.showAllElements();
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animate-appear class
        const animateElements = document.querySelectorAll('.animate-appear');
        animateElements.forEach(element => {
            // If the element is inside the hero component, run the animation.
            // Otherwise, observe it.
            if (element.closest('.hero-component')) {
                element.style.animationPlayState = 'running';
            } else {
                element.style.animationPlayState = 'paused';
                observer.observe(element);
            }
        });
    }

    /**
     * Fallback for browsers without Intersection Observer
     */
    showAllElements() {
        const animateElements = document.querySelectorAll('.animate-appear');
        animateElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Setup navigation scroll behavior and transparency
     */
    setupNavigationScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(243, 241, 234, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(243, 241, 234, 0.95)';
                navbar.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const closeBtn = document.getElementById('closeBtn');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!hamburgerBtn || !closeBtn || !mobileMenuOverlay) return;

        // Open mobile menu
        const openMenu = () => {
            mobileMenuOverlay.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Focus trap
            closeBtn.focus();
        };

        // Close mobile menu
        const closeMenu = () => {
            mobileMenuOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
            hamburgerBtn.blur();
        };

        // Event listeners
        hamburgerBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        // Close menu when clicking on overlay
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                closeMenu();
            }
        });

        // Close menu when clicking on navigation links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
                // Smooth scroll will handle the navigation
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /**
     * Setup form progress tracking
     */
    setupFormProgress() {
        const form = document.getElementById('contactForm');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercent = document.getElementById('progressPercent');

        if (!form || !progressFill || !progressText || !progressPercent) return;

        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        const optionalFields = form.querySelectorAll('input:not([required]), select:not([required]), textarea:not([required])');
        const privacyCheckbox = form.querySelector('#privacy');

        const updateProgress = () => {
            let filledRequired = 0;
            let filledOptional = 0;
            
            // Check required fields
            requiredFields.forEach(field => {
                if (field.type === 'checkbox') {
                    if (field.checked) filledRequired++;
                } else if (field.value.trim() !== '') {
                    filledRequired++;
                }
            });

            // Check optional fields
            optionalFields.forEach(field => {
                if (field.type === 'checkbox') {
                    if (field.checked) filledOptional++;
                } else if (field.value.trim() !== '') {
                    filledOptional++;
                }
            });

            // Calculate progress (required fields count more)
            const requiredWeight = 70; // 70% weight for required fields
            const optionalWeight = 30; // 30% weight for optional fields
            
            const requiredProgress = (filledRequired / requiredFields.length) * requiredWeight;
            const optionalProgress = (filledOptional / optionalFields.length) * optionalWeight;
            
            const totalProgress = Math.min(100, requiredProgress + optionalProgress);
            
            // Update progress bar
            progressFill.style.width = totalProgress + '%';
            progressPercent.textContent = Math.round(totalProgress) + '%';

            // Update progress text
            if (totalProgress === 0) {
                progressText.textContent = 'Inizia compilando i tuoi dati';
            } else if (totalProgress < 30) {
                progressText.textContent = 'Ottimo inizio! Continua così';
            } else if (totalProgress < 60) {
                progressText.textContent = 'Stai andando bene, ancora un po\'';
            } else if (totalProgress < 90) {
                progressText.textContent = 'Quasi finito, mancano pochi campi';
            } else if (totalProgress < 100) {
                progressText.textContent = 'Ultimi dettagli e hai finito!';
            } else {
                progressText.textContent = '🎉 Complimenti! Tutto compilato';
                progressFill.style.background = 'linear-gradient(90deg, #00c851 0%, #00c851 100%)';
            }
        };

        // Add event listeners to all form fields
        const allFields = [...requiredFields, ...optionalFields];
        allFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });

        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', updateProgress);
        }

        // Initial update
        updateProgress();
    }

    /**
     * Setup form validation with real-time feedback
     */
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const validateField = (field) => {
            const isValid = field.checkValidity();
            const fieldGroup = field.closest('.form-group');
            
            if (fieldGroup) {
                if (isValid && field.value.trim() !== '') {
                    fieldGroup.classList.remove('error');
                    fieldGroup.classList.add('success');
                } else if (field.value.trim() === '') {
                    fieldGroup.classList.remove('error', 'success');
                } else {
                    fieldGroup.classList.remove('success');
                    fieldGroup.classList.add('error');
                }
            }
        };

        // Add validation styles to CSS dynamically
        const validationStyles = `
            .form-group.success input,
            .form-group.success select,
            .form-group.success textarea {
                border-color: #00c851;
            }
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #ff4444;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = validationStyles;
        document.head.appendChild(styleSheet);

        // Add event listeners for real-time validation
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
            
            // Special handling for phone number field - allow only numbers and specific characters
            if (field.id === 'telefono') {
                field.addEventListener('input', (e) => {
                    // Allow only numbers, spaces, +, -, (, )
                    const value = e.target.value;
                    const sanitized = value.replace(/[^0-9\s\+\-\(\)]/g, '');
                    if (value !== sanitized) {
                        e.target.value = sanitized;
                    }
                });
            }
        });

        // Handle form submission with FormSubmit
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Always prevent default submission to handle it with JS

            // Validate all fields before allowing submission
            let isFormValid = true;
            formFields.forEach(field => {
                validateField(field);
                if (!field.checkValidity()) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Focus first invalid field
                const firstInvalid = form.querySelector('input:invalid, select:invalid, textarea:invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            // Show loading state
            const submitButton = form.querySelector('.form-cta');
            const originalText = submitButton.querySelector('span').textContent;
            
            submitButton.querySelector('span').textContent = 'Invio in corso...';
            submitButton.disabled = true; // Disable button
            submitButton.style.pointerEvents = 'none';
            submitButton.style.opacity = '0.8';

            // Prepare form data for both sessionStorage and submission
            const formData = new FormData(form);
            const formObj = {};
            for (let [key, value] of formData.entries()) {
                if (!key.startsWith('_') && key !== 'privacy') {
                    formObj[key] = value;
                }
            }
            
            try {
                sessionStorage.setItem('formData', JSON.stringify(formObj));
            } catch (error) {
                console.error('Could not save form data to sessionStorage:', error);
            }
            
            // Submit the form using fetch
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect on success
                    const redirectUrl = form.querySelector('[name="_next"]')?.value || 'thanks.html';
                    window.location.href = redirectUrl;
                } else {
                    // Handle server errors (e.g., from FormSubmit)
                    response.json().then(data => {
                        if (data.hasOwnProperty('errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('Si è verificato un errore. Riprova più tardi.');
                        }
                    }).catch(() => {
                        alert('Si è verificato un errore sconosciuto. Riprova più tardi.');
                    });
                    // Restore button state
                    submitButton.querySelector('span').textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.pointerEvents = 'auto';
                    submitButton.style.opacity = '1';
                }
            })
            .catch(error => {
                // Handle network errors
                console.error('Errore:', error);
                alert('Si è verificato un errore di rete. Controlla la tua connessione e riprova.');
                // Restore button state
                submitButton.querySelector('span').textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.pointerEvents = 'auto';
                submitButton.style.opacity = '1';
            });
        });
    }

    /**
     * Show success message inline as fallback
     */
    showInlineSuccessMessage(form) {
        const formContainer = form.closest('.contact-form-wrapper');
        const successHtml = `
            <div class="success-message-container" style="
                text-align: center;
                padding: 3rem 2rem;
                background: linear-gradient(135deg, #00c851 0%, #00a843 100%);
                border-radius: 16px;
                color: white;
                animation: slideIn 0.5s ease forwards;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Messaggio Inviato con Successo!</h3>
                <p style="margin-bottom: 2rem; opacity: 0.9;">Ti risponderemo entro 24 ore con una proposta personalizzata.</p>
                <button onclick="window.location.reload()" style="
                    background: rgba(255,255,255,0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    Invia Nuovo Messaggio
                </button>
            </div>
        `;
        
        formContainer.innerHTML = successHtml;
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        const ctaButtons = document.querySelectorAll('.hero-cta[href^="#"], .pricing-cta[href^="#"]');
        
        [...navLinks, ...ctaButtons].forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Setup button interactions and effects
     */
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.hero-cta, .pricing-cta, .form-cta');
        
        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Touch feedback for mobile
            if ('ontouchstart' in window) {
                button.addEventListener('touchstart', () => {
                    button.style.transform = 'scale(0.98)';
                }, { passive: true });
                
                button.addEventListener('touchend', () => {
                    button.style.transform = '';
                }, { passive: true });
            }
        });

        // Add ripple animation to CSS
        const rippleStyles = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = rippleStyles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Setup FAQ accordion functionality
     */
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon svg');
            
            if (!question || !answer) return;
            
            // Handle click events
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        
                        if (otherQuestion && otherAnswer) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherAnswer.classList.remove('active');
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.classList.remove('active');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('active');
                }
            });
            
            // Handle keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    /**
     * Handle responsive features
     */
    handleResponsiveFeatures() {
        // Mobile menu toggle (if needed in future)
        const handleResize = () => {
            // Add any responsive JavaScript logic here
            if (window.innerWidth <= 768) {
                // Mobile-specific logic
                this.handleMobileFeatures();
            } else {
                // Desktop-specific logic
                this.handleDesktopFeatures();
            }
        };

        window.addEventListener('resize', this.debounce(handleResize, 250));
        handleResize(); // Initial call
    }

    /**
     * Mobile-specific features
     */
    handleMobileFeatures() {
        // Add mobile-specific interactions
        console.log('Mobile features activated');
    }

    /**
     * Desktop-specific features
     */
    handleDesktopFeatures() {
        // Add desktop-specific interactions
        console.log('Desktop features activated');
    }

    /**
     * Add keyboard navigation support
     */
    addKeyboardNavigation() {
        // Focus management for better accessibility
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Add focus indicators
        focusableElements.forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.style.outline = '2px solid #000000';
                e.target.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', (e) => {
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
            });
        });

        // Escape key to close modals/overlays (if any)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Handle escape key logic
                const successMessage = document.querySelector('.success-message');
                if (successMessage) {
                    successMessage.remove();
                }
            }
        });
    }

    /**
     * Add reduced motion support
     */
    addReducedMotionSupport() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = () => {
            if (prefersReducedMotion.matches) {
                // Disable animations for users who prefer reduced motion
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                
                // Remove scroll-triggered animations
                const animateElements = document.querySelectorAll('.animate-appear');
                animateElements.forEach(element => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            }
        };

        prefersReducedMotion.addEventListener('change', handleReducedMotion);
        handleReducedMotion(); // Initial check
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Setup showcase carousel functionality
     */
    setupShowcaseCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const indicators = document.querySelectorAll('.indicator');
        const cards = document.querySelectorAll('.showcase-card');

        if (!track || !prevBtn || !nextBtn || indicators.length === 0) return;

        let currentIndex = 0;
        const totalCards = cards.length;
        const cardWidth = 380 + 30; // card width + gap
        let autoPlayInterval;

        const updateCarousel = () => {
            const translateX = -(currentIndex * cardWidth);
            track.style.transform = `translateX(${translateX}px)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = Math.max(0, Math.min(index, totalCards - 1));
            updateCarousel();
        };

        const nextSlide = () => {
            currentIndex = currentIndex >= totalCards - 1 ? 0 : currentIndex + 1;
            updateCarousel();
        };

        const prevSlide = () => {
            currentIndex = currentIndex <= 0 ? totalCards - 1 : currentIndex - 1;
            updateCarousel();
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 4000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 3000);
            });
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoPlay();
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            setTimeout(startAutoPlay, 2000);
        });

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.showcase-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Initialize
        updateCarousel();
        startAutoPlay();

        // Handle window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewStyleSite();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any expensive operations
        console.log('Page hidden - pausing animations');
    } else {
        // Page is visible, resume operations
        console.log('Page visible - resuming animations');
    }
}); 