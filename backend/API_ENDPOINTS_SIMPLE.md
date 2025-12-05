# API Endpoints - Simple Reference

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

```
POST   /api/auth/register     → Register new user
POST   /api/auth/login        → Login user
GET    /api/auth/me           → Get current user (Protected)
```

---

## 👥 Users

```
GET    /api/users             → List all users (Admin)
GET    /api/users/:id         → Get user by ID (Admin)
PUT    /api/users/profile     → Update current user profile (Protected)
PUT    /api/users/farmers/profile → Update farmer profile (Protected)
DELETE /api/users/:id         → Delete user (Admin)
GET    /api/users/farmers     → List all farmers (Public)
GET    /api/users/farmers/:id → Get farmer by ID (Public)
```

---

## 🛍️ Products

```
GET    /api/products          → List all products (Public, Optional Auth)
GET    /api/products/:id      → Get product by ID (Public)
GET    /api/products/farmer/me → Get current farmer's products (Farmer)
POST   /api/products          → Create product (Farmer, with image upload)
PATCH  /api/products/:id      → Update product (Farmer/Admin)
PUT    /api/products/:id      → Update product (Farmer/Admin)
PUT    /api/products/:id/approve → Approve product (Admin)
DELETE /api/products/:id      → Delete product (Farmer/Admin)
```

---

## 📦 Orders

```
POST   /api/orders            → Create order (Consumer)
GET    /api/orders/consumer   → Get consumer's orders (Consumer)
GET    /api/orders/farmer     → Get farmer's orders (Farmer)
GET    /api/orders/admin      → Get admin's marketplace orders (Admin)
GET    /api/orders/all        → Get all orders (Admin)
GET    /api/orders/:id        → Get order details (Protected)
PATCH  /api/orders/:id/status → Update order status (Protected)
```

---

## 📋 Listings

```
GET    /api/listings          → List all listings (Public)
GET    /api/listings/:id      → Get listing by ID (Public)
GET    /api/listings/farmer/me → Get farmer's listings (Farmer)
POST   /api/listings           → Create listing (Farmer)
PATCH  /api/listings/:id       → Update listing (Farmer)
DELETE /api/listings/:id       → Delete listing (Farmer)
```

---

## 🛒 Purchases

```
GET    /api/purchases         → List all purchases (Admin)
POST   /api/purchases         → Create purchase (Admin)
PATCH  /api/purchases/:id/status → Update purchase status (Admin)
```

---

## 📊 Inventory

```
GET    /api/inventory         → List all inventory items (Admin)
GET    /api/inventory/:id     → Get inventory item by ID (Admin)
GET    /api/inventory/marketplace/products → Get admin marketplace products (Public)
PATCH  /api/inventory/:id     → Update inventory item (Admin)
POST   /api/inventory/list    → List product in marketplace (Admin)
```

---

## 🔔 Notifications

```
GET    /api/notifications              → Get user's notifications (Protected)
GET    /api/notifications/unread/count → Get unread notification count (Protected)
PATCH  /api/notifications/:id/read    → Mark notification as read (Protected)
PATCH  /api/notifications/read/all     → Mark all notifications as read (Protected)
DELETE /api/notifications/:id          → Delete notification (Protected)
```

---

## 🖼️ Images

```
POST   /api/images/upload              → Upload single image (Protected)
POST   /api/images/upload-multiple     → Upload multiple images (Protected, max 10)
GET    /api/images/user                 → Get current user's images (Protected)
GET    /api/images/user/:userId        → Get user's images by userId (Protected)
GET    /api/images/:id                 → Get image by ID (Public)
GET    /api/images/reference/:model/:id → Get images by reference (Public)
PATCH  /api/images/:id/reference       → Update image reference (Protected)
DELETE /api/images/:id                 → Delete image (Protected)
```

---

## 🌾 Crop Recommendations

```
POST   /api/crop-recommendation/recommend → Get crop recommendations (Public)
GET    /api/crop-recommendation/history   → Get recommendation history (Protected)
```

---

## 📁 Categories

```
GET    /api/categories      → List all categories (Public)
POST   /api/categories      → Create category (Protected)
PUT    /api/categories/:id → Update category (Protected)
DELETE /api/categories/:id → Delete category (Protected)
```

---

## 🏥 Health Check

```
GET    /api/health          → Server health check (Public)
```

---

## 🔑 Authentication

For protected routes, add this header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Request Examples

### Register User
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "consumer"
}
```

### Login
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Form Data)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "Tomatoes"
description: "Fresh organic tomatoes"
pricePerKg: 50
quantityKg: 100
category: "vegetables"
image: [file]
```

### Create Order
```json
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 5,
      "price": 50
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  }
}
```

---

## 🎯 Quick Reference by Role

### Public (No Auth Required)
- `GET /api/users/farmers`
- `GET /api/users/farmers/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/listings`
- `GET /api/listings/:id`
- `GET /api/inventory/marketplace/products`
- `GET /api/categories`
- `POST /api/crop-recommendation/recommend`
- `GET /api/health`

### Consumer
- `POST /api/orders`
- `GET /api/orders/consumer`
- `GET /api/orders/:id`

### Farmer
- `GET /api/products/farmer/me`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/listings/farmer/me`
- `POST /api/listings`
- `PATCH /api/listings/:id`
- `DELETE /api/listings/:id`
- `GET /api/orders/farmer`

### Admin
- `GET /api/users`
- `GET /api/users/:id`
- `DELETE /api/users/:id`
- `PUT /api/products/:id/approve`
- `GET /api/orders/all`
- `GET /api/purchases`
- `POST /api/purchases`
- `GET /api/inventory`
- `POST /api/inventory/list`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`


