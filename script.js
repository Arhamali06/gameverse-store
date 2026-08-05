const hamburgerBtn = document.getElementById('hamburger-btn');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.menu a');
    const searchToggle = document.querySelector('.search-toggle');
    const searchField = document.querySelector('.search');
    const searchInput = document.querySelector('.search input');
    const searchClear = document.querySelector('.search-clear');
    const scrollSections = document.querySelectorAll('main section[id], footer[id]');

    const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const applyTheme = (isDark) => {
    htmlEl.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
};

// default stays as-is (light) unless the user already chose dark before
const savedTheme = localStorage.getItem('gameverse-theme');
applyTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = htmlEl.classList.toggle('dark-mode');
    themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    localStorage.setItem('gameverse-theme', isDark ? 'dark' : 'light');
});

    // ============== CART STORE — shared across index.html and cart.html ==============
    const CART_STORAGE_KEY = 'gameverse-cart';

    const getCart = () => {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    };

    const cartColorPalette = ['#6b46ff', '#4648d4', '#dc2626', '#16a34a', '#0ea5e9', '#f59e0b'];

    const getInitials = (name) =>
        name
            .split(' ')
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 3)
            .join('')
            .toUpperCase();

    const getColorForName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return cartColorPalette[Math.abs(hash) % cartColorPalette.length];
    };

    // adds a product to the cart (or bumps its quantity if it's already in there)
    const addToCart = (product) => {
        const cart = getCart();
        const existing = cart.find((item) => item.name === product.name);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: product.name,
                category: product.category,
                price: product.price,
                qty: 1,
                color: getColorForName(product.name),
                initials: getInitials(product.name),
            });
        }

        saveCart(cart);
        updateCartBadge();
    };

    // updates every cart-badge on the current page (there's only one, but
    // this stays safe even if that ever changes)
    const updateCartBadge = () => {
        const badgeEls = document.querySelectorAll('.cart-badge');
        if (!badgeEls.length) return;

        const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
        badgeEls.forEach((badge) => {
            badge.textContent = totalItems;
            badge.classList.toggle('is-visible', totalItems > 0);
        });
    };

    updateCartBadge();

    // small shared helper — wires an "Add to Cart"/"Buy Now" button once
    // its card exists in the DOM, giving the same click + feedback
    // behavior everywhere it's used
    const wireAddToCartButton = (button, product) => {
        if (!button) return;
        button.addEventListener('click', () => {
            addToCart(product);

            const originalText = button.textContent;
            button.textContent = 'Added ✓';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 900);
        });
    };

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

    // only present on index.html — guarded so cart.html doesn't error
    const gamesContainer = document.querySelector('.feature-cards-container');
    if (gamesContainer) {
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

            wireAddToCartButton(gameCard.querySelector('.add-to-cart'), {
                name: game.name,
                category: game.category.replace('&bull;', '•'),
                price: parseFloat(game.price.replace('$', '')),
            });
        });
    }

    // ============== SPECIAL OFFERS — same dynamic pattern as featured games ==============
    const specialOffers = [
        {
            name: 'Cyberpunk 2077',
            description: 'A futuristic RPG set in the vibrant streets of Night City.',
            image: 'assets/images/games/cyberpunk-city-street-night-with-neon-lights-futuristic-aesthetic.jpg',
            imageClass: 'cyberpunk',
            discount: '-75% OFF',
            price: 14.99,
            originalPrice: 59.99,
        },
        {
            name: 'Amazing Spider-Man',
            description: 'Protect New York with thrilling combat and web-swinging action.',
            image: 'assets/images/games/marvels-spider-man-2.jpg',
            imageClass: '',
            discount: '-50% OFF',
            price: 24.99,
            originalPrice: 49.99,
        },
    ];

    // only present on index.html — guarded so cart.html doesn't error
    const specialOffersContainer = document.querySelector('.special-offers-container');
    if (specialOffersContainer) {
        specialOffers.forEach((offer) => {
            const offerCard = document.createElement('article');
            offerCard.classList.add('special-offer-card');
            offerCard.innerHTML = `
                <img class="special-offer-card-image ${offer.imageClass}" src="${offer.image}" alt="${offer.name}">
                <div class="special-offer-card-details">
                    <span class="discount-badge">${offer.discount}</span>
                    <h3>${offer.name}</h3>
                    <p>${offer.description}</p>
                    <div class="offer-prices">
                        <span class="offer-price">$${offer.price.toFixed(2)}</span>
                        <del class="original-price">$${offer.originalPrice.toFixed(2)}</del>
                    </div>
                    <button class="buy-now" type="button">Buy Now</button>
                </div>
            `;
            specialOffersContainer.appendChild(offerCard);

            wireAddToCartButton(offerCard.querySelector('.buy-now'), {
                name: offer.name,
                category: `Special Offer • ${offer.discount}`,
                price: offer.price,
            });
        });
    }

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
            searchToggle.classList.remove('is-open');
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

    if (searchInput && searchClear) {
        searchInput.addEventListener('input', () => {
            searchClear.classList.toggle('is-visible', searchInput.value.length > 0);
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.classList.remove('is-visible');
            searchInput.focus();
        });
    }

      // Toggle menu open/close
    hamburgerBtn.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

      // Close menu when a link is clicked (nav links only — the cart icon
      // is a real link now and isn't part of .menu, so it isn't affected)
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

    // only force "Home" active on the homepage — on cart.html the nav
    // links point elsewhere and shouldn't be marked active on load
    if (document.getElementById('hero')) {
        setActiveLink(navLinks[0]);
    }

    // badge should reflect the latest cart state whenever the page is
    // shown, including when navigating back via the browser's back button
    updateCartBadge();
});

