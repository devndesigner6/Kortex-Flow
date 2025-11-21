# OAuth Redirect URI Update

Your app is deployed at: **https://kortexflow-1098890500978.us-central1.run.app**

## Update Google OAuth Settings

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials?project=build-marathon-project)

2. Click on your OAuth 2.0 Client ID: `320930174032-t39bbq5prntbvlqn2ispejqmkeecosje.apps.googleusercontent.com`

3. Add these **Authorized redirect URIs**:
   ```
   https://kortexflow-1098890500978.us-central1.run.app/api/gmail/callback
   https://kortexflow-1098890500978.us-central1.run.app/api/calendar/callback
   ```

4. Click **Save**

## Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/project/kortexflow-1a7e5/authentication/settings)

2. Scroll to **Authorized domains**

3. Click **Add domain**

4. Add: `kortexflow-1098890500978.us-central1.run.app`

5. Click **Add**

## Create Firestore Composite Index

Click this link to create the required index:
https://console.firebase.google.com/v1/r/project/kortexflow-1a7e5/firestore/indexes?create_composite=Cldwcm9qZWN0cy9rb3J0ZXhmbG93LTFhN2U1L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9lbWFpbHMvaW5kZXhlcy9fEAEaCgZ1c2VySWQQARoHc3luY2VkEAEaCgoGdGhyZWFkGAE

After completing these steps, your app will be fully functional!

## Test Your Deployment

Visit: https://kortexflow-1098890500978.us-central1.run.app

Test:
- [ ] Homepage loads
- [ ] Sign up/Login works
- [ ] Gmail OAuth connection
- [ ] Calendar OAuth connection
- [ ] Email sync
- [ ] AI task extraction
- [ ] AI reply generation
