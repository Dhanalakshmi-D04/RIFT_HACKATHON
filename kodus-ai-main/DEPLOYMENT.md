# 🚀 Deployment Guide: RIFT Autonomous DevOps Agent

**Frontend: Vercel | Backend: Railway**

---

## 📋 Prerequisites

- ✅ GitHub account with your code pushed to a **public repository**
- ✅ Railway account ([railway.app](https://railway.app))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ GitHub Personal Access Token (for backend to clone/push repos)

---

## 🔧 Step 1: Deploy Backend on Railway

### 1.1 Push Code to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Create Railway Project
1. Go to [railway.app](https://railway.app) → **Login** (GitHub OAuth)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect Node.js

### 1.3 Configure Railway Service
1. In Railway dashboard, click your service
2. Go to **Settings** tab
3. Set **Root Directory** to: `agent`
4. Set **Build Command** to: `yarn install && yarn build`
5. Set **Start Command** to: `yarn start`

### 1.4 Add Environment Variables
In Railway → **Variables** tab, add:

```
PORT=4100
RETRY_LIMIT=5
GITHUB_TOKEN=ghp_your_token_here
CORS_ORIGINS=*
```

**Optional LLM keys** (add the ones you use):
```
OPENAI_API_KEY=sk-...
# OR
GEMINI_API_KEY=...
# OR
ANTHROPIC_API_KEY=sk-ant-...
```

### 1.5 Get Railway URL
1. Railway will auto-generate a public URL like: `https://your-service.up.railway.app`
2. **Copy this URL** - you'll need it for Vercel!

### 1.6 Test Backend Endpoints
Open in browser/Postman:
- ✅ `GET https://your-service.up.railway.app/api/status` (should return `{"executionStatus":"idle"...}`)
- ✅ `POST https://your-service.up.railway.app/api/run-agent` (with JSON body)

---

## 🎨 Step 2: Deploy Frontend on Vercel

### 2.1 Import Project
1. Go to [vercel.com](https://vercel.com) → **Login** (GitHub OAuth)
2. Click **Add New** → **Project**
3. Import your GitHub repository

### 2.2 Configure Vercel Project
1. In project settings, set **Root Directory** to: `frontend`
2. Vercel auto-detects Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `yarn build` (or auto-detected)
   - **Output Directory**: `dist`
   - **Install Command**: `yarn install`

### 2.3 Add Environment Variable
In Vercel → **Settings** → **Environment Variables**, add:

```
VITE_API_BASE_URL=https://your-service.up.railway.app
```

**Replace `your-service.up.railway.app` with your actual Railway URL!**

### 2.4 Deploy
1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Vercel gives you a URL like: `https://your-project.vercel.app`

### 2.5 Test Frontend
1. Open your Vercel URL
2. Enter:
   - Repository URL: `https://github.com/your-org/test-repo`
   - Team Name: `RIFT ORGANISERS`
   - Team Leader: `Saiyam Kumar`
3. Click **Run Agent**
4. Verify dashboard shows results from backend

---

## 🔍 Step 3: Verify End-to-End

### Test Checklist
- [ ] Frontend loads on Vercel URL
- [ ] Input form accepts repo URL + team details
- [ ] "Run Agent" button triggers backend
- [ ] Loading indicator shows while running
- [ ] Dashboard displays:
  - [ ] Run Summary Card
  - [ ] Score Breakdown Panel
  - [ ] Fixes Applied Table
  - [ ] CI/CD Status Timeline

### Debugging Tips
- **Backend logs**: Railway → Service → **Logs** tab
- **Frontend logs**: Browser DevTools → Console
- **CORS errors**: Ensure `CORS_ORIGINS` in Railway includes your Vercel domain
- **API not found**: Check `VITE_API_BASE_URL` in Vercel env vars

---

## 📝 Step 4: Update README.md

Add to your repository README:

```markdown
## 🚀 Live Deployment

- **Frontend Dashboard**: [Your Vercel URL]
- **Backend API**: [Your Railway URL]

## 📹 Demo Video

[LinkedIn post URL with @RIFT2026 tag]

## 🏗️ Architecture

[Add architecture diagram]

## 🛠️ Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
```

---

## 🎯 Quick Commands Reference

### Local Development
```bash
# Backend
cd agent
yarn install
yarn dev

# Frontend (new terminal)
cd frontend
yarn install
yarn dev
```

### Production Builds
```bash
# Backend
cd agent
yarn build
yarn start

# Frontend
cd frontend
yarn build
# Output: frontend/dist/
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Railway PORT**: Backend reads `process.env.PORT` (Railway sets this automatically)
3. **CORS**: Backend allows all origins (`CORS_ORIGINS=*`) - restrict in production
4. **GitHub Token**: Needs `repo` scope for private repos, `public_repo` for public
5. **Results.json**: Written to `agent/results.json` on each run

---

## 🆘 Troubleshooting

### Backend won't start on Railway
- Check **Root Directory** is set to `agent`
- Verify `yarn start` command runs `node dist/index.js`
- Check Railway logs for errors

### Frontend can't reach backend
- Verify `VITE_API_BASE_URL` in Vercel matches Railway URL exactly
- Check CORS settings in backend
- Test backend URL directly: `curl https://your-backend.up.railway.app/api/status`

### Build fails
- Ensure `package.json` has correct `build` and `start` scripts
- Check Node version compatibility (Railway uses Node 18+)

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] Backend endpoints tested (`/api/run-agent`, `/api/status`, `/api/results`)
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] End-to-end test successful
- [ ] README updated with live URLs
- [ ] LinkedIn demo video posted

---

**🎉 You're ready for submission!**
