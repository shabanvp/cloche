# Database Setup Instructions

## Overview
The CLOCHE backend requires two main tables for enquiry tracking: `enquiries` and `leads`.

## Setup Steps

### 1. Execute SQL Migrations

Run the SQL scripts in your Supabase database in the following order:

#### Create Messages Tables (if not already done)
```bash
# Execute: cloche-backend/create_messages_tables.sql
```

#### Create Enquiries and Leads Tables
```bash
# Execute: cloche-backend/create_enquiries_tables.sql
```

### 2. Via Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the contents of `create_enquiries_tables.sql`
5. Click "Run"
6. Verify the tables are created by checking the "Tables" section in the left sidebar

### 3. Verify Installation

Check that both tables exist with correct columns:

```sql
-- Check enquiries table
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'enquiries';

-- Check leads table  
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'leads';
```

## Table Schemas

### Enquiries Table
Stores direct enquiries from the web form before distribution to boutiques.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | Primary key |
| name | VARCHAR(255) | Enquirer's name |
| email | VARCHAR(255) | Enquirer's email |
| phone | VARCHAR(20) | Enquirer's phone (required) |
| wedding_date | DATE | Wedding date |
| preferred_location | VARCHAR(255) | Preferred wedding location |
| requirement | TEXT | What they're looking for (e.g., "Bridal Lehenga") |
| special_requirement | TEXT | Additional notes/preferences |
| status | VARCHAR(50) | PENDING / COMPLETED / ARCHIVED |
| source | VARCHAR(50) | web_enquiry / admin |
| created_at | TIMESTAMP | Enquiry submission timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

### Leads Table
Stores boutique-specific leads after enquiries are distributed.

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL | Primary key |
| boutique_id | INTEGER | Boutique this lead is assigned to |
| name | VARCHAR(255) | Lead contact name |
| email | VARCHAR(255) | Lead contact email |
| phone | VARCHAR(20) | Lead contact phone |
| wedding_date | DATE | Wedding date |
| date | DATE | Fallback date field |
| preferred_location | VARCHAR(255) | Wedding location |
| location | VARCHAR(255) | Fallback location field |
| category | VARCHAR(255) | Lead category (from requirement) |
| requirement | TEXT | What they're looking for |
| special_requirement | TEXT | Special notes |
| notes | TEXT | Fallback notes field |
| status | VARCHAR(50) | NEW / CONTACTED / CONVERTED / CLOSED |
| source | VARCHAR(50) | web_enquiry / admin / manual |
| created_at | TIMESTAMP | Lead creation timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

## Troubleshooting

### Error: "Failed to submit enquiry"

1. **Check tables exist**: Verify enquiries and leads tables are created
2. **Check permissions**: Ensure service role has INSERT permissions on both tables
3. **Check backend logs**: Look for error messages indicating which field is causing issues
4. **Check form values**: Ensure required fields (name, phone, wedding_date, city_location) are filled

### No boutiques matched
- Verify boutiques exist in the `boutiques` table
- Verify selected location matches a boutique's location
- Check `boutique_showcase` table for area/district information

## Environment Variables

Ensure these are set in `.env`:
```
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

## Testing the Endpoint

```bash
curl -X POST http://localhost:5001/api/leads/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "mobileNumber": "+919876543210",
    "weddingDate": "2025-06-15",
    "cityLocation": "Kozhikode City, Kozhikode",
    "requirement": "Bridal Lehenga",
    "specialRequirement": "Custom sizing",
    "email": "test@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "enquiryId": 1,
  "message": "Enquiry submitted successfully. Admin will forward it to matching boutiques."
}
```
