document.addEventListener("DOMContentLoaded", () => {
    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            setTimeout(() => {
                const navLinks = document.querySelectorAll('.nav-link');
                const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

                const isHome = currentPage === '' || currentPage === 'index.html';
                const sectionMap = isHome ? {
                    '#faq-section': document.querySelector('#faq-section'),
                    '#footer': document.querySelector('#footer')
                } : {};

                navLinks.forEach(link => {
                    const href = link.getAttribute('href').toLowerCase();

                    // Add 'active' class if this is the current page (ignoring anchors)
                    if (href === currentPage || (href === 'index.html' && isHome)) {
                        link.classList.add('active');
                    }

                    // Enable smooth scroll for in-page section links (only on homepage)
                    if (isHome && href.startsWith('#')) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();

                            navLinks.forEach(l => l.classList.remove('active'));
                            this.classList.add('active');

                            const target = document.querySelector(this.getAttribute('href'));
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        });
                    }
                });

                // Scroll-based section highlighting (only on homepage)
                if (isHome) {
                    window.addEventListener('scroll', () => {
                        let found = false;

                        Object.entries(sectionMap).forEach(([hash, section]) => {
                            if (section) {
                                const rect = section.getBoundingClientRect();
                                const inView =
                                    rect.top < window.innerHeight &&
                                    rect.bottom > window.innerHeight / 2;

                                if (inView && !found) {
                                    found = true;
                                    navLinks.forEach(link => link.classList.remove('active'));

                                    const activeLink = document.querySelector(`.nav-link[href="${hash}"]`);
                                    if (activeLink) activeLink.classList.add('active');
                                }
                            }
                        });

                        if (!found) {
                            navLinks.forEach(link => link.classList.remove('active'));
                            const homeLink = document.querySelector('.nav-link[href="index.html"]');
                            if (homeLink) homeLink.classList.add('active');
                        }
                    });
                }

            }, 100);
        })
        .catch(err => console.error("Failed to load navbar:", err));
});