// queried here (after featured games AND special offers have already
// been inserted into the DOM above) so both dynamic sections actually
// get picked up for the fade-in effect — querying this earlier, before
// those cards existed, was why they weren't animating before
const revealTargets = document.querySelectorAll(
    '.category-header, .category-cards .card, .feature-head, .feature-cards-container .feature-card, .offer-head, .special-offers-container .special-offer-card, .newsletter-container, .footer-container, .footer-bottom'
);

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

    // ============== CART PAGE — only runs on cart.html ==============
    const cartItemsEl = document.getElementById('cart-items');

    if (cartItemsEl) {
        const cartEmptyEl = document.getElementById('cart-empty');
        const cartLayoutEl = document.querySelector('.cart-layout');
        const cartCountText = document.getElementById('cart-count-text');
        const subtotalEl = document.getElementById('summary-subtotal');
        const discountEl = document.getElementById('summary-discount');
        const totalEl = document.getElementById('summary-total');
        const promoInput = document.getElementById('promo-input');
        const promoApply = document.getElementById('promo-apply');

        let discountRate = 0;

        const formatMoney = (n) => `$${n.toFixed(2)}`;

        function renderCart() {
            const cartData = getCart(); // always read the latest saved state
            cartItemsEl.innerHTML = '';

            if (cartData.length === 0) {
                cartLayoutEl.style.display = 'none';
                cartEmptyEl.classList.add('is-visible');
                cartCountText.textContent = 'Your cart is empty';
                updateSummary(cartData);
                return;
            }

            cartLayoutEl.style.display = 'grid';
            cartEmptyEl.classList.remove('is-visible');

            const totalItems = cartData.reduce((sum, item) => sum + item.qty, 0);
            cartCountText.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;

            cartData.forEach((item) => {
                const lineTotal = item.price * item.qty;

                const card = document.createElement('article');
                card.className = 'cart-item';
                card.dataset.id = item.id;
                card.innerHTML = `
                    <div class="cart-item-thumb" style="background:${item.color}">${item.initials}</div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>${item.category}</p>
                        <div class="cart-item-controls">
                            <div class="qty-stepper">
                                <button class="qty-btn qty-decrease" type="button" aria-label="Decrease quantity" ${item.qty <= 1 ? 'disabled' : ''}>&minus;</button>
                                <span class="qty-value">${item.qty}</span>
                                <button class="qty-btn qty-increase" type="button" aria-label="Increase quantity">+</button>
                            </div>
                            <button class="remove-btn" type="button" aria-label="Remove ${item.name}">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-price-col">
                        <span class="cart-item-price">${formatMoney(item.price)}</span>
                        <span class="cart-item-line-total">${formatMoney(lineTotal)} total</span>
                    </div>
                `;
                cartItemsEl.appendChild(card);
            });

            updateSummary(cartData);
        }

        function updateSummary(cartData) {
            const subtotal = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);
            const discount = subtotal * discountRate;
            const total = subtotal - discount;

            subtotalEl.textContent = formatMoney(subtotal);
            discountEl.textContent = `-${formatMoney(discount)}`;
            totalEl.textContent = formatMoney(total);
        }

        cartItemsEl.addEventListener('click', (event) => {
            const card = event.target.closest('.cart-item');
            if (!card) return;

            const id = card.dataset.id;
            const cartData = getCart();
            const item = cartData.find((i) => i.id === id);
            if (!item) return;

            if (event.target.closest('.qty-increase')) {
                item.qty += 1;
                saveCart(cartData);
                updateCartBadge();
                renderCart();
            } else if (event.target.closest('.qty-decrease')) {
                if (item.qty > 1) {
                    item.qty -= 1;
                    saveCart(cartData);
                    updateCartBadge();
                    renderCart();
                }
            } else if (event.target.closest('.remove-btn')) {
                card.classList.add('removing');
                setTimeout(() => {
                    const updatedCart = getCart().filter((i) => i.id !== id);
                    saveCart(updatedCart);
                    updateCartBadge();
                    renderCart();
                }, 200);
            }
        });

        if (promoApply && promoInput) {
            promoApply.addEventListener('click', () => {
                const code = promoInput.value.trim().toUpperCase();
                discountRate = code === 'GAMEVERSE10' ? 0.1 : 0;
                updateSummary(getCart());
            });
        }

        renderCart();
    }