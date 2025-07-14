let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    showHome();
});

// Fetch and display all products
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
            if (response.status === 404) throw new Error('Products not found.');
            throw new Error('Failed to fetch products.');
        }
        const products = await response.json();
        const productList = document.getElementById('home-section');
        productList.innerHTML = '';
        products.forEach(product => {
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
    } catch (error) {
        alert(error.message);
        console.error('Error fetching products:', error);
    }
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

// Add a new product
async function addProduct() {
    const product = {
        name: document.getElementById('name').value.trim(),
        brand: document.getElementById('brand').value.trim(),
        price: parseFloat(document.getElementById('price').value) || 0,
        quantity: parseInt(document.getElementById('quantity').value) || 0,
        availability: document.getElementById('availability').value,
        category: document.getElementById('category').value.trim(),
        description: document.getElementById('description').value.trim()
    };
    console.log('Product payload:', product); // Log the payload for debugging
    if (!validateProduct(product)) return;
    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add product: ${errorText || 'Server error'}`);
        }
        const savedProduct = await response.json();
        console.log('Product saved:', savedProduct); // Log the response
        document.getElementById('name').value = '';
        document.getElementById('brand').value = '';
        document.getElementById('price').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('availability').value = '';
        document.getElementById('category').value = '';
        document.getElementById('description').value = '';
        alert('Product added successfully!');
        showHome();
    } catch (error) {
        alert(error.message);
        console.error('Error adding product:', error);
    }
}