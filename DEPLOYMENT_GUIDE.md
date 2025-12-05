# 🚀 Deployment Guide - HaritKranti

This guide will walk you through deploying the **Frontend to Vercel** and **Backend to Render**.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **MongoDB Atlas Account** - For database (if not already set up)
5. **Cloudinary Account** - For image storage (if not already set up)
6. **Google Cloud Account** - For translation API (if using translation features)

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend

1. **Ensure your backend is ready:**
   - Make sure `backend/package.json` has a `start` script (✅ already has it)
   - Ensure all dependencies are listed in `package.json`
   - ⚠️ **IMPORTANT:** The server must listen on `0.0.0.0` (not `localhost`) for Render to access it
     - ✅ This is already fixed in `backend/src/index.js` - it uses `app.listen(PORT, "0.0.0.0", ...)`
     - Never hardcode `localhost` in your server code for production deployments

### Step 2: Create a Render Web Service

1. **Go to Render Dashboard:**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**

2. **Connect Your Repository:**
   - Connect your GitHub account if not already connected
   - Select your repository: `HaritKranti-S`
   - Click **"Connect"**

3. **Configure the Service:**
   - **Name:** `haritkranti-backend` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend` ⚠️ **IMPORTANT: Set this to `backend`**
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Choose based on your needs:
     - **Free:** Limited hours/month, spins down after inactivity
     - **Starter ($7/month):** Always on, better performance

4. **Click "Create Web Service"**

### Step 3: Configure Environment Variables in Render

In your Render service dashboard, go to **"Environment"** tab and add these variables:

```bash
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Translate API (optional, for translation features)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key

# Frontend URL (will be set after deploying frontend)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Port (Render sets this automatically, but you can override)
PORT=10000
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- `FRONTEND_URL` will be updated after you deploy the frontend
- `PORT` is automatically set by Render, but the default is fine
- Never commit these values to Git!

### Step 4: Deploy and Get Backend URL

1. **Save the environment variables** - Render will automatically redeploy
2. **Wait for deployment to complete** - Check the "Logs" tab for any errors
3. **Copy your backend URL** - It will look like: `https://haritkranti-backend.onrender.com`
4. **Test the health endpoint:**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"ok":true}`

### Step 5: Update MongoDB Atlas Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (or add Render's IP ranges)
5. Save changes

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Your Frontend

1. **Update environment variables:**
   - Create a `.env.production` file (or we'll set it in Vercel)
   - The frontend needs: `VITE_API_URL` pointing to your Render backend

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Click **"Add New..."** → **"Project"**

2. **Import Your Repository:**
   - Connect GitHub if not already connected
   - Select your repository: `HaritKranti-S`
   - Click **"Import"**

3. **Configure Project:**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (root of repository)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `dist` (should auto-detect)
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add the following:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - Make sure to select **Production**, **Preview**, and **Development** environments

5. **Click "Deploy"**

### Step 3: Verify Deployment

1. **Wait for build to complete** - Usually takes 1-3 minutes
2. **Visit your deployed site** - Vercel will provide a URL like: `https://haritkranti-s.vercel.app`
3. **Test the application:**
   - Check if the frontend loads correctly
   - Try logging in/registering
   - Verify API calls are working

### Step 4: Update Backend CORS

1. **Go back to Render Dashboard**
2. **Update the `FRONTEND_URL` environment variable:**
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. **Save** - Render will automatically redeploy

---

## 🔄 Part 3: Post-Deployment Configuration

### Update Frontend API URL

If you need to update the API URL after deployment:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with the correct backend URL
3. **Redeploy** the project (or it will auto-redeploy on next push)

### Custom Domain (Optional)

**For Vercel:**
1. Go to Project Settings → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

**For Render:**
1. Go to your service → **Settings** → **Custom Domains**
2. Add your custom domain
3. Configure DNS as instructed

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Backend not starting / "Server running on localhost" error**
- ⚠️ **CRITICAL:** Your server must listen on `0.0.0.0`, not `localhost`
- If you see `🚀 API running http://localhost:10000` in logs, the server is not accessible
- Fix: Change `app.listen(PORT, ...)` to `app.listen(PORT, "0.0.0.0", ...)` in `backend/src/index.js`
- ✅ This is already fixed in the current codebase
- Never hardcode `localhost` in production server code

**Problem: Backend not starting (general)**
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure `MONGODB_URI` is correct and MongoDB Atlas allows connections

**Problem: CORS errors**
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that the URL doesn't have a trailing slash

**Problem: Database connection fails**
- Check MongoDB Atlas Network Access settings
- Verify `MONGODB_URI` is correct
- Check Render logs for connection errors

### Frontend Issues

**Problem: API calls failing**
- Verify `VITE_API_URL` in Vercel environment variables
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Problem: Build fails**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Problem: Environment variables not working**
- Remember: Vite requires `VITE_` prefix for environment variables
- Rebuild after adding new environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

---

## 📝 Quick Reference

### Backend URL Format
```
https://your-service-name.onrender.com
```

### Frontend URL Format
```
https://your-project-name.vercel.app
```

### Health Check Endpoints
- Backend: `https://your-backend.onrender.com/health`
- Should return: `{"ok":true}`

### Environment Variables Checklist

**Render (Backend):**
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `JWT_EXPIRE`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`
- ✅ `GOOGLE_TRANSLATE_API_KEY` (optional)
- ✅ `FRONTEND_URL`
- ✅ `PORT` (auto-set by Render)

**Vercel (Frontend):**
- ✅ `VITE_API_URL`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They should be in `.gitignore`
2. **Use strong JWT secrets** - At least 32 characters, random
3. **Keep API keys secure** - Only set them in platform environment variables
4. **Enable HTTPS** - Both Vercel and Render provide HTTPS by default
5. **Regular updates** - Keep dependencies updated for security patches

---

## 🎉 You're Done!

Your application should now be live:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-service.onrender.com`

Both services will automatically redeploy when you push changes to your GitHub repository (if auto-deploy is enabled).

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Cloudinary Setup](https://cloudinary.com/documentation)

---

**Need Help?** Check the logs in both Vercel and Render dashboards for detailed error messages.

