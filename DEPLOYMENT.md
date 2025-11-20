# Google Cloud Run Deployment Guide for KortexFlow

## Prerequisites

1. **Install Google Cloud SDK**
   - Download from: https://cloud.google.com/sdk/docs/install
   - Windows: Download GoogleCloudSDKInstaller.exe
   - After installation, restart PowerShell

2. **Enable Required APIs**
   ```powershell
   gcloud auth login
   gcloud config set project kortexflow-1a7e5
   
   # Enable required services
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## Deployment Steps

### Method 1: Using PowerShell Script (Windows)

```powershell
# Run the deployment script
.\deploy.ps1
```

### Method 2: Manual Deployment

1. **Build Docker Image**
   ```powershell
   gcloud builds submit --tag gcr.io/kortexflow-1a7e5/kortexflow --project kortexflow-1a7e5
   ```

2. **Deploy to Cloud Run**
   ```powershell
   gcloud run deploy kortexflow `
     --image gcr.io/kortexflow-1a7e5/kortexflow `
     --platform managed `
     --region us-central1 `
     --allow-unauthenticated `
     --memory 1Gi `
     --cpu 1 `
     --timeout 60 `
     --max-instances 10 `
     --project kortexflow-1a7e5 `
     --set-env-vars-file .env.cloud
   ```

3. **Create .env.cloud file** (copy from .env.local but use production URLs)
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDlKY6ueOdWjCAq30c26YG_5Z3AUpd2m7s
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kortexflow-1a7e5.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=kortexflow-1a7e5
   # ... add all other env vars
   ```

## After Deployment

1. **Get your Cloud Run URL**
   ```powershell
   gcloud run services describe kortexflow --platform managed --region us-central1 --format 'value(status.url)' --project kortexflow-1a7e5
   ```

2. **Update OAuth Redirect URIs**
   - Go to Google Cloud Console > APIs & Credentials
   - Add your Cloud Run URL to authorized redirect URIs:
     - `https://YOUR-CLOUD-RUN-URL.run.app/api/gmail/callback`
     - `https://YOUR-CLOUD-RUN-URL.run.app/api/calendar/callback`

3. **Update Firebase Auth Domains**
   - Go to Firebase Console > Authentication > Settings
   - Add your Cloud Run domain to authorized domains

## Estimated Costs

- **Cloud Run**: ~$0-5/month (free tier includes 2M requests)
- **Cloud Build**: First 120 builds/day free
- **Container Registry**: First 0.5 GB free

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Docker can build locally: `docker build -t test .`

### Deployment Fails
- Verify all environment variables are set
- Check Cloud Run logs: `gcloud run services logs read kortexflow --project kortexflow-1a7e5`

### App Not Loading
- Verify environment variables are correct
- Check that Firebase service account key is properly formatted
- Review Cloud Run logs for errors

## Alternative: Quick Deploy with Firebase Hosting + Cloud Functions

If Cloud Run setup is too complex, you can use Firebase Hosting:

```powershell
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

This is simpler but won't give you the "Cloud Run" points for assessment.
