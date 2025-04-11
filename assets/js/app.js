document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('hostingCart')) || [];
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = cartIcon.querySelector('.cart-dropdown');

    // Toggle cart dropdown
    function toggleCartDropdown() {
        if (cartDropdown.style.display === 'block') {
            cartDropdown.style.display = 'none';
        } else {
            cartDropdown.style.display = 'block';
        }
    }

    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartIcon.contains(e.target)) {
            cartDropdown.style.display = 'none';
        }
    });

    // Update cart UI
    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartCountDropdown = document.getElementById('cart-count-dropdown');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        
        if (cartCountDropdown) {
            cartCountDropdown.textContent = cart.length === 1 ? '1 item' : `${cart.length} items`;
        }
        
        // Update cart items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-message">Keranjang belanja kosong</div>';
            } else {
                let total = 0;
                
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    
                    // Determine icon based on product type
                    let itemIcon = 'fa-server'; // Default for RDP
                    if (item.type === 'game') itemIcon = 'fa-gamepad';
                    if (item.type === 'bot') itemIcon = 'fa-robot';
                    
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <i class="fas ${itemIcon}"></i>
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-period">${item.period === 'yearly' ? 'Tahunan' : 'Bulanan'}</div>
                            <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        </div>
                        <div class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
                    
                    cartItemsContainer.appendChild(cartItem);
                    total += item.price;
                    
                    // Add event listener to remove button
                    const removeBtn = cartItem.querySelector('.cart-item-remove');
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        removeFromCart(index);
                    });
                });
                
                // Update total price
                if (cartTotalPrice) {
                    cartTotalPrice.textContent = formatCurrency(total);
                }
            }
        }
    }

    // Add to cart function
    function addToCart(product) {
        cart.push(product);
        saveCart();
        updateCartUI();
        
        // Show success message
        const successMsg = `${product.name} telah ditambahkan ke keranjang!`;
        showToast(successMsg);
        
        // Show cart dropdown
        cartDropdown.style.display = 'block';
    }

    // Remove from cart function
    function removeFromCart(index) {
        const removedItem = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        
        // Show removed message
        showToast(`${removedItem} dihapus dari keranjang`);
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('hostingCart', JSON.stringify(cart));
    }

    // Format currency
    function formatCurrency(amount) {
        return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Initialize cart on page load
    updateCartUI();
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = JSON.parse(this.getAttribute('data-product'));
            addToCart(product);
        });
    });
    
    // Make cart icon clickable
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCartDropdown();
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-pricing`).classList.add('active');
        });
    });
    
    // Billing toggle functionality
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const prices = document.querySelectorAll('.price .currency, .price .period');
            const monthlyPrices = {
                'rdp': [75000, 120000, 200000],
                'game': [50000, 100000, 180000],
                'bot': [30000, 60000, 100000]
            };
            
            if (this.checked) {
                // Switch to annual pricing (20% discount)
                prices.forEach(price => {
                    if (price.classList.contains('period')) {
                        price.textContent = '/tahun';
                    }
                });
                
                // Update prices with discount for each tab
                document.querySelectorAll('.tab-content').forEach(tab => {
                    const tabId = tab.id.split('-')[0];
                    const tabPrices = monthlyPrices[tabId];
                    
                    if (tabPrices) {
                        tab.querySelectorAll('.pricing-card').forEach((card, index) => {
                            const priceElement = card.querySelector('.price');
                            const originalPrice = tabPrices[index];
                            const annualPrice = Math.round(originalPrice * 12 * 0.8); // 20% discount
                            
                            priceElement.innerHTML = `
                                <span class="currency">Rp</span>${annualPrice.toLocaleString('id-ID')}
                                <span class="period">/tahun</span>
                            `;
                            
                            // Update add to cart button
                            const addToCartBtn = card.querySelector('.add-to-cart');
                            if (addToCartBtn) {
                                const productData = JSON.parse(addToCartBtn.getAttribute('data-product'));
                                productData.price = annualPrice;
                                productData.period = 'yearly';
                                addToCartBtn.setAttribute('data-product', JSON.stringify(productData));
                            }
                        });
                    }
                });
            } else {
                // Switch back to monthly pricing
                prices.forEach(price => {
                    if (price.classList.contains('period')) {
                        price.textContent = '/bulan';
                    }
                });
                
                // Revert to original prices for each tab
                document.querySelectorAll('.tab-content').forEach(tab => {
                    const tabId = tab.id.split('-')[0];
                    const tabPrices = monthlyPrices[tabId];
                    
                    if (tabPrices) {
                        tab.querySelectorAll('.pricing-card').forEach((card, index) => {
                            const priceElement = card.querySelector('.price');
                            const originalPrice = tabPrices[index];
                            
                            priceElement.innerHTML = `
                                <span class="currency">Rp</span>${originalPrice.toLocaleString('id-ID')}
                                <span class="period">/bulan</span>
                            `;
                            
                            // Update add to cart button
                            const addToCartBtn = card.querySelector('.add-to-cart');
                            if (addToCartBtn) {
                                const productData = JSON.parse(addToCartBtn.getAttribute('data-product'));
                                productData.price = originalPrice;
                                productData.period = 'monthly';
                                addToCartBtn.setAttribute('data-product', JSON.stringify(productData));
                            }
                        });
                    }
                });
            }
        });
    }
    
    // FAQ Toggle Functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
        });
    });
    
    // Set first tab as active by default
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
});