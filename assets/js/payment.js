document.addEventListener('DOMContentLoaded', function() {
    // Load order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!orderData) {
        window.location.href = 'index.html';
        return;
    }

    // Set payment method info based on selected method
    function setPaymentMethod(method) {
        const paymentMethods = {
            'Bank Transfer (BCA)': {
                logo: 'assets/images/bca.png',
                accountNumber: '1234567890',
                accountName: 'HostZone'
            },
            'Bank Transfer (Mandiri)': {
                logo: 'assets/images/mandiri.png',
                accountNumber: '9876543210',
                accountName: 'HostZone'
            },
            'Gopay': {
                logo: 'assets/images/gopay.png',
                accountNumber: '081234567890',
                accountName: 'HostZone'
            },
            'OVO': {
                logo: 'assets/images/ovo.png',
                accountNumber: '081234567890',
                accountName: 'HostZone'
            }
        };

        const methodInfo = paymentMethods[method] || paymentMethods['Bank Transfer (BCA)'];
        
        document.getElementById('payment-logo').src = methodInfo.logo;
        document.getElementById('payment-method-name').textContent = method;
        document.getElementById('account-number').textContent = methodInfo.accountNumber;
        document.getElementById('account-name').textContent = methodInfo.accountName;
    }

    // Display order details
    function displayOrderDetails() {
        // Order items
        const orderDetailsContainer = document.getElementById('order-details');
        orderDetailsContainer.innerHTML = '';
        
        orderData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <span>${item.name} (${item.period === 'yearly' ? 'Tahunan' : 'Bulanan'})</span>
                <span>${formatCurrency(item.price)}</span>
            `;
            orderDetailsContainer.appendChild(itemElement);
        });

        // Summary
        document.getElementById('order-subtotal').textContent = formatCurrency(orderData.subtotal);
        document.getElementById('order-discount').textContent = formatCurrency(orderData.discount);
        document.getElementById('order-total').textContent = formatCurrency(orderData.total);
        document.getElementById('payment-amount').textContent = formatCurrency(orderData.total);

        // Customer info
        document.getElementById('customer-name').textContent = orderData.customer.name;
        document.getElementById('customer-email').textContent = orderData.customer.email;
        document.getElementById('customer-phone').textContent = orderData.customer.phone;
        document.getElementById('customer-domain').textContent = orderData.customer.domain || '-';

        // Payment method
        setPaymentMethod(orderData.paymentMethod);
    }

    // Handle payment proof submission
    document.getElementById('payment-proof-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('payment-proof');
        if (fileInput.files.length === 0) {
            showToast('Harap pilih bukti transfer');
            return;
        }

        // In a real app, you would upload this to your server
        const paymentProof = fileInput.files[0];
        const note = document.getElementById('payment-note').value;

        // Simulate payment processing
        showToast('Pembayaran sedang diproses...');
        
        setTimeout(() => {
            // Simulate successful payment
            localStorage.setItem('paymentCompleted', 'true');
            window.location.href = 'payment-success.html';
        }, 2000);
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

    // Initialize page
    displayOrderDetails();
});