# Boutique Application Submission & Admin Review Guide

## Overview

This guide explains how the boutique partnership application system works and where admins can view submitted applications.

## How Boutique Applications Are Submitted

### 1. Frontend Form (Vendor/Partner Registration)

**URL**: `https://yoursite.com/vendor/register`

**Form Location**: `/frontend/src/app/vendor/register/page.tsx`

The form collects:
- **Business Details**: Boutique name, Owner name, Category, GST Number
- **Contact & Location**: Email, Phone, Address, City, District, State, Pincode
- **Online Presence**: Website, Instagram, Facebook, Business Description
- **Media & Security**: Profile Logo (required), Cover Image (required), Password, Confirm Password

**Required Fields**:
- Boutique Name *
- Owner Name *
- Email *
- Phone *
- Category *
- City *
- District *
- State *
- Pincode *
- Instagram *
- Business Description *
- Profile Logo (image file) *
- Cover Image (image file) *
- Password *
- Confirm Password *
- Terms & Privacy checkbox *

### 2. Backend API Endpoint

**POST** `/api/auth/signup`

**Form Data Fields**:
- `account_type`: "partner"
- All form fields as multipart/form-data
- Files: `logo`, `cover` (both required)

**Files Required**:
- `logo`: Image file for business logo (1:1 ratio recommended)
- `cover`: Image file for cover/hero image (16:9 ratio recommended)

**Validation**:
- All required fields must be present
- At least one image file must be provided
- Password and confirm password must match
- Email and phone must be unique

**Response on Success** (HTTP 201):
```json
{
  "success": true,
  "role": "partner",
  "boutiqueId": 123,
  "message": "Boutique account created. Verification email sent.",
  "email": {
    "sent": true,
    "messageId": "...",
    "method": "resend",
    "is_test": false
  }
}
```

**Response on Error** (HTTP 400/409/500):
```json
{
  "message": "Error description",
  "error": "Detailed error"
}
```

Common errors:
- `"Required partner fields missing"` - Missing required field
- `"Showcase or logo image required"` - No image files provided
- `"This email is already registered"` - Email already in use
- `"This mobile number is already registered"` - Phone already in use
- `"A boutique with this name is already listed"` - Business name already exists

### 3. Application Storage

Applications are stored in the Supabase `boutiques` table with:
- `id`: Auto-generated ID
- `boutique_name`: Business name
- `owner_name`: Owner/contact name
- `email`: Business email
- `phone`: Contact phone
- `city`, `district`, `state`, `pincode`: Location
- `address`: Business address
- `category`: Vendor category
- `plan`: Set to "early_partner"
- `is_verified`: FALSE (awaiting email verification)
- `verification_token`: Token for email verification link
- `created_at`: Application submission timestamp
- `logo_url`: URL to uploaded logo
- `cover_url`: URL to uploaded cover image
- `password_hash`: Hashed password for login

## Verification Process

### 1. Email Verification

After submission, a verification email is sent to the applicant's email address containing:
- Link to verify their account
- Verification token
- Instructions to complete registration

**Email Link Format**:
```
https://backend.example.com/api/auth/verify-email?token=<UUID>&type=partner
```

### 2. Verification in Database

Once verified:
- `is_verified`: Changed from FALSE to TRUE
- `verification_token`: Set to NULL
- Account is now active and can login

## Admin Dashboard

### Accessing the Admin Dashboard

1. Go to: `https://yoursite.com/admin.html` (or `public/admin.html` in development)
2. Enter admin credentials:
   - Email: (configured in backend)
   - Password: (configured in backend)
3. You'll see the dashboard with real-time metrics

### Viewing Applications

The admin dashboard now has a dedicated section: **Pending Applications**

#### Location in Dashboard

1. **Top Section**: Shows metrics for Total Users, Partner Boutiques, Total Products
2. **Recent Registrations**: Shows newly registered users
3. **Pending Applications** (NEW): Shows boutiques awaiting email verification
4. **New Partnerships**: Shows verified, active boutiques
5. **Payment Verification**: Shows payment proof submissions
6. **Service Enquiries**: Shows customer enquiries

#### Pending Applications Section

**Columns**:
- **Boutique**: Business name, Owner name, Email, Phone
- **Submitted**: Category, Application date
- **Status**: Shows "Awaiting Verification" in yellow badge

**Count Badge**: Shows number of pending applications (e.g., "5 Pending")

