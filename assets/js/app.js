document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('hostingCart')) || [];
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = JSON.parse(this.getAttribute('data-product'));
            cart.push(product);
            localStorage.setItem('hostingCart', JSON.stringify(cart));
            updateCartCount();
            
            // Show success message
            alert(`${product.name} telah ditambahkan ke keranjang!`);
        });
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
            const monthlyPrices = [75000, 120000, 200000]; // Example RDP prices
            
            if (this.checked) {
                // Switch to annual pricing (20% discount)
                prices.forEach(price => {
                    if (price.classList.contains('period')) {
                        price.textContent = '/tahun';
                    }
                });
                
                // Update prices with discount
                document.querySelectorAll('.pricing-card').forEach((card, index) => {
                    const priceElement = card.querySelector('.price');
                    const originalPrice = monthlyPrices[index];
                    const annualPrice = originalPrice * 12 * 0.8; // 20% discount
                    
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
            } else {
                // Switch back to monthly pricing
                prices.forEach(price => {
                    if (price.classList.contains('period')) {
                        price.textContent = '/bulan';
                    }
                });
                
                // Revert to original prices
                document.querySelectorAll('.pricing-card').forEach((card, index) => {
                    const priceElement = card.querySelector('.price');
                    const originalPrice = monthlyPrices[index];
                    
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
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Set first tab as active by default
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
});