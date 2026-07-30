    const hamburgerBtn = document.getElementById('hamburger-btn');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.menu a');
    const revealTargets = document.querySelectorAll(
        '.category-header, .category-cards .card, .feature-head, .feature-cards-container .feature-card, .offer-head, .special-offers-container .special-offer-card, .newsletter-container, .footer-container, .footer-bottom'
    );
    const scrollSections = document.querySelectorAll('main section[id], footer[id]');

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle('active', isActive);
        if (isActive) {
        link.setAttribute('aria-current', 'page');
        } else {
        link.removeAttribute('aria-current');
        }
    });
    };

      // Toggle menu open/close
    hamburgerBtn.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

      // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
    setActiveLink(link);
    header.classList.remove('menu-open');
        });
    });

window.addEventListener('pageshow', () => {
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.scrollTo(0, 0);
    setActiveLink(navLinks[0]);
});

const enableScrollReveal = () => {
    if (!revealTargets.length) {
        return;
    }

    revealTargets.forEach((element, index) => {
        element.classList.add('scroll-reveal');

        if (
            element.classList.contains('card') ||
            element.classList.contains('feature-card') ||
            element.classList.contains('special-offer-card')
        ) {
            element.style.setProperty('--reveal-delay', `${Math.min(index * 45, 180)}ms`);
        }
    });

    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.05, rootMargin: '0px 0px -18% 0px' }
    );

    revealTargets.forEach((element) => observer.observe(element));
};

enableScrollReveal();

const enableSectionTracking = () => {
    const linkBySectionId = new Map(
        Array.from(navLinks).map((link) => [link.getAttribute('href')?.slice(1), link])
    );

    const activateSection = (sectionId) => {
        const link = linkBySectionId.get(sectionId);

        if (link) {
            setActiveLink(link);
        }
    };

    if (!('IntersectionObserver' in window) || !scrollSections.length) {
        activateSection('hero');
        return;
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

            if (visibleEntries.length) {
                activateSection(visibleEntries[0].target.id);
            }
        },
        {
            threshold: [0.1, 0.25, 0.5],
            rootMargin: '-12% 0px -55% 0px',
        }
    );

    scrollSections.forEach((section) => sectionObserver.observe(section));
    activateSection('hero');
};

enableSectionTracking();

      // Close menu on resize if viewport becomes desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
    header.classList.remove('menu-open');
        }
    });
