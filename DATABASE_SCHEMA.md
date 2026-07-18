# Cloche 2.0 Database Schema Update (Phase 9)

## Existing Schema Reused
- `users`: Core customer authentication.
- `boutiques`: Core vendor profiles and authentication.
- `products`: Core dress/apparel catalog.
- `product_images`: Collection galleries.
- `leads`: Enquiry submissions CRM.
- `conversations` & `messages`: Direct messaging.

## New Tables Required

To support the production features of Cloche 2.0, the following tables must be executed in Supabase via the provided `database_schema.sql` file.

### 1. wishlists
- `id` (PK)
- `user_id` (FK -> users.id)
- `product_id` (FK -> products.id)
- `created_at`

### 2. appointments
- `id` (PK)
- `user_id` (FK -> users.id)
- `boutique_id` (FK -> boutiques.id)
- `appointment_date` (DATE)
- `appointment_time` (TIME)
- `status` (pending, confirmed, cancelled, completed)
- `notes` (TEXT)

### 3. content_articles
- `id` (PK)
- `slug` (UNIQUE VARCHAR)
- `title`
- `excerpt`
- `content` (HTML/Markdown TEXT)
- `author`
- `category` (Bridal Guide, Inspiration, etc.)
- `image_url`

### 4. real_weddings
- `id` (PK)
- `slug` (UNIQUE VARCHAR)
- `couple_name`
- `title`
- `description`
- `wedding_date`
- `location`
- `venue_id` (FK -> boutiques.id)
- `photographer_id` (FK -> boutiques.id)
- `gallery_urls` (TEXT ARRAY)

### 5. homepage_sections
- `id` (PK)
- `section_type` (hero, trending, testimonials)
- `title`
- `content` (JSONB)
- `sort_order`
- `is_active`

### 6. newsletter_subscribers
- `id` (PK)
- `email` (UNIQUE VARCHAR)
- `status` (active, unsubscribed)

### 7. notifications
- `id` (PK)
- `user_id` (FK -> users.id)
- `boutique_id` (FK -> boutiques.id)
- `title`
- `message`
- `type`
- `is_read` (BOOLEAN)
