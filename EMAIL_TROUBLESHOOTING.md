# Email Configuration Troubleshooting Guide

## If Emails Are Still Not Working

### Step 1: Check Server Logs on Startup
When you start your server, look for these messages:
```
✓ Email service ready and authenticated
```

If you see an error instead:
```
❌ Email service connection error:
Troubleshooting tips:
1. Check GMAIL_USER and GMAIL_PASSWORD in .env file
2. Ensure you are using an app-specific password
3. Enable "Less secure app access" in Gmail settings if needed
```

### Step 2: Verify .env Configuration
Make sure your `.env` file has:
```
GMAIL_USER=your_actual_email@gmail.com
GMAIL_PASSWORD=your_app_specific_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**DO NOT** forget the `GMAIL_PASSWORD` - it's required for email to work!

### Step 3: Use Gmail App-Specific Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer (or your device)"
3. Generate a password - you'll get a 16-character password
4. Copy this password to `.env` as `GMAIL_PASSWORD`
5. Use ONLY the password without spaces

**Common Mistake:** Using your regular Gmail password instead of the app-specific password

### Step 4: Check Confirmation Emails Are Being Sent
When a booking is confirmed, check the server console for:
```
✓ Booking confirmation email sent to: user@example.com
  Message ID: <xyz@mail.gmail.com>
```

Or check for errors:
```
✗ Error sending booking confirmation email to: user@example.com
  Error message: [error details]
  Error code: [code]
  SMTP response: [response]
```

### Step 5: Verify Email in UI
After confirming a booking, you should see either:
- "Booking confirmed! Confirmation email sent." ✓
- OR "Booking confirmed! (Email could not be sent - check configuration)" ⚠️

If you see the second message, your server logs will have details about the email error.

---

## How to Test Email Manually

1. In your Node.js backend, you can test email directly:

```javascript
const { sendBookingConfirmation } = require("./utils/emailService");

// Test sending an email
const result = await sendBookingConfirmation({
  to: "your_test_email@gmail.com",
  username: "Test User",
  listing: {
    title: "Test Property",
    location: "Test City"
  },
  booking: {
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 86400000),
    guests: 2,
    totalPrice: 5000,
    _id: "test123"
  },
  paid: false
});

console.log(result);
```

---

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "invalid login" error | Use app-specific password, not regular Gmail password |
| "Invalid SMTP credentials" | Check GMAIL_USER and GMAIL_PASSWORD in .env |
| "getaddrinfo ENOTFOUND smtp.gmail.com" | Check internet connection or firewall blocking port 587 |
| Error code 534 | Enable "Less secure apps" or use app-specific password |
| Silent failure (no logs) | Check that `GMAIL_PASSWORD` is not empty in .env |
| Email sent but user doesn't receive it | Check spam folder, or verify email address is not a test domain |

---

## Quick Fix Checklist

- [ ] .env file has GMAIL_PASSWORD filled in
- [ ] GMAIL_PASSWORD is an app-specific password (16 chars)
- [ ] Server shows "Email service ready" on startup
- [ ] Booking confirmation shows email status in success message
- [ ] Server console shows email logs (not errors)
- [ ] User receives confirmation email in inbox (check spam folder!)

---

## If All Else Fails

You can temporarily disable email validation while testing by modifying the relevant controller response:

In `controllers/bookings.js`, the confirmBooking function will still show success even if email fails. The booking is confirmed in the database regardless of email delivery.

You can track email issues separately through server logs and fix the GMAIL configuration independently.
