/**
 * Aura AI — Interactive Front-End Logic
 * Author: Senior Front-End Developer
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. DOM Elements Selection
    // -------------------------------------------------------------------------
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('submit-btn');
    const currentYearSpan = document.getElementById('current-year');

    // -------------------------------------------------------------------------
    // 2. Dynamic Year in Footer
    // -------------------------------------------------------------------------
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // -------------------------------------------------------------------------
    // 3. Mobile Navigation Menu Toggle
    // -------------------------------------------------------------------------
    if (mobileToggle && mainNav) {
        const toggleMenu = (isOpen) => {
            const shouldOpen = isOpen !== undefined ? isOpen : !mainNav.classList.contains('open');
            mainNav.classList.toggle('open', shouldOpen);
            mobileToggle.classList.toggle('active', shouldOpen);
            mobileToggle.setAttribute('aria-expanded', shouldOpen.toString());
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        };

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    toggleMenu(false);
                }
            });
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // -------------------------------------------------------------------------
    // 4. Header Shadow on Scroll
    // -------------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(10, 11, 16, 0.92)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.backgroundColor = 'rgba(10, 11, 16, 0.75)';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });

    // -------------------------------------------------------------------------
    // 5. Active Link Highlight (Intersection Observer)
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href').replace('#', '');
                        if (href === currentId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // -------------------------------------------------------------------------
    // 6. Contact Form Validation & Submission
    // -------------------------------------------------------------------------
    if (contactForm) {
        const nameInput = document.getElementById('user-name');
        const emailInput = document.getElementById('user-email');
        const messageInput = document.getElementById('user-message');

        const groupName = document.getElementById('group-name');
        const groupEmail = document.getElementById('group-email');
        const groupMessage = document.getElementById('group-message');

        // Regex for Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Field Validation Helpers
        const validateField = (input, group, condition) => {
            if (!condition) {
                group.classList.add('has-error');
                input.setAttribute('aria-invalid', 'true');
                return false;
            } else {
                group.classList.remove('has-error');
                input.removeAttribute('aria-invalid');
                return true;
            }
        };

        // Real-time input error removal on typing
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length >= 2) {
                groupName.classList.remove('has-error');
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailRegex.test(emailInput.value.trim())) {
                groupEmail.classList.remove('has-error');
            }
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim().length >= 10) {
                groupMessage.classList.remove('has-error');
            }
        });

        // Form Submit Handler
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous alert
            formAlert.style.display = 'none';
            formAlert.className = 'form-alert';
            formAlert.textContent = '';

            const isNameValid = validateField(
                nameInput, 
                groupName, 
                nameInput.value.trim().length >= 2
            );

            const isEmailValid = validateField(
                emailInput, 
                groupEmail, 
                emailRegex.test(emailInput.value.trim())
            );

            const isMessageValid = validateField(
                messageInput, 
                groupMessage, 
                messageInput.value.trim().length >= 10
            );

            // Focus on first invalid field
            if (!isNameValid) {
                nameInput.focus();
                return;
            }
            if (!isEmailValid) {
                emailInput.focus();
                return;
            }
            if (!isMessageValid) {
                messageInput.focus();
                return;
            }

            // Simulate form submission (e.g., API call)
            submitBtn.classList.add('loading');
            submitBtn.querySelector('.btn-text').textContent = 'იგზავნება...';

            try {
                // Simulate network latency (1.2s)
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Success Message
                formAlert.className = 'form-alert success';
                formAlert.textContent = '✓ მადლობა! თქვენი შეტყობინება წარმატებით გაიგზავნა. ჩვენი გუნდი მალე დაგიკავშირდებათ.';
                formAlert.style.display = 'block';

                // Reset form inputs
                contactForm.reset();

                // Auto-dismiss alert after 6 seconds
                setTimeout(() => {
                    formAlert.style.display = 'none';
                }, 6000);

            } catch (err) {
                // Error Fallback
                formAlert.className = 'form-alert error';
                formAlert.textContent = 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით.';
                formAlert.style.display = 'block';
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('.btn-text').textContent = 'შეტყობინების გაგზავნა';
            }
        });
    }
});
