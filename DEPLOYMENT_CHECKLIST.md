# ✅ Deployment Checklist

Use this checklist to ensure you've completed all deployment steps.

## 🔧 Pre-Deployment Setup

- [ ] Code is pushed to GitHub repository
- [ ] MongoDB Atlas database is set up and accessible
- [ ] Cloudinary account is set up (for image uploads)
- [ ] Google Translate API key is obtained (if using translation features)
- [ ] All environment variables are documented

## 🖥️ Backend Deployment (Render)

- [ ] Created Render account
- [ ] Created new Web Service in Render
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `GOOGLE_TRANSLATE_API_KEY` (optional)
  - [ ] `FRONTEND_URL` (will update after frontend deploy)
  - [ ] `PORT` (auto-set, but verify)
- [ ] Deployment completed successfully
- [ ] Health check endpoint works: `/health`
- [ ] Backend URL copied: `https://your-backend.onrender.com`
- [ ] MongoDB Atlas Network Access updated (allow Render IPs)

## 🎨 Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Framework auto-detected as Vite
- [ ] Root Directory set to `./` (root)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
- [ ] Deployment completed successfully
- [ ] Frontend URL copied: `https://your-project.vercel.app`
- [ ] Frontend loads correctly in browser

## 🔄 Post-Deployment Configuration

- [ ] Updated `FRONTEND_URL` in Render with Vercel URL
- [ ] Backend redeployed with updated CORS settings
- [ ] Tested login/registration flow
- [ ] Tested API calls from frontend
- [ ] Verified image uploads work (if applicable)
- [ ] Checked browser console for errors
- [ ] Verified all features work end-to-end

## 🔐 Security Verification

- [ ] No `.env` files committed to Git
- [ ] All secrets are in platform environment variables only
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] CORS is properly configured
- [ ] JWT secret is strong (32+ characters)

## 📝 Documentation

- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Environment variables documented
- [ ] Team members have access to deployment platforms

## 🎉 Final Verification

- [ ] Application is accessible via frontend URL
- [ ] All API endpoints respond correctly
- [ ] Database connections work
- [ ] File uploads work (if applicable)
- [ ] Authentication works
- [ ] No console errors in browser
- [ ] No errors in Render logs
- [ ] No errors in Vercel build logs

---

**Deployment Complete!** 🚀

If any item is unchecked, refer to `DEPLOYMENT_GUIDE.md` for detailed instructions.

