document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    const cart = JSON.parse(localStorage.getItem('hostingCart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    let subtotal = 0;
    
    // Render order items
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <span>${item.name} (${item.period === 'yearly' ? 'Tahunan' : 'Bulanan'})</span>
                <span>${formatCurrency(item.price)}</span>
            `;
            orderItemsContainer.appendChild(itemElement);
            subtotal += item.price;
        });
    }
    
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
            
            // Update selected payment display
            const paymentImg = this.querySelector('img').cloneNode(true);
            const paymentText = this.querySelector('span').textContent;
            
            const selectedPayment = document.getElementById('selected-payment');
            selectedPayment.innerHTML = '';
            selectedPayment.appendChild(paymentImg);
            selectedPayment.innerHTML += `<span>${paymentText}</span>`;
            
            // Update payment instruction
            const instruction = document.querySelector('.payment-instruction');
            if (paymentText.includes('BCA')) {
                instruction.textContent = 'Silakan transfer ke rekening BCA 1234567890 a.n. HostZone';
            } else if (paymentText.includes('Mandiri')) {
                instruction.textContent = 'Silakan transfer ke rekening Mandiri 9876543210 a.n. HostZone';
            } else if (paymentText.includes('Gopay')) {
                instruction.textContent = 'Silakan transfer ke Gopay 081234567890 a.n. HostZone';
            } else if (paymentText.includes('OVO')) {
                instruction.textContent = 'Silakan transfer ke OVO 081234567890 a.n. HostZone';
            }
        });
    });
    
    // Promo code functionality
    document.querySelector('.promo-code button').addEventListener('click', function(e) {
        e.preventDefault();
        applyPromoCode();
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
            showToast('Kode promo berhasil digunakan!');
        } else {
            showToast('Kode promo tidak valid');
        }
    }
    
    // Form submission
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        if (!name || !email || !phone) {
            showToast('Harap lengkapi semua informasi yang diperlukan');
            return;
        }
        
        if (cart.length === 0) {
            showToast('Keranjang belanja kosong');
            return;
        }
        
        // Collect form data
        const orderData = {
            customer: {
                name: name,
                email: email,
                phone: phone,
                domain: document.getElementById('domain').value
            },
            paymentMethod: document.querySelector('.payment-method.selected span').textContent,
            items: cart,
            subtotal: subtotal,
            discount: parseFloat(document.getElementById('discount').textContent.replace(/[^\d]/g, '')) || 0,
            total: parseFloat(document.getElementById('total').textContent.replace(/[^\d]/g, ''))
        };
        
        // Simpan order ke localStorage (simulasi)
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        localStorage.removeItem('hostingCart'); // Clear cart
                // Redirect ke halaman pembayaran
        window.location.href = 'payment.html';
    });

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

    // Inisialisasi payment method pertama sebagai selected
    if (document.querySelector('.payment-method')) {
        document.querySelector('.payment-method').click();
    }
});