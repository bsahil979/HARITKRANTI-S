# Postman Guide - How to Test GET, DELETE, and PUT Requests

---

## 🔵 GET Request (Read Data)

### Example 1: Get All Products (Public)
1. **Method**: Select `GET` from dropdown
2. **URL**: `http://localhost:5000/api/products`
3. **Headers**: None needed (public endpoint)
4. **Body**: Leave empty (GET requests don't have body)
5. **Click "Send"**

### Example 2: Get User Profile (Protected)
1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/auth/me`
3. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body**: Leave empty
5. **Click "Send"**

### Example 3: Get Product by ID
1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/products/507f1f77bcf86cd799439011`
   - Replace `507f1f77bcf86cd799439011` with actual product ID
3. **Headers**: None needed (public)
4. **Body**: Leave empty
5. **Click "Send"**

### Example 4: Get All Users (Admin Only)
1. **Method**: `GET`
2. **URL**: `http://localhost:5000/api/users`
3. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer <admin_jwt_token>`
4. **Body**: Leave empty
5. **Click "Send"**

---

## 🔴 DELETE Request (Remove Data)

### Example 1: Delete Product
1. **Method**: Select `DELETE` from dropdown
2. **URL**: `http://localhost:5000/api/products/507f1f77bcf86cd799439011`
   - Replace with actual product ID
3. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body**: Leave empty (DELETE requests usually don't have body)
5. **Click "Send"**

### Example 2: Delete User (Admin Only)
1. **Method**: `DELETE`
2. **URL**: `http://localhost:5000/api/users/507f1f77bcf86cd799439011`
   - Replace with actual user ID
3. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer <admin_jwt_token>`
4. **Body**: Leave empty
5. **Click "Send"**

### Example 3: Delete Notification
1. **Method**: `DELETE`
2. **URL**: `http://localhost:5000/api/notifications/507f1f77bcf86cd799439011`
   - Replace with actual notification ID
3. **Headers**:
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body**: Leave empty
5. **Click "Send"**

---

## 🟡 PUT Request (Update Data)

### Example 1: Update User Profile
1. **Method**: Select `PUT` from dropdown
2. **URL**: `http://localhost:5000/api/users/profile`
3. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body Tab**:
   - Select **"raw"** radio button
   - Select **"JSON"** from dropdown
   - Paste this JSON:
   ```json
   {
     "name": "Updated Name",
     "phone": "9876543210",
     "address": {
       "street": "456 New Street",
       "city": "New City",
       "state": "New State",
       "zipCode": "54321"
     }
   }
   ```
5. **Click "Send"**

### Example 2: Update Product
1. **Method**: `PUT` or `PATCH`
2. **URL**: `http://localhost:5000/api/products/507f1f77bcf86cd799439011`
   - Replace with actual product ID
3. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body Tab** (raw JSON):
   ```json
   {
     "name": "Updated Product Name",
     "description": "Updated description",
     "pricePerKg": 75,
     "quantityKg": 150,
     "isOrganic": true
   }
   ```
5. **Click "Send"**

### Example 3: Update Category
1. **Method**: `PUT`
2. **URL**: `http://localhost:5000/api/categories/507f1f77bcf86cd799439011`
   - Replace with actual category ID
3. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body Tab** (raw JSON):
   ```json
   {
     "name": "Updated Category Name",
     "description": "Updated description",
     "icon": "🥕"
   }
   ```
5. **Click "Send"**

### Example 4: Update Order Status
1. **Method**: `PATCH` (or `PUT` if supported)
2. **URL**: `http://localhost:5000/api/orders/507f1f77bcf86cd799439011/status`
   - Replace with actual order ID
3. **Headers**:
   - Key: `Content-Type`
   - Value: `application/json`
   - Key: `Authorization`
   - Value: `Bearer <your_jwt_token>`
4. **Body Tab** (raw JSON):
   ```json
   {
     "status": "confirmed"
   }
   ```
   - Status options: `"pending"`, `"confirmed"`, `"processing"`, `"shipped"`, `"delivered"`, `"cancelled"`
5. **Click "Send"**

---

## 📋 Step-by-Step Visual Guide

### For GET Requests:
```
1. Select "GET" from method dropdown
2. Enter URL in address bar
3. Go to "Headers" tab (if auth needed)
   - Add: Authorization: Bearer <token>
4. Leave "Body" tab empty
5. Click "Send"
```

### For DELETE Requests:
```
1. Select "DELETE" from method dropdown
2. Enter URL with ID: /api/resource/:id
3. Go to "Headers" tab
   - Add: Authorization: Bearer <token>
4. Leave "Body" tab empty
5. Click "Send"
```

### For PUT/PATCH Requests:
```
1. Select "PUT" or "PATCH" from method dropdown
2. Enter URL (with ID if updating specific item)
3. Go to "Headers" tab
   - Add: Content-Type: application/json
   - Add: Authorization: Bearer <token>
4. Go to "Body" tab
   - Select "raw" radio button
   - Select "JSON" from dropdown
   - Paste your JSON data
5. Click "Send"
```

---

## 🔑 Getting Your JWT Token

Before testing protected endpoints, you need to login first:

1. **POST** `http://localhost:5000/api/auth/login`
2. **Headers**: `Content-Type: application/json`
3. **Body** (raw JSON):
   ```json
   {
     "email": "your@email.com",
     "password": "yourpassword"
   }
   ```
4. Copy the `token` from the response
5. Use it in `Authorization: Bearer <token>` header for protected routes

---

## 🎯 Common GET Endpoints to Test

```
GET /api/products                    → Get all products
GET /api/products/:id                → Get product by ID
GET /api/users/farmers                → Get all farmers
GET /api/users/farmers/:id           → Get farmer by ID
GET /api/categories                  → Get all categories
GET /api/listings                    → Get all listings
GET /api/orders/consumer             → Get consumer orders (with token)
GET /api/notifications               → Get notifications (with token)
GET /api/auth/me                     → Get current user (with token)
```

## 🗑️ Common DELETE Endpoints to Test

```
DELETE /api/products/:id              → Delete product (Farmer/Admin)
DELETE /api/listings/:id             → Delete listing (Farmer)
DELETE /api/users/:id                 → Delete user (Admin)
DELETE /api/notifications/:id        → Delete notification (Protected)
DELETE /api/categories/:id           → Delete category (Protected)
DELETE /api/images/:id                → Delete image (Protected)
```

## ✏️ Common PUT/PATCH Endpoints to Test

```
PUT /api/users/profile                → Update user profile
PUT /api/products/:id                 → Update product
PATCH /api/products/:id               → Update product (alternative)
PUT /api/products/:id/approve         → Approve product (Admin)
PATCH /api/orders/:id/status          → Update order status
PUT /api/categories/:id               → Update category
PATCH /api/inventory/:id              → Update inventory
PATCH /api/notifications/:id/read     → Mark notification as read
```

---

## 💡 Pro Tips

1. **Save Requests**: Click "Save" to save your requests in a collection
2. **Variables**: Use `{{baseUrl}}` variable for `http://localhost:5000/api`
3. **Environment**: Create environment variables for tokens
4. **Tests**: Add tests to automatically check response status
5. **Collections**: Organize requests by feature (Auth, Products, Orders, etc.)

---

## ⚠️ Common Mistakes

❌ **Forgetting Authorization Header** - Protected routes need `Authorization: Bearer <token>`
❌ **Wrong Content-Type** - PUT requests need `Content-Type: application/json`
❌ **Body in GET/DELETE** - These methods usually don't need a body
❌ **Wrong URL Format** - Make sure IDs are in the URL path, not query params
❌ **Using POST instead of PUT** - PUT is for updates, POST is for creating

---

## ✅ Success Indicators

- **GET**: Status `200 OK` with data in response
- **PUT/PATCH**: Status `200 OK` or `201 Created` with updated data
- **DELETE**: Status `200 OK` or `204 No Content` (successful deletion)

---

## 🔍 Testing Workflow Example

1. **Login** → Get token
   ```
   POST /api/auth/login
   → Copy token from response
   ```

2. **Get Products** (to find an ID)
   ```
   GET /api/products
   → Copy a product ID
   ```

3. **Update Product**
   ```
   PUT /api/products/:id
   Authorization: Bearer <token>
   Body: { "name": "Updated Name" }
   ```

4. **Delete Product** (if needed)
   ```
   DELETE /api/products/:id
   Authorization: Bearer <token>
   ```


