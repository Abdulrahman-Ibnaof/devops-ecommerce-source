const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  { id: 1, name: 'Cloud Engineer Hoodie', price: 35, image: '/images/hoodie.svg' },
  { id: 2, name: 'DevOps Mug', price: 12, image: '/images/mug.svg' },
  { id: 3, name: 'Kubernetes Sticker Pack', price: 8, image: '/images/stickers.svg' }
];

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'devops-ecommerce', version: '1.0.0' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  req.session.cart = req.session.cart || [];
  res.json(req.session.cart);
});

app.post('/api/cart', (req, res) => {
  const productId = Number(req.body.productId);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  req.session.cart = req.session.cart || [];
  req.session.cart.push(product);
  res.status(201).json(req.session.cart);
});

app.delete('/api/cart', (req, res) => {
  req.session.cart = [];
  res.json(req.session.cart);
});

app.post('/api/checkout', (req, res) => {
  req.session.cart = req.session.cart || [];

  if (req.session.cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
  req.session.cart = [];

  res.json({
    status: 'paid',
    orderId: `ORD-${Date.now()}`,
    total
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DevOps e-commerce app running on port ${PORT}`);
});
