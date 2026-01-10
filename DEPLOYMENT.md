# Deployment Guide for Knitting Pattern Generator

This guide will help you deploy the Knitting Pattern Generator to Vercel so your mother can test it from any device.

## Prerequisites

- GitHub account
- Vercel account (free - sign up at [vercel.com](https://vercel.com))
- Your code committed to a Git repository

## Step-by-Step Deployment

### Step 1: Push to GitHub

1. Initialize git (if not already done):
```bash
cd knitting-pattern-generator
git init
git add .
git commit -m "Initial commit: Knitting Pattern Generator MVP"
```

2. Create a new repository on GitHub:
   - Go to github.com
   - Click "New repository"
   - Name it "knitting-pattern-generator"
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR-USERNAME/knitting-pattern-generator.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository:
   - Find "knitting-pattern-generator"
   - Click "Import"
5. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
6. Click "Deploy"
7. Wait 2-3 minutes for deployment to complete
8. Get your URL! It will be something like:
   `https://knitting-pattern-generator-xxxxx.vercel.app`

#### Option B: Vercel CLI (Alternative)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Answer prompts:
   - Set up and deploy? **Y**
   - Which scope? (Choose your account)
   - Link to existing project? **N**
   - What's your project's name? **knitting-pattern-generator**
   - In which directory is your code? **./**
   - Want to override settings? **N**

5. Production deployment:
```bash
vercel --prod
```

## After Deployment

### Get Your URL

Your app will be deployed to a URL like:
- `https://knitting-pattern-generator.vercel.app`
- Or custom: `https://your-custom-name.vercel.app`

### Share with Your Mother

1. Send her the URL
2. She can access it from any device (phone, tablet, computer)
3. No installation needed - just open the link

### Setup Custom Domain (Optional)

1. In Vercel dashboard:
   - Click your project
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Automatic Updates

Once connected to GitHub, Vercel will automatically:
- Deploy when you push to main branch
- Create preview deployments for pull requests
- Run builds and tests

To update your deployed app:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically deploy the new version in ~2 minutes.

## Monitoring and Analytics

### View Deployment Logs

1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click any deployment to see logs

### Analytics (Optional)

Vercel provides free analytics:
1. Go to project settings
2. Enable "Analytics"
3. View traffic, page views, and performance

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Common issues:
   - TypeScript errors: Run `npm run build` locally to test
   - Missing dependencies: Check package.json
   - Environment variables: Add in Vercel settings

### Environment Variables

If you need environment variables:
1. Go to project settings
2. Click "Environment Variables"
3. Add variables for Production, Preview, and Development

### Performance Issues

If the app is slow:
1. Check Vercel Analytics for bottlenecks
2. Consider upgrading Vercel plan (likely not needed for testing)
3. Optimize images and assets

## Testing Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Can upload images
- [ ] Chart generation works
- [ ] All three garment types work
- [ ] Pattern download works
- [ ] Works on mobile devices
- [ ] Works on different browsers (Chrome, Safari, Firefox)

## Cost

Vercel Free Tier includes:
- 100 GB bandwidth/month
- 100 deployments/day
- Automatic HTTPS
- DDoS protection

This is more than enough for testing with your mother and initial users.

## Getting Help

If something goes wrong:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check build logs in Vercel dashboard
3. Test locally first: `npm run build` and `npm start`

## Next Steps

Once deployed and tested:
1. Collect feedback from your mother
2. Make improvements
3. Push updates (auto-deploys)
4. When ready to launch:
   - Consider custom domain
   - Set up analytics
   - Prepare marketing materials

---

Your app is now live and ready for testing!
