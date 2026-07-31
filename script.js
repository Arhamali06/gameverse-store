    const hamburgerBtn = document.getElementById('hamburger-btn');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.menu a');
    const searchToggle = document.querySelector('.search-toggle');
    const searchField = document.querySelector('.search');
    const searchInput = document.querySelector('.search input');
    const revealTargets = document.querySelectorAll(
        '.category-header, .category-cards .card, .feature-head, .feature-cards-container .feature-card, .offer-head, .special-offers-container .special-offer-card, .newsletter-container, .footer-container, .footer-bottom'
    );
    const scrollSections = document.querySelectorAll('main section[id], footer[id]');

    const featuredGames = [
        {
            name: 'GTA V',
            price: '$69.99',
            category: 'Action &bull; Adventure',
            image: 'assets/images/games/gtav.jpg',
            topRated: true
        },
        {
            name: 'Tekken 8',
            price: '$59.99',
            category: 'Action &bull; Multiplayer',
            image: 'assets/images/games/tekken%208.jpg'
        },
        {
            name: 'Black Myth Wukong',
            price: '$89.99',
            category: 'RPG &bull; Adventure',
            image: 'assets/images/games/black%20myth.jpg'
        },
        {
            name: "Assassin's Creed",
            price: '$29.99',
            category: 'OpenWorld &bull; Adventure',
            image: 'assets/images/games/assasians%20creed.jpg'
        },
        {
            name: "Forza Horizon 5",
            price: '$59.99',
            category: 'Racing &bull; Adventure',
            image: 'assets/images/games/forza-horizon.jpg'
        },
        {
            name: "Mortal Kombat 11",
            price: '$99.99',
            category: 'Fighting &bull; Multiplayer',
            image: 'assets/images/games/mortal-combat11.jpg'
        },
        {
            name: "FIFA 26",
            price: '$49.99',
            category: 'Football &bull; Multiplayer',
            image: 'assets/images/games/fifa-26.jpg'
        },
        {
            name: "God of War Ragnarok",
            price: '$89.99',
            category: 'Fighting &bull; Action',
            image: 'assets/images/games/god-of-war.jpg'
        }
    ];

    const gamesContainer = document.querySelector('.feature-cards-container');
    featuredGames.forEach((game) => {
        const gameCard = document.createElement('article');
        gameCard.classList.add('feature-card');
        gameCard.innerHTML = `
            <img class="feature-card-image" src="${game.image}" alt="${game.name}">
            ${game.topRated ? '<span class="top-rated">Top Rated</span>' : ''}
            <div class="feature-card-details">
                <div class="feature-card-title-row">
                    <h3>${game.name}</h3>
                    <span class="game-price">${game.price}</span>
                </div>
                <p class="game-category">${game.category}</p>
                <button class="add-to-cart" type="button">Add to Cart</button>
            </div>
        `;
        gamesContainer.appendChild(gameCard);
    });


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

    const closeSearch = () => {
        if (searchField) {
            searchField.classList.remove('is-open');
        }

        if (searchToggle) {
    
            searchToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (searchToggle && searchField && searchInput) {
        searchToggle.addEventListener('click', () => {
            const isOpen = searchField.classList.toggle('is-open');
            searchToggle.classList.toggle('is-open', isOpen);
            searchToggle.setAttribute('aria-expanded', String(isOpen));

            if (isOpen) {
                searchInput.focus();
            } else {
                searchInput.blur();
            }
        });

        document.addEventListener('click', (event) => {
            if (!searchField.contains(event.target) && !searchToggle.contains(event.target)) {
                closeSearch();
            }
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSearch();
            }
        });
    }

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
