# Parcello

Parcello is a parcel delivery web application with three roles — **Customer**, **Rider**, and **Admin** — covering booking, live tracking, rider/vehicle management, and distance-and-weight-based pricing.

The project is split into two independent apps:

- **`Backend/`** — Express + MongoDB (Mongoose) REST API
- **`Frontend/`** — React + Vite single-page app

## Features

- Email/password auth with role-based dashboards (Customer, Rider, Admin)
- Unique email enforcement across both Customer and Rider account types
- Parcel booking with real map-based pickup/drop-off location picking (OpenStreetMap/Nominatim search + click-to-place)
- Distance- and weight-based pricing, calculated from base fare, per-kg-per-km rate, and live fuel price/mileage settings
- Live parcel tracking: animated route on the map, vertical status timeline, shipment details
- In-app notifications (toast + bell dropdown) when a parcel moves to its next delivery stage
- Rider dashboard: browse available batches by hub, pick up, update location, drop batches
- Admin dashboard: manage hub locations, routes, pricing config, and view all users/batches/payments
- Multi-step signup flow with live email-availability checking and a final review/confirm step

## Tech stack

| | |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router v7, Leaflet/react-leaflet, lucide-react, axios |
| Backend | Node.js, Express, Mongoose (MongoDB), bcryptjs, cors, dotenv |
| Database | MongoDB (Atlas or local), with `$jsonSchema` validation applied via `setupValidation.js` |

## Project structure

```
Parcello/
├── Backend/
│   ├── index.js              # Express app entrypoint, mounts all /api routes
│   ├── models/                # Mongoose schemas (User, Parcel, Batch, ParcelLog, Payment, Location, Route, Vehicle, PricingConfig, Rating)
│   ├── routes/                 # REST route handlers, one file per resource
│   ├── utils/                  # Shared helpers (e.g. haversine distance)
│   ├── seed.js                 # Seeds locations, riders, customers, sample shipments
│   ├── setupValidation.js      # Applies MongoDB schema validation + indexes (idempotent)
│   └── .env.example
└── Frontend/
    ├── src/
    │   ├── api/                # axios client + endpoint functions, geocoding
    │   ├── components/         # Navbar, maps, location picker, shared UI primitives
    │   ├── context/            # Auth and notification React contexts
    │   └── pages/               # Home, Login, Signup, Pricing, Help, Couriers, and role dashboards
    └── .env.example
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (MongoDB Atlas recommended, or a local `mongod`)

### 1. Backend setup

```bash
cd Backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI to your MongoDB connection string
npm run seed   # optional: populates sample locations, riders, customers, shipments
npm run dev    # starts the API on http://localhost:8080 with nodemon
```

`.env` variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Port the API listens on (default `8080`) |

### 2. Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different host/port
npm run dev    # starts the dev server on http://localhost:5173 (or next free port)
```

`.env` variables:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:8080/api` |

### 3. Seeded test accounts

After running `npm run seed` in `Backend/`, you can log in with (password for all: `password123`):

| Role | Email |
|---|---|
| Customer | `hamza.customer@parcello.test` |
| Rider | `bilal.rider@parcello.test` |

## Available scripts

**Backend** (`Backend/package.json`):
- `npm start` — run the API with plain Node
- `npm run dev` — run with nodemon (auto-restart on changes)
- `npm run seed` — populate the database with sample data

**Frontend** (`Frontend/package.json`):
- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Notes

- `.env` files are git-ignored in both apps; 
- Notifications are implemented via client-side polling (no WebSocket/push server), so they only fire while the customer has the app open in a tab.
- Map tiles and geocoding use free OpenStreetMap-based services (CARTO tiles, Nominatim) — no API key required, but subject to their fair-use rate limits.
