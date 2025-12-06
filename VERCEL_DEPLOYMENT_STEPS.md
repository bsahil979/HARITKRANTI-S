# 🚀 Deploy Frontend to Vercel - Step by Step

Your backend is live at: **`https://haritkranti-s-5.onrender.com`**

Now let's deploy the frontend to Vercel!

---

## 📋 Step-by-Step Instructions

### Step 1: Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or **"Log In"** if you already have an account)
3. Choose **"Continue with GitHub"** (recommended - easiest way to connect your repo)

### Step 2: Import Your Project

1. After logging in, you'll see the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find and click **"HARITKRANTI-S"** (or `HaritKranti-S`)
5. Click **"Import"**

### Step 3: Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

1. **Framework Preset:** Should show `Vite` ✅
2. **Root Directory:** Should be `./` (root of repository) ✅
3. **Build Command:** Should be `npm run build` ✅
4. **Output Directory:** Should be `dist` ✅
5. **Install Command:** Should be `npm install` ✅

**⚠️ Don't click Deploy yet!** We need to add environment variables first.

### Step 4: Add Environment Variable (CRITICAL!)

1. Before deploying, click on **"Environment Variables"** section
2. Click **"Add"** or the **"+"** button
3. Add this variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://haritkranti-s-5.onrender.com/api`
   - **Environments:** Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
4. Click **"Save"**

### Step 5: Deploy!

1. Scroll down and click the big **"Deploy"** button
2. Wait for the build to complete (usually 1-3 minutes)
3. You'll see build logs in real-time
4. Once complete, you'll see: **"Congratulations! Your project has been deployed."**

### Step 6: Get Your Frontend URL

1. After deployment, Vercel will show you your live URL
2. It will look like: `https://haritkranti-s-5.vercel.app` (or similar)
3. **Copy this URL** - you'll need it for the next step!

---

## 🔄 Step 7: Update Backend CORS (IMPORTANT!)

Now we need to tell your backend to allow requests from your Vercel frontend:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service (`haritkranti-s-5`)
3. Go to **"Environment"** tab
4. Find the `FRONTEND_URL` variable
5. Update it to your Vercel URL:
   - **Value:** `https://your-frontend-url.vercel.app` (replace with your actual Vercel URL)
6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 1-2 minutes)

---

## ✅ Step 8: Test Your Deployment

1. **Test Frontend:**
   - Open your Vercel URL in a browser
   - The app should load

2. **Test API Connection:**
   - Try logging in or registering
   - Check browser console (F12) for any errors
   - If you see CORS errors, wait for Render to finish redeploying

3. **Test Health Endpoint:**
   - Visit: `https://haritkranti-s-5.onrender.com/health`
   - Should return: `{"ok":true,"status":"healthy","timestamp":"..."}`

---

## 🎉 You're Done!

Your application is now live:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://haritkranti-s-5.onrender.com`

---

## 🐛 Troubleshooting

### Problem: Build fails on Vercel
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Problem: API calls not working
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that it includes `/api` at the end: `https://haritkranti-s-5.onrender.com/api`
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Wait for Render to finish redeploying after updating `FRONTEND_URL`

### Problem: CORS errors
- Double-check `FRONTEND_URL` in Render matches your Vercel URL
- Make sure there's no trailing slash: `https://your-app.vercel.app` (not `https://your-app.vercel.app/`)
- Wait 1-2 minutes after updating environment variables for redeploy to complete

### Problem: Environment variable not working
- Remember: Vite requires `VITE_` prefix
- After adding/changing environment variables, Vercel will automatically rebuild
- Make sure the variable is set for the correct environment (Production/Preview/Development)

---

## 📝 Quick Reference

**Backend URL:**
```
https://haritkranti-s-5.onrender.com
```

**API Base URL (for VITE_API_URL):**
```
https://haritkranti-s-5.onrender.com/api
```

**Health Check:**
```
https://haritkranti-s-5.onrender.com/health
```

---

**Need Help?** Check the build logs in Vercel dashboard for detailed error messages.

