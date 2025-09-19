# Render Deployment Guide for StuChama Backend

## Issues Fixed
1. ✅ Fixed package.json main field mismatch
2. ✅ Created render.yaml for deployment configuration
3. ✅ Optimized start scripts
4. ✅ Created .env.example file
5. ✅ Updated CORS configuration for production
6. ✅ Added health check endpoint

## Deployment Steps

### 1. Environment Variables Setup
In your Render dashboard, make sure to set these environment variables:

**Required:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `FRONTEND_URL`: Your Netlify frontend URL (e.g., https://your-app.netlify.app)

**Optional (if using Cloudinary for image uploads):**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Optional (if using M-Pesa):**
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- `MPESA_SHORTCODE`

### 2. Render Service Configuration
When creating your web service on Render:

- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Environment**: Node
- **Region**: Oregon (or your preferred region)
- **Plan**: Free (or upgrade as needed)
- **Health Check Path**: `/health`

### 3. Repository Structure
Your repository should be structured with:
```
StuChama/
├── backend/           # Backend code
├── frontend/          # Frontend code
├── render.yaml        # Render configuration
└── README.md
```

### 4. Deployment Options

**Option A: Using render.yaml (Recommended)**
1. Push the render.yaml file to your repository
2. Connect your repository to Render
3. Render will automatically detect the configuration

**Option B: Manual Configuration**
1. Create a new Web Service in Render
2. Connect your repository
3. Set Root Directory to `backend`
4. Configure build and start commands manually

### 5. Testing Your Deployment
After deployment, test these endpoints:
- `GET /health` - Should return health status
- `GET /` - Should return "StuChama backend is running."
- Your API endpoints should work with the Netlify frontend

### 6. Frontend Configuration
Update your Netlify frontend to use the new Render backend URL:
- Replace any localhost URLs with your Render service URL
- Update API base URL in your frontend configuration

### 7. Common Issues and Solutions

**Build Fails:**
- Check that all dependencies are listed in package.json
- Ensure Node.js version compatibility

**Health Check Fails:**
- Verify DATABASE_URL is correctly set
- Check database connectivity

**CORS Issues:**
- Ensure FRONTEND_URL environment variable is set correctly
- Verify the URL matches your Netlify deployment exactly

**Port Issues:**
- Don't hardcode port numbers; use `process.env.PORT || 5000`
- Render automatically assigns a port via environment variable

## Next Steps
1. Push these changes to your repository
2. Deploy to Render using the configuration provided
3. Update your Netlify frontend to point to the new backend URL
4. Test the full application flow

## Support
If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Test health check endpoint: `https://your-service.onrender.com/health`