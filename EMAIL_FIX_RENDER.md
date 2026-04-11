# 🔧 EMAIL CONFIGURATION FIX FOR RENDER

## ✅ VERIFIED: Email Works Locally

All email tests passed:
- ✅ Simple test email sent to subhrajit578mohanty@gmail.com
- ✅ Booking confirmation email sent successfully
- ✅ All environment variables configured

## ❌ ISSUE: Email Fails on Render

**Symptom:** "Booking confirmed successfully! (Email could not be sent)"

**Root Cause:** GMAIL_USER and GMAIL_PASSWORD not set in Render environment

## 🔐 FIX: Add Email Environment Variables to Render

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Sign in with your account
3. Find service: **wander-lust-project-ezj2**

### Step 2: Navigate to Environment Settings
1. Click on the service name
2. Click **"Environment"** tab (left sidebar)
3. You'll see a list of environment variables

### Step 3: Add the Following Variables

Copy and paste these exact values:

```
GMAIL_USER = mohantysubhrajit22@gmail.com
GMAIL_PASSWORD = nipuiksiwypwvlbd
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
```

**Other required variables (should already exist):**
- ATLASDB_URL
- SECRET
- CLOUD_NAME
- CLOUD_API_KEY
- MAP_TOKEN
- PORT (should be 8000 if not set)

### Step 4: Deploy
1. After adding variables, click **"Save Changes"**
2. Render will automatically redeploy your app (1-2 minutes)
3. You'll see a message: "✓ Email service ready and authenticated" in logs

## 📧 Verify It Works

After deployment:
1. Create a new booking
2. Confirm the booking
3. **Check your inbox** (both Gmail and Spam folder)
4. You should receive the booking confirmation email

## 🚨 If Emails Still Don't Work

If after adding variables emails still fail, check Render logs:
1. In Render dashboard, click **"Logs"** tab
2. Look for error message like:
   - `✅ [EMAIL] Accepted by SMTP server` = Working ✅
   - `❌ [EMAIL] SMTP Error` = Check credentials
   - `Error: connect ECONNREFUSED` = Network blocked

## 📋 Current Configuration (Local - Reference Only)

```
GMAIL_USER=mohantysubhrajit22@gmail.com
GMAIL_PASSWORD=nipuiksiwypwvlbd
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**NOTE:** This is Gmail's app-specific password (16 characters), not your regular password.

## ✨ Testing Script

Run locally to verify email configuration:
```bash
node test-email.js          # Simple test
node test-booking-email.js  # Booking confirmation test
node check-env.js           # Check environment variables
```

---

**Status:** Waiting for you to configure Render environment variables.
