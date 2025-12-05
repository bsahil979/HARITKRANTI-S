# API Endpoints Documentation

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/me` | Protected | Get current user profile |

### Register Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "consumer",  // "consumer" | "farmer" | "admin"
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  }
}
```

### Login Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "consumer"  // optional
}
```

---

## 👥 Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | Get all users |
| GET | `/users/:id` | Admin | Get user by ID |
| PUT | `/users/profile` | Protected | Update current user profile |
| PUT | `/users/farmers/profile` | Protected | Update farmer profile (alias) |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/users/farmers` | Public | Get all farmers |
| GET | `/users/farmers/:id` | Public | Get farmer by ID |

### Update Profile Request Body:
```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "address": {
    "street": "456 New St",
    "city": "New City",
    "state": "New State",
    "zipCode": "54321"
  }
}
```

---

## 🛍️ Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | Optional | List all products (with optional filters) |
| GET | `/products/:id` | Public | Get product by ID |
| GET | `/products/farmer/me` | Farmer | Get current farmer's products |
| POST | `/products` | Farmer | Create new product (with image upload) |
| PATCH | `/products/:id` | Farmer/Admin | Update product |
| PUT | `/products/:id` | Farmer/Admin | Update product (alternative) |
| PUT | `/products/:id/approve` | Admin | Approve product |
| DELETE | `/products/:id` | Farmer/Admin | Delete product |

### Create Product Request Body (Form Data):
```
name: "Tomatoes"
description: "Fresh organic tomatoes"
pricePerKg: 50
quantityKg: 100
category: "vegetables"
isOrganic: true
harvestDate: "2024-01-15"
cropType: "vegetable"
image: [file]
```

### Query Parameters for GET /products:
- `category` - Filter by category
- `farmer` - Filter by farmer ID
- `isOrganic` - Filter organic products (true/false)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name/description
- `page` - Page number
- `limit` - Items per page

---

## 📦 Orders (`/api/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Consumer | Create new order |
| GET | `/orders/consumer` | Consumer | Get consumer's orders |
| GET | `/orders/farmer` | Farmer | Get farmer's orders |
| GET | `/orders/admin` | Admin | Get admin's marketplace orders |
| GET | `/orders/all` | Admin | Get all orders |
| GET | `/orders/:id` | Protected | Get order details |
| PATCH | `/orders/:id/status` | Protected | Update order status |

### Create Order Request Body:
```json
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
  },
  "paymentMethod": "cash"
}
```

### Update Order Status Request Body:
```json
{
  "status": "confirmed"  // "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
}
```

---

## 📋 Listings (`/api/listings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/listings` | Public | Get all listings |
| GET | `/listings/:id` | Public | Get listing by ID |
| GET | `/listings/farmer/me` | Farmer | Get farmer's listings |
| POST | `/listings` | Farmer | Create new listing |
| PATCH | `/listings/:id` | Farmer | Update listing |
| DELETE | `/listings/:id` | Farmer | Delete listing |

### Create Listing Request Body:
```json
{
  "title": "Fresh Vegetables",
  "description": "Organic vegetables from farm",
  "price": 100,
  "quantity": 50,
  "category": "vegetables",
  "images": ["url1", "url2"]
}
```

---

## 🛒 Purchases (`/api/purchases`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/purchases` | Admin | Get all purchases |
| POST | `/purchases` | Admin | Create new purchase |
| PATCH | `/purchases/:id/status` | Admin | Update purchase status |

### Create Purchase Request Body:
```json
{
  "supplier": "Supplier Name",
  "items": [
    {
      "productName": "Tomatoes",
      "quantity": 100,
      "unitPrice": 30,
      "totalPrice": 3000
    }
  ],
  "totalAmount": 3000,
  "purchaseDate": "2024-01-15"
}
```

---

## 📊 Inventory (`/api/inventory`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/inventory` | Admin | Get all inventory items |
| GET | `/inventory/:id` | Admin | Get inventory item by ID |
| GET | `/inventory/marketplace/products` | Public | Get admin marketplace products |
| PATCH | `/inventory/:id` | Admin | Update inventory item |
| POST | `/inventory/list` | Admin | List product in marketplace |

### Update Inventory Request Body:
```json
{
  "quantity": 150,
  "location": "Warehouse A",
  "status": "available"
}
```

---

## 🔔 Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Protected | Get user's notifications |
| GET | `/notifications/unread/count` | Protected | Get unread notification count |
| PATCH | `/notifications/:id/read` | Protected | Mark notification as read |
| PATCH | `/notifications/read/all` | Protected | Mark all notifications as read |
| DELETE | `/notifications/:id` | Protected | Delete notification |

---

## 🖼️ Images (`/api/images`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/images/upload` | Protected | Upload single image |
| POST | `/images/upload-multiple` | Protected | Upload multiple images (max 10) |
| GET | `/images/user` | Protected | Get current user's images |
| GET | `/images/user/:userId` | Protected | Get user's images by userId |
| GET | `/images/:id` | Public | Get image by ID |
| GET | `/images/reference/:model/:id` | Public | Get images by reference (e.g., product, listing) |
| PATCH | `/images/:id/reference` | Protected | Update image reference |
| DELETE | `/images/:id` | Protected | Delete image |

### Upload Image Request (Form Data):
```
image: [file]
referenceType: "product"  // optional
referenceId: "product_id"  // optional
```

### Upload Multiple Images Request (Form Data):
```
images: [file1, file2, file3, ...]
referenceType: "product"
referenceId: "product_id"
```

---

## 🌾 Crop Recommendations (`/api/crop-recommendation`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/crop-recommendation/recommend` | Public | Get crop recommendations |
| GET | `/crop-recommendation/history` | Protected | Get recommendation history |

### Get Recommendations Request Body:
```json
{
  "soilType": "loamy",
  "climate": "tropical",
  "season": "summer",
  "location": {
    "lat": 19.0760,
    "lng": 72.8777
  },
  "waterAvailability": "high",
  "saveToHistory": true  // optional, requires auth
}
```

---

## 📁 Categories (`/api/categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | Get all categories |
| POST | `/categories` | Protected | Create new category |
| PUT | `/categories/:id` | Protected | Update category |
| DELETE | `/categories/:id` | Protected | Delete category |

### Create Category Request Body:
```json
{
  "name": "Vegetables",
  "description": "Fresh vegetables",
  "icon": "🥬"
}
```

---

## 🏥 Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | Public | Server health check |

---

## 🔑 Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Notes

- **Base URL**: All endpoints are prefixed with `/api`
- **Port**: Default port is `5000` (configurable via `PORT` environment variable)
- **Content-Type**: For JSON requests, use `Content-Type: application/json`
- **File Uploads**: Use `multipart/form-data` for image uploads
- **Roles**: `consumer`, `farmer`, `admin`
- **Pagination**: Many list endpoints support `page` and `limit` query parameters

---

## 🧪 Testing Examples

### Using Postman:

1. **Register User:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body: (see Register Request Body above)

2. **Login:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body: (see Login Request Body above)

3. **Get Products (with token):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/products`
   - Headers: `Authorization: Bearer <token>`

4. **Create Product (with token and file):**
   - Method: `POST`
   - URL: `http://localhost:5000/api/products`
   - Headers: `Authorization: Bearer <token>`
   - Body: Form-data with fields and image file

---

## ⚠️ Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error


