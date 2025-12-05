# Test POST Requests

## Quick Test Commands

### 1. Test User Registration (POST)

**Using cURL (Windows PowerShell):**
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"role\":\"consumer\"}'
```

**Using cURL (Git Bash / Linux / Mac):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"consumer"}'
```

**Using Node.js script:**
```bash
node test-post.js
```

### 2. Test User Login (POST)

**Using cURL (Windows PowerShell):**
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

**Using cURL (Git Bash / Linux / Mac):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. Test with Postman (Step-by-Step Guide)

#### **Step 1: Create a New Request**
1. Open Postman
2. Click "New" → "HTTP Request" (or press `Ctrl+N`)
3. Name it "Register User" or "Login User"

#### **Step 2: Configure Registration Request**

**A. Set the Method and URL:**
- Click the dropdown (default shows "GET") and select **`POST`**
- In the URL bar, enter: `http://localhost:5000/api/auth/register`

**B. Add Headers:**
1. Click the **"Headers"** tab below the URL
2. In the "Key" field, type: `Content-Type`
3. In the "Value" field, type: `application/json`
4. (Postman may auto-complete this for you)

**C. Add Body:**
1. Click the **"Body"** tab
2. Select **"raw"** radio button
3. In the dropdown on the right (shows "Text" by default), select **"JSON"**
4. Paste this JSON in the text area:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456",
  "role": "consumer",
  "phone": "1234567890"
}
```

**D. Send the Request:**
- Click the blue **"Send"** button
- You should see a response below with status `201 Created` and a JSON response containing `token` and `user` data

#### **Step 3: Configure Login Request**

Create another request for login:

**A. Set the Method and URL:**
- Method: **`POST`**
- URL: `http://localhost:5000/api/auth/login`

**B. Add Headers:**
- Key: `Content-Type`
- Value: `application/json`

**C. Add Body:**
- Select **"raw"** and **"JSON"**
- Paste this JSON:
```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```

**D. Send the Request:**
- Click **"Send"**
- You should get a `200 OK` response with `token` and `user` data

#### **Quick Tips:**
- ✅ Make sure your backend server is running on port 5000
- ✅ Change the email address if you get "User already exists" error
- ✅ The response will show the JWT token - save it for authenticated requests
- ✅ Check the "Status" code: `201` = Created, `200` = Success, `400` = Bad Request, `401` = Unauthorized

## Available Roles
- `consumer` (default)
- `farmer`
- `admin`

## Required Fields for Registration
- `name` (required)
- `email` (required)
- `password` (required)
- `role` (optional, defaults to "consumer")
- `phone` (optional)
- `address` (optional)

## Required Fields for Login
- `email` (required)
- `password` (required)
- `role` (optional, for role-based login)

