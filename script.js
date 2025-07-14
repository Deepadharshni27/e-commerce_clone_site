let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    showHome();
});

// Fetch and display all products from localStorage
function fetchProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];

    const productList = document.getElementById('home-section');
    productList.innerHTML = '';

    if (storedProducts.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }

    storedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>by ${product.brand}</p>
            <p>₹${parseFloat(product.price).toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add To Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

// Update cart count in the nav bar
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Show cart modal
function showCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.name} - ₹${parseFloat(item.price).toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    document.getElementById('cart-modal').style.display = 'flex';
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
}

// Close cart modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Show Home section
function showHome() {
    document.getElementById('home-section').style.display = 'grid';
    document.getElementById('add-product-section').style.display = 'none';
    fetchProducts();
}

// Show Add Product section
function showAddProduct() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('add-product-section').style.display = 'block';
}

// Validate product data
function validateProduct(product) {
    if (!product.name || !product.brand || !product.availability || !product.category || !product.description) {
        alert('All fields are required.');
        return false;
    }
    if (isNaN(product.price) || product.price <= 0) {
        alert('Price must be a positive number.');
        return false;
    }
    if (isNaN(product.quantity) || product.quantity < 0) {
        alert('Quantity must be a non-negative number.');
        return false;
    }
    return true;
}

// Add a new product to localStorage
function addProduct() {
    const product = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        brand: document.getElementById('brand').value.trim(),
        price: parseFloat(document.getElementById('price').value) || 0,
        quantity: parseInt(document.getElementById('quantity').value) || 0,
        availability: document.getElementById('availability').value,
        category: document.getElementById('category').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    if (!validateProduct(product)) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    document.getElementById('name').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('availability').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';

    alert('Product added successfully!');
    showHome();
}
