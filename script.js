  // Theme toggle
        const themeSwitch = document.getElementById('theme-switch');
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || 'dark';
        if (initialTheme === 'dark') document.body.classList.add('dark-theme');

        themeSwitch.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });

        // Mobile nav toggle
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        const navA = document.querySelectorAll('.nav-links a');
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navA.forEach(a => a.classList.remove('active'));
                    const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => navObserver.observe(s));

        // Scroll reveal
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach((el, i) => {
            el.style.transitionDelay = `${(i % 3) * 80}ms`;
            revealObserver.observe(el);
        });

        // FAQ accordion
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item.open').forEach(openItem => {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                        openItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });
                item.classList.toggle('open');
                answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
            });
        });

        // Contact form submit (AJAX via Web3Forms so the page never navigates away)
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            try {
                const formData = new FormData(contactForm);
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                const result = await res.json();
                if (result.success) {
                    formStatus.textContent = "Thanks — we'll get back to you within one business day.";
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                formStatus.textContent = 'Something went wrong. Please email us directly at weblixdotio@gmail.com.';
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });

                window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };