# MyTrackYo

MyTrackYo is a browser-based property-management workspace for independent hospitality operators.

## Tech stack

- React 19, TypeScript, Vite, Tailwind CSS v4, React Router
- Appwrite Account and Databases SDK (optional, environment-configured)
- Browser-local demo repository when a session is not an Appwrite account
- Lucide icons, Motion, Vitest

## Local setup

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:3000`. Validation commands are `npm run lint`, `npm test`, and `npm run build`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Appwrite values:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

All three values are needed for the database-backed workspace. The code enables Appwrite authentication when endpoint and project are present; the repository then also requires a valid database ID. These are public project configuration values, not API secrets. Never put an Appwrite server API key in a `VITE_` variable or browser bundle.

## Appwrite project setup

1. Create an Appwrite project and copy its **Project ID**.
2. Under **Platforms**, add a Web platform for `localhost` during development and the deployed hostname in production. The platform host must match the browser origin.
3. In **Auth**, enable Email/Password.
4. In **Databases**, create a database and copy its ID. Use the collection IDs below exactly; they are constants in `src/lib/repository/appwrite.ts`.
5. Add every collection attribute with the exact spelling and type shown. Create the indexes listed below and wait for their status to become available.
6. Add the endpoint, project ID, and database ID to `.env.local`, then restart Vite. For deployment, set the same variables in the hosting provider and rebuild.

### Collections and relationships

Appwrite document IDs are `$id`; the repository maps them to the app's `id` field. Reference fields below are strings containing another document's `$id`; Appwrite does not enforce these relationships as foreign keys.

| Collection | Purpose and fields |
| --- | --- |
| `properties` | Property profile: `name`, `property_type`, `location`, `address`, `city`, `state`, `pincode`, `phone`, `email` (required strings); `gstin`, `description` (optional strings); `check_in_time`, `check_out_time` (required strings); `active` (required boolean); `created_at` (required string). |
| `units` | Rooms/units owned by a property: `property_id` (required string → `properties`); `number`, `unit_type`, `status`, `created_at` (required strings); `floor` (optional string); `capacity`, `sort_order` (optional integers). `status` is `active` or `inactive`. |
| `unit_blocks` | Dates a unit is unavailable: `unit_id`, `property_id` (required strings → `units`, `properties`); `start_date`, `end_date`, `reason`, `created_at` (required strings); `note` (optional string). Dates use `YYYY-MM-DD`; `end_date` is exclusive. `reason` is `Maintenance` or `Other`. |
| `customers` | Guest/contact record: `name`, `phone`, `created_at` (required strings); `email` (optional string). |
| `bookings` | Stay record: `booking_no`, `customer_id`, `property_id`, `check_in`, `check_out`, `room_type`, `booking_status`, `payment_status`, `created_at` (required strings); `unit_id`, `room_number`, `notes` (optional strings); `nights`, `rooms`, `guests` (required integers); `base_amount`, `tax_rate`, `tax_amount`, `grand_total` (required floats); `tax_enabled` (required boolean). References: `customer_id` → `customers`, `property_id` → `properties`, optional `unit_id` → `units`. Status strings follow the values in `src/lib/repository/types.ts`. |
| `payments` | Receipt/payment entry: `payment_no`, `booking_id`, `date`, `method`, `status`, `created_at` (required strings); `amount` (required float); `ref_id`, `purpose` (optional strings). `booking_id` → `bookings`. |
| `notifications` | Notification log record: `booking_id`, `customer_id`, `channel`, `type`, `recipient`, `status`, `created_at` (required strings); booking/customer IDs reference their collections. The current UI does not send automated email/SMS/WhatsApp messages. |
| `settings` | Business invoice identity: `name`, `legalName` (required strings); `gstin` (string; keep optional/empty if not set). The repository reads the first document and does not scope settings by user or property. |

Configure string dates/timestamps as strings because that is what the repository sends and queries. Amounts are floats; `tax_enabled` is boolean; counts are integers. No separate users/profiles collection is used. Signup stores `propertyName`, `propertyType`, `unitCount`, and `role` in Appwrite Account preferences; it does **not** create a property document automatically.

### Indexes used by repository queries

Create indexes using the exact attribute names:

- `units`: `sort_order` ascending; composite `property_id` ascending + `sort_order` ascending for property-filtered lists.
- `unit_blocks`: `property_id` ascending.
- `customers`: `created_at` descending.
- `bookings`: `created_at` descending; composite `property_id` ascending + `created_at` descending.
- `payments`: `created_at` descending; composite `booking_id` ascending + `created_at` descending.
- `notifications`: `created_at` descending; composite `booking_id` ascending + `created_at` descending.
- `properties` and `settings`: no indexed query is issued by the current repository.

The optional `getAllPayments(propertyId)` repository path currently filters on a `property_id` payment attribute that is absent from the `Payment` model and schema. The workspace currently calls it without that argument and scopes payments through their booking IDs. Do not add `property_id` to payments just to satisfy the unused path; align that method and model before relying on it.

## Authentication

Login creates an Email/Password session with `account.createEmailPasswordSession`; logout deletes the current session. Password recovery uses Appwrite `createRecovery` and `updateRecovery`, returning to `/reset-password?userId=…&secret=…`. Add the local and production origins under Appwrite's allowed platforms and configure email delivery for recovery/verification messages.

The app can request a verification email to `/verify-email`, but the current page only shows resend/status UI; it does not consume Appwrite's verification callback parameters or enforce verified status. Email verification is therefore not a complete enforced gate. Signup creates an account and session immediately.

## Permissions and current data safety

**Important: the current Appwrite data layer is not user- or tenant-isolated.** Properties and related documents have no `user_id`/owner field, list queries do not filter by authenticated account, and create calls do not set document-level permissions. `property_id` connects workspace records to a property, but does not connect that property to an account. Collection permissions alone cannot provide per-user isolation here.

Use a disposable, single-developer Appwrite project for integration testing. Do not grant broad authenticated read/write access to real customer data or treat this setup as production-ready multi-tenant storage. Before production use, implement and test an ownership model (account ID on each tenant-owned record or an owned-property lookup), scoped queries, and explicit document permissions. The repository's local demo data stays in browser `localStorage`; it is not uploaded to Appwrite.

## Storage

No Appwrite Storage bucket is required. A Storage client is instantiated, but the application does not upload or download files through it. Invoice and receipt PDFs are generated in the browser.

## Deployment

Vercel (`vercel.json`) and Netlify (`netlify.toml`) configs exist. For Vercel, use build command `npm run build` and output directory `dist`. Set the three environment variables in the deployment dashboard and add the deployed hostname as an Appwrite Web platform. The current canonical host is `https://zentrack-gamma.vercel.app`; set `VITE_SITE_URL` if the public domain changes.

## Common issues

- **Auth works, workspace fails:** confirm `VITE_APPWRITE_DB_ID` and all eight collection IDs/attributes exist; auth configuration alone does not configure the database.
- **Invalid origin/CORS:** add the exact local or deployed hostname under Appwrite Platforms; do not include a path.
- **Query/index error:** verify composite index attributes and sort order, and wait until each index is ready.
- **Large collections look incomplete:** Appwrite list calls currently use the default page size; add cursor pagination before using larger workspaces.
- **Permission denied:** inspect collection permissions. Do not solve this by exposing a server API key in frontend code.
- **Reset link fails:** make sure the callback host is an allowed Web platform and that the recovery URL contains `userId` and `secret`.
- **Data appears shared:** this reflects the current unscoped repository behavior; do not use shared production data until tenant ownership and permissions are implemented.
