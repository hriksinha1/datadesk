# MyTrackYo

A modern, front-desk-focused Property Management System (PMS) designed for independent hotels, homestays, resorts, hostels, and multi-property hospitality operators.

## Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7.
- **Backend / Auth**: Appwrite Cloud or self-hosted Appwrite.
- **Offline / Sample Workspace**: Built-in self-consistent Demo Repository with relative date seeding and local persistence.
- **Deployment**: Zero-config Single-Page Application (SPA) deployment on **Vercel**.

## Environment Configuration

Configure the following environment variables (see `.env.example`):

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT=your_project_id
VITE_APPWRITE_DB_ID=your_database_id
```

For full database schema setup, refer to [APPWRITE_SETUP.md](./APPWRITE_SETUP.md).

## Vercel Deployment

MyTrackYo is ready for instant deployment to Vercel:
1. Import the repository in your Vercel Dashboard.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables: `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT`, `VITE_APPWRITE_DB_ID`.
5. Deploy! Single-page app routing is managed by `vercel.json`.

## Development & Testing

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```
