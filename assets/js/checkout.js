document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    const cart = JSON.parse(localStorage.getItem('hostingCart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    let subtotal = 0;
    
    // Render order items
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>${formatCurrency(item.price)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
        subtotal += item.price;
    });
    
    // Update totals
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('total').textContent = formatCurrency(subtotal);
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Promo code handling
    document.querySelector('.promo-code button').addEventListener('click', applyPromoCode);
    
    // Form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const orderData = {
            customer: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                domain: document.getElementById('domain').value
            },
            paymentMethod: document.querySelector('.payment-method.selected span').textContent,
            items: cart,
            subtotal: subtotal,
            discount: parseFloat(document.getElementById('discount').textContent.replace(/[^\d]/g, '')) || 0,
            total: parseFloat(document.getElementById('total').textContent.replace(/[^\d]/g, ''))
        };
        
        // Here you would typically send this data to your server
        console.log('Order data:', orderData);
        
        // For demo purposes, we'll just show a success message
        alert('Pesanan berhasil! Anda akan diarahkan ke halaman pembayaran.');
        
        // Clear cart
        localStorage.removeItem('hostingCart');
        window.location.href = 'index.html';
    });
});

function applyPromoCode() {
    const promoCode = document.getElementById('promo').value;
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace(/[^\d]/g, ''));
    
    // In a real app, you would validate this with your server
    const validPromos = {
        'DISKON10': 0.1,
        'HOSTING20': 0.2
    };
    
    if (validPromos[promoCode]) {
        const discount = subtotal * validPromos[promoCode];
        document.getElementById('discount').textContent = formatCurrency(discount);
        document.getElementById('total').textContent = formatCurrency(subtotal - discount);
        alert('Kode promo berhasil digunakan!');
    } else {
        alert('Kode promo tidak valid');
    }
}

function formatCurrency(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}