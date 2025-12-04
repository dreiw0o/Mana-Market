document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('manaCart')) || [];
    updateCartCount();

    window.addToCart = function(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        showToast(`${name} is already in your cart.`, 'error');
        return;
    }

    cart.push({ name, price, image });
    localStorage.setItem('manaCart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} added to cart!`, 'success');
};

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('manaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    function updateCartCount() {
        const countEl = document.getElementById('cartCount');
        if (countEl) countEl.textContent = cart.length;
    }

    function renderCart() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotalEl = document.getElementById('cartTotal');
        
        if (!cartContent) return; 

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

    renderCart();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                 showToast("Cannot check out, your cart is empty!", 'error');
                 return;
            }
            
            let total = 0;
            cart.forEach(item => {
                total += parseFloat(item.price);
            });
            const cartTotal = total.toFixed(2);
            
            cart = []; 
            localStorage.setItem('manaCart', JSON.stringify(cart));
            updateCartCount();
            renderCart();

            window.location.href = `purchase.html?total=${cartTotal}`;
        });
    }

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

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                addToCart(product, price, imgFile);
            });
        }
    }

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

    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        scrollBtn.textContent = 'Scroll To Top';
        
        const toggleScrollBtn = () => {
            scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
        };
        window.addEventListener('scroll', toggleScrollBtn);
        toggleScrollBtn();
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');

    if (bgMusic && musicToggleBtn) {
        
        const savedTime = localStorage.getItem('musicTime');
        const savedMuted = localStorage.getItem('musicMuted');

        if (savedTime !== null && !isNaN(parseFloat(savedTime))) {
             bgMusic.addEventListener('loadedmetadata', () => {
                 bgMusic.currentTime = parseFloat(savedTime);
             }, { once: true });
        }
        
        bgMusic.volume = 0.3;
        bgMusic.muted = savedMuted === 'true';

        const saveMusicState = () => {
            localStorage.setItem('musicTime', bgMusic.currentTime);
            localStorage.setItem('musicMuted', bgMusic.muted);
        };
        window.addEventListener('pagehide', saveMusicState);


        const updateBtn = () => {
            musicToggleBtn.textContent = bgMusic.muted ? 'Music OFF' : 'Music ON';
            if(bgMusic.muted) musicToggleBtn.classList.add('muted');
            else musicToggleBtn.classList.remove('muted');
        };
        updateBtn();

        const tryPlay = () => {
             if (bgMusic.paused) {
                 bgMusic.play().catch(() => {});
             }
        };
        
        tryPlay();
        document.addEventListener('click', tryPlay, { once: true });


        musicToggleBtn.addEventListener('click', () => {
            bgMusic.muted = !bgMusic.muted;
            localStorage.setItem('musicMuted', bgMusic.muted);
            updateBtn();
            if (!bgMusic.muted && bgMusic.paused) {
                tryPlay();
            }
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    const thankYouMsg = document.getElementById('thankYouMsg');
    
    if (contactForm && typeof showToast === 'function') {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const form = e.target;
            const formData = new FormData(form);

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch('submit_contact.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showToast(result.message, 'success');
                    form.style.display = 'none';
                    if (thankYouMsg) {
                        thankYouMsg.textContent = result.message; 
                        thankYouMsg.style.display = 'block';
                    }
                } else {
                    showToast(`Submission failed: ${result.message}`, 'error');
                }
            } catch (error) {
                console.error('Submission failed:', error);
                showToast('An unexpected error occurred. Please check your XAMPP server.', 'error');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.warn('Toast container not found, falling back to console log: ' + message);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast epunda-slab-font ${type}`; 
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out'); 
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 3000); 
    }
});