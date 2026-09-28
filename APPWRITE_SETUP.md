# Appwrite Setup Guide for MyTrackYo

MyTrackYo uses Appwrite Cloud or self-hosted Appwrite for authentication and persistent cloud storage.

## Environment Variables

Configure the following in your `.env` file or deployment environment (e.g., Vercel):

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

## Required Collections

Create a Database with ID matching `VITE_APPWRITE_DB_ID`, containing the following 8 collections:

### 1. `properties`
- **Attributes**:
  - `name` (string, required)
  - `property_type` (string, required)
  - `location` (string, required)
  - `address` (string, required)
  - `city` (string, required)
  - `state` (string, required)
  - `pincode` (string, required)
  - `phone` (string, required)
  - `email` (string, required)
  - `gstin` (string, optional)
  - `check_in_time` (string, required)
  - `check_out_time` (string, required)
  - `description` (string, optional)
  - `active` (boolean, required, default: true)
  - `created_at` (string, required)

### 2. `units`
- **Attributes**:
  - `property_id` (string, required)
  - `number` (string, required)
  - `unit_type` (string, required)
  - `floor` (string, optional)
  - `capacity` (integer, optional)
  - `status` (string, required, 'active' | 'inactive')
  - `sort_order` (integer, optional)
  - `created_at` (string, required)
- **Indexes**:
  - `idx_unit_prop` (key: `property_id`, order: ASC)

### 3. `unit_blocks`
- **Attributes**:
  - `unit_id` (string, required)
  - `property_id` (string, required)
  - `start_date` (string, required, YYYY-MM-DD)
  - `end_date` (string, required, YYYY-MM-DD)
  - `reason` (string, required, 'Maintenance' | 'Other')
  - `note` (string, optional)
  - `created_at` (string, required)
- **Indexes**:
  - `idx_block_unit` (key: `unit_id`, order: ASC)
  - `idx_block_prop` (key: `property_id`, order: ASC)

### 4. `customers`
- **Attributes**:
  - `name` (string, required)
  - `phone` (string, required)
  - `email` (string, optional)
  - `created_at` (string, required)

### 5. `bookings`
- **Attributes**:
  - `booking_no` (string, required)
  - `customer_id` (string, required)
  - `property_id` (string, required)
  - `unit_id` (string, optional)
  - `check_in` (string, required, YYYY-MM-DD)
  - `check_out` (string, required, YYYY-MM-DD)
  - `nights` (integer, required)
  - `rooms` (integer, required)
  - `guests` (integer, required)
  - `room_type` (string, required)
  - `room_number` (string, optional)
  - `notes` (string, optional)
  - `base_amount` (float, required)
  - `tax_enabled` (boolean, required)
  - `tax_rate` (float, required)
  - `tax_amount` (float, required)
  - `grand_total` (float, required)
  - `booking_status` (string, required, 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled')
  - `payment_status` (string, required, 'Unpaid' | 'Partially Paid' | 'Paid')
  - `created_at` (string, required)
- **Indexes**:
  - `idx_booking_prop_checkin` (keys: `property_id` ASC, `check_in` ASC)

### 6. `payments`
- **Attributes**:
  - `payment_no` (string, required)
  - `booking_id` (string, required)
  - `date` (string, required, YYYY-MM-DD)
  - `amount` (float, required)
  - `method` (string, required)
  - `ref_id` (string, optional)
  - `purpose` (string, optional)
  - `status` (string, required, 'Recorded' | 'Completed' | 'Refunded')
  - `created_at` (string, required)
- **Indexes**:
  - `idx_payment_booking_date` (keys: `booking_id` ASC, `date` ASC)

### 7. `notifications`
- **Attributes**:
  - `booking_id` (string, required)
  - `customer_id` (string, required)
  - `channel` (string, required)
  - `type` (string, required)
  - `recipient` (string, required)
  - `status` (string, required)
  - `created_at` (string, required)

### 8. `settings`
- **Attributes**:
  - `name` (string, required)
  - `legalName` (string, required)
  - `gstin` (string, optional)
