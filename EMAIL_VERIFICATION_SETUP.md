# 📧 Email Verification Setup Guide for KortexFlow

## ✅ Changes Made to Fix Email Verification

I've updated your application with the following fixes:

1. **Created Auth Callback Route** (`/app/auth/callback/route.ts`)
   - Handles email verification links from Supabase
   - Automatically logs users in after email confirmation

2. **Updated Signup Page**
   - Now uses correct redirect URL: `http://localhost:3000/auth/callback?next=/dashboard`

3. **Enhanced Verify Page**
   - Added "Resend Verification Email" button
   - Better instructions for users
   - Link to go back to login

4. **Improved Login Page**
   - Shows specific error message for unverified emails
   - Better error handling

5. **Updated Environment Variables**
   - Added `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

---

## 🔧 Supabase Dashboard Configuration Required

You need to configure email settings in your Supabase dashboard. Follow these steps:

### Step 1: Configure Email Auth Settings

1. Go to: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/auth/providers
2. Scroll to **Email** provider
3. Make sure the following settings are enabled:
   - ✅ **Enable email provider**
   - ✅ **Confirm email** (REQUIRED for email verification)
   - ✅ **Enable email confirmations**

### Step 2: Configure Email Templates

1. Go to: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/auth/templates
2. Select **Confirm signup** template
3. Update the confirmation URL to:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
   ```

### Step 3: Set Site URL

1. Go to: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/settings/auth
2. Under **Site URL**, set to:
   ```
   http://localhost:3000
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   ```

### Step 4: Configure Email Settings (Optional but Recommended)

1. Go to: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/settings/auth
2. Scroll to **SMTP Settings**
3. By default, Supabase uses their email service (limited to 3 emails per hour for free tier)
4. For production, consider setting up custom SMTP (Gmail, SendGrid, etc.)

---

## 🧪 Testing Email Verification

After configuring Supabase:

1. **Restart your dev server** (it should auto-reload, but restart if needed)
2. **Go to**: http://localhost:3000/auth/signup
3. **Sign up** with a real email address
4. **Check your inbox** (and spam folder)
5. **Click the verification link** in the email
6. You should be redirected to the dashboard automatically

---

## 🚨 Common Issues & Solutions

### Issue: "Email not confirmed" error when logging in
**Solution**: The user hasn't clicked the verification link yet. They need to:
- Check their email inbox (and spam folder)
- Click the verification link
- Or use the "Resend Verification Email" button on the verify page

### Issue: Not receiving verification emails
**Possible causes**:
1. Email is in spam folder
2. Supabase free tier limit (3 emails/hour) reached
3. "Confirm email" setting not enabled in Supabase dashboard
4. Wrong Site URL or Redirect URL configured

**Solution**:
- Check Supabase dashboard Auth settings
- Enable "Confirm email" option
- Verify Site URL is set correctly
- Check Supabase logs: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/logs/auth-logs

### Issue: Verification link doesn't work
**Solution**:
- Make sure callback route exists at `/app/auth/callback/route.ts`
- Verify the email template has the correct token format
- Check browser console for errors

---

## 🎯 Database Setup

Don't forget to run the database schema scripts:

1. Go to: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/editor
2. Run the SQL scripts in order:
   - `scripts/001_create_schema.sql` (creates tables and policies)
   - `scripts/002_add_gmail_tokens.sql` (if exists)
   - `scripts/003_add_calendar_tokens.sql` (if exists)

---

## 📱 Email Template Customization (Optional)

You can customize the verification email in Supabase:

1. Go to **Auth > Email Templates**
2. Edit the **Confirm signup** template
3. Customize the HTML/text to match your brand
4. Use these variables:
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .TokenHash }}` - Verification token
   - `{{ .Email }}` - User's email

---

## ✨ What's Now Working

- ✅ Email verification flow
- ✅ Resend verification email
- ✅ Auto-login after email confirmation
- ✅ Better error messages
- ✅ Proper redirect after verification
- ✅ User-friendly verification page

---

Need help? Check the Supabase docs: https://supabase.com/docs/guides/auth/auth-email
