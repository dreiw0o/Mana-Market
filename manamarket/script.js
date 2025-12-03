document.addEventListener('DOMContentLoaded', () => {

    // --- CART SYSTEM LOGIC ---
    
    // 1. Initialize Cart
    let cart = JSON.parse(localStorage.getItem('manaCart')) || [];
    updateCartCount();

    // 2. Add to Cart Function
    window.addToCart = function(name, price, image) {
        // Find if item already exists
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            alert(`${name} is already in your cart.`);
            return;
        }

        cart.push({ name, price, image });
        localStorage.setItem('manaCart', JSON.stringify(cart));
        updateCartCount();
        alert(`${name} added to cart!`);
    };

    // 3. Remove from Cart Function
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('manaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart(); // Re-render the cart page
    };

    // 4. Update Cart Count in Nav Bar
    function updateCartCount() {
        const countEl = document.getElementById('cartCount');
        if (countEl) countEl.textContent = cart.length;
    }

    // 5. Render Cart Page
    function renderCart() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotalEl = document.getElementById('cartTotal');
        
        if (!cartContent) return; // Not on cart page

        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart-msg epunda-slab-font">Your cart is empty.</p>';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            let html = '<table class="cart-table epunda-slab-font"><thead><tr><th>Product</th><th>Price</th><th>Action</th></tr></thead><tbody>';
            let total = 0;

            cart.forEach((item, index) => {
                html += `
                    <tr>
                        <td style="display:flex; align-items:center; gap:10px;">
                            <img src="${item.image}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;">
                            ${item.name}
                        </td>
                        <td>$${parseFloat(item.price).toFixed(2)}</td>
                        <td><button class="remove-btn" onclick="removeFromCart(${index})">Remove</button></td>
                    </tr>
                `;
                total += parseFloat(item.price);
            });

            html += '</tbody></table>';
            cartContent.innerHTML = html;
            if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
            if (cartFooter) cartFooter.style.display = 'block';
        }
    }

    // Run render if on cart page
    renderCart();

    // 6. Checkout Logic - UPDATED TO REDIRECT TO purchase_success.html
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                 // Using an alert for quick feedback instead of a custom modal UI
                 alert("Cannot check out, your cart is empty!"); 
                 return;
            }
            
            // Calculate total for display on the success page
            let total = 0;
            cart.forEach(item => {
                total += parseFloat(item.price);
            });
            const cartTotal = total.toFixed(2);
            
            // Clear cart
            cart = []; 
            localStorage.setItem('manaCart', JSON.stringify(cart));
            updateCartCount();
            renderCart();

            // Redirect to the new success page, passing the total spent
            window.location.href = `purchase_success.html?total=${cartTotal}`;
        });
    }

    // --- PRODUCT PAGE LOGIC (product.html) ---
    const productCard = document.getElementById('productCard');
    if (productCard) {
        function qs(key) {
            const params = new URLSearchParams(window.location.search);
            return params.get(key);
        }

        const product = qs('product') || 'Unknown Product';
        const price = qs('price') || '0.00';

        const nameEl = document.getElementById('productName');
        const priceEl = document.getElementById('productPrice');
        const imgEl = document.getElementById('productImg');
        const descEl = document.getElementById('productDesc');
        const addBtn = document.getElementById('addToCartBtn');

        // Game Descriptions Data
        const descriptions = {
            'Hades': 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.',
            'Hades 2': 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler.',
            'Terraria': 'Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. Four Pack also available!',
            'Dinkum': 'Dinkum is a survival life simulation game set on an island inspired by the rugged Australian outback. Farm, hunt, mine, fish, and forage to gather resources, expand your town, and discover what makes Dinkum so special—either solo or with friends.'
        };

        const images = {
            'Hades': 'Hades.jpg',
            'Hades 2': 'Hades-2.jpg',
            'Dinkum': 'Dinkum.png',
            'Terraria': 'Terraria.jpg' 
        };

        if (nameEl) nameEl.textContent = product;
        if (priceEl) priceEl.textContent = '$' + price;
        if (descEl) descEl.textContent = descriptions[product] || 'No description available.';

        const imgFile = images[product];
        if (imgFile && imgEl) {
            imgEl.src = imgFile;
            imgEl.style.display = 'block';
        }

        // Handle Add to Cart Click on Product Page
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                addToCart(product, price, imgFile);
            });
        }
    }


    // --- SESSION & NAV BAR LOGIC ---
    const LOGGED_IN_EMAIL_KEY = 'loggedInUserEmail';
    const navBar = document.querySelector('.topnav');
    const signupLink = navBar ? navBar.querySelector('a[href="signup.html"]') : null;
    const loginLink = navBar ? navBar.querySelector('a[href="login.html"]') : null;
    let emailDisplay = document.getElementById('userEmailDisplay');
    let logoutLink = document.getElementById('logoutBtn');

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem(LOGGED_IN_EMAIL_KEY); 
            window.location.href = 'index.html'; 
        });
    }

    function updateNavBarState() {
        const email = localStorage.getItem(LOGGED_IN_EMAIL_KEY);
        if (email) {
            if (signupLink) signupLink.style.display = 'none';
            if (loginLink) loginLink.style.display = 'none';
            if (emailDisplay) {
                emailDisplay.textContent = email;
                emailDisplay.style.display = 'block';
            }
            if (logoutLink) logoutLink.style.display = 'block';
        } else {
            if (signupLink) signupLink.style.display = 'block';
            if (loginLink) loginLink.style.display = 'block';
            if (emailDisplay) emailDisplay.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    }
    updateNavBarState();

    // --- UTILITIES (Scroll, Music, Contact) ---
    // Scroll Link Smoothing
    document.querySelectorAll('.topnav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href') || '';
            if (href.startsWith('#')) {
                e.preventDefault();
                const id = href.slice(1);
                const target = document.getElementById(id);
                if (target) {
                    const offset = 60;
                    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll Top Button
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        // Set the text content explicitly
        scrollBtn.textContent = 'Scroll To Top';
        
        const toggleScrollBtn = () => {
            scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
        };
        window.addEventListener('scroll', toggleScrollBtn);
        toggleScrollBtn();
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Music Toggle (Updated for continuity)
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');

    if (bgMusic && musicToggleBtn) {
        
        // Load state from previous page
        const savedTime = localStorage.getItem('musicTime');
        const savedMuted = localStorage.getItem('musicMuted');

        // Restore time if metadata is loaded
        if (savedTime !== null && !isNaN(parseFloat(savedTime))) {
             bgMusic.addEventListener('loadedmetadata', () => {
                 bgMusic.currentTime = parseFloat(savedTime);
             }, { once: true });
        }
        
        bgMusic.volume = 0.3;
        bgMusic.muted = savedMuted === 'true';

        // Save state before page unloads
        const saveMusicState = () => {
            localStorage.setItem('musicTime', bgMusic.currentTime);
            localStorage.setItem('musicMuted', bgMusic.muted);
        };
        // Use pagehide for better cross-browser compatibility when navigating
        window.addEventListener('pagehide', saveMusicState);


        // Update button text
        const updateBtn = () => {
            musicToggleBtn.textContent = bgMusic.muted ? 'Music OFF' : 'Music ON';
            if(bgMusic.muted) musicToggleBtn.classList.add('muted');
            else musicToggleBtn.classList.remove('muted');
        };
        updateBtn();

        // Autoplay attempt (requires user interaction in most browsers)
        const tryPlay = () => {
             // Only try to play if it's currently paused
             if (bgMusic.paused) {
                 bgMusic.play().catch(() => {});
             }
        };
        
        tryPlay(); // Initial attempt
        // Play on first user interaction (reliable way to start media)
        document.addEventListener('click', tryPlay, { once: true });


        musicToggleBtn.addEventListener('click', () => {
            bgMusic.muted = !bgMusic.muted;
            localStorage.setItem('musicMuted', bgMusic.muted);
            updateBtn();
            // If unmuted, try to play if paused
            if (!bgMusic.muted && bgMusic.paused) {
                tryPlay();
            }
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const thankYouMsg = document.getElementById('thankYouMsg');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            // Using an alert for quick feedback instead of a custom modal UI
            alert("Thanks for contacting me! I’ll get back to you in five minutes.");
            contactForm.style.display = 'none';
            if (thankYouMsg) thankYouMsg.style.display = 'block';
        });
    }
});