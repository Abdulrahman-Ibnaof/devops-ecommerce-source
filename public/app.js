async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

async function loadCart() {
  const res = await fetch('/api/cart');
  const cart = await res.json();
  const list = document.getElementById('cart');
  list.innerHTML = '';

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    list.appendChild(li);
  });
}

async function addToCart(productId) {
  await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  });
  loadCart();
}

async function clearCart() {
  await fetch('/api/cart', { method: 'DELETE' });
  document.getElementById('message').textContent = '';
  loadCart();
}

async function checkout() {
  const res = await fetch('/api/checkout', { method: 'POST' });
  const data = await res.json();
  document.getElementById('message').textContent = res.ok
    ? `Payment success. Order: ${data.orderId}. Total: $${data.total}`
    : data.error;
  loadCart();
}

loadProducts();
loadCart();