**What It Shows**:
- All boutiques where `is_verified = FALSE`
- Newest applications first
- Application submission date
- Category selected by boutique

### New Partnerships Section

**Columns**:
- **Boutique**: Business name, Owner name, Contact details, Plan type
- **Origin**: Location (city/area/district), Partner ID
- **Manage**: Remove button

**What It Shows**:
- All verified boutiques where `is_verified = TRUE`
- Active partners with completed verification
- Plan tier information
- Subscription status

## Backend API Endpoints

### Admin Analytics Endpoint

**GET** `/api/admin/analytics`

Returns metrics and lists:
- `metrics`: { totalUsers, totalBoutiques, totalProducts }
- `recentUsers`: Last 1000 users
- `recentBoutiques`: Last 10 VERIFIED boutiques

**Note**: This endpoint only returns verified boutiques. The admin dashboard separately queries all boutiques to display pending applications.

### Boutiques Endpoint

**GET** `/api/boutiques`

Returns all boutiques (both verified and unverified):
- Includes pending applications
- Includes verified partnerships
- Sorted by plan tier and priority

**Query Parameters**:
- `city`: Filter by city
- `limit`: Maximum results (default 100)

## Troubleshooting

### Application Not Appearing

1. **Check form submission**:
   - Verify all required fields are filled
   - Check browser console for errors: `F12 > Console`
   - Look for submission logs starting with `[Vendor Register]`

2. **Check API response**:
   - Open Network tab in browser DevTools
   - Look for POST request to `/api/auth/signup`
   - Check response status and message

3. **Check database**:
   - Login to Supabase dashboard
   - Go to `Tables > boutiques`
   - Search by email to find the application
   - Verify `is_verified` field is FALSE

4. **Check email verification**:
   - Application might be created but not showing in admin dashboard
   - Admin dashboard shows both verified and unverified in "Pending Applications"
   - Check if verification email was sent

### Application Not Visible in Admin Dashboard

1. **Refresh the dashboard**: Press F5
2. **Clear browser cache**: Ctrl+Shift+Delete
3. **Check pending count badge**: Should show number > 0
4. **Verify admin token**: Check localStorage for `adminToken`

### File Upload Issues

1. **Logo/Cover images not uploading**:
   - Check file size (must be less than 10MB)
   - Check file format (JPEG, PNG, or WebP)
   - Check browser console for upload errors

2. **Images not displaying in database**:
   - Check storage service (Cloudinary/Supabase)
   - Verify URLs are accessible
   - Check file permissions

## Email Verification

### When Verification Email Fails

If verification email fails to send:
1. Admin dashboard will still show the application as created
2. A message appears: "Account created but verification email failed"
3. A direct verification link is provided as fallback
4. Applicant can click the link to verify manually

### Resending Verification Email

**POST** `/api/auth/resend-verification`

**Request**:
```json
{
  "email": "business@example.com"
}
```

**Response**:
```json
{
  "message": "Verification email sent",
  "email": { "sent": true, ... }
}
```

## Database Schema

### Boutiques Table

```sql
CREATE TABLE boutiques (
  id BIGINT PRIMARY KEY,
  boutique_name VARCHAR(255),
  owner_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  city VARCHAR(255),
  district VARCHAR(255),
  state VARCHAR(255),
  pincode VARCHAR(10),
  address VARCHAR(500),
  category VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'early_partner',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  password_hash VARCHAR(255),
  logo_url VARCHAR(500),
  cover_url VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Security Notes

1. **Passwords**: Stored as bcrypt hashes, never in plain text
2. **Verification Token**: Unique UUID, expires after email verification
3. **Admin Access**: Protected by admin token authentication
4. **File Uploads**: Validated by file type and size on both frontend and backend
5. **API Endpoints**: Protected by CORS and authentication middleware

## Next Steps After Application

1. **Applicant receives verification email**
2. **Applicant clicks verification link**
3. **Account marked as verified in database**
4. **Applicant can login at `/vendor/login`**
5. **Boutique appears in "New Partnerships" section**
6. **Boutique can now upload products and manage profile**

## Support

If applications are not submitting:
1. Check browser console for client errors
2. Check backend logs for server errors
3. Verify database connection in Supabase
4. Verify all required fields are present in form
5. Check file upload permissions

For further debugging, enable verbose logging in:
- Frontend: Browser DevTools Console
- Backend: Server logs/error output
