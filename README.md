# Zaria ServiceConnect Web App

This is the React web application for residents and providers.

React is a JavaScript tool for building user interfaces. A user interface means the screens, buttons, forms, and pages that people interact with.

## What The Web App Is Used For

The web app allows users to access Zaria ServiceConnect from a browser.

It has two main views:

- Resident view: for people who need services.
- Provider view: for skilled workers who offer services.

The app connects to the backend at:

```text
https://zaria-serviceconnect-backend-production.up.railway.app
```

That backend address is stored in `src/config.js`.

## Resident View

Residents can:

- Register and login.
- Browse service categories.
- Search for providers.
- View provider profiles.
- Create bookings.
- Track booking status.
- Confirm job completion.
- Submit reviews.
- Submit complaints.
- View complaint messages with admin.
- View notifications.
- Update their profile and home address.

## Provider View

Providers can:

- Register with service details and verification documents.
- Login after registration.
- Wait for admin approval.
- View booking requests.
- Accept or decline bookings.
- Request job completion.
- Update availability as available, busy, or offline.
- Update provider profile.
- View complaint messages with admin.
- View notifications.

## How It Connects To The Backend

The web app uses `fetch`, which is a browser function for sending internet requests.

The shared request helper is in:

```text
src/api/client.js
```

That helper does three important things:

1. It adds the backend URL before every endpoint.
2. It attaches the login token when the user is logged in.
3. It reads backend errors and shows useful messages.

A token is like a temporary pass. After login, the backend gives the app a token. The app sends that token with protected requests so the backend knows who is making the request.

## How User Actions Trigger Backend Requests

Example: resident searches for a provider.

```text
Resident types "electrician"
        |
        v
Web app calls searchProviders()
        |
        v
searchProviders() sends GET /providers/search?q=electrician
        |
        v
Backend returns matching providers
        |
        v
Web app displays provider cards
```

Example: resident books a provider.

```text
Resident fills booking form
        |
        v
Web app calls createBooking()
        |
        v
Backend checks rules and saves booking
        |
        v
Web app shows the booking in booking history
```

## Main API Files

- `src/api/auth.js`: login, resident registration, provider registration.
- `src/api/providers.js`: categories, provider list, provider search, provider profile.
- `src/api/bookings.js`: create booking, get bookings, update booking status, update availability.
- `src/api/complaints.js`: submit complaint and load personal complaints.
- `src/api/messages.js`: complaint message conversations.
- `src/api/notifications.js`: view and mark notifications as read.
- `src/api/reviews.js`: submit and view reviews.
- `src/api/users.js`: user profile update.

## Important Pages

- `src/pages/LoginPage.jsx`: user login.
- `src/pages/RegisterPage.jsx`: resident and provider registration.
- `src/pages/resident/ProvidersPage.jsx`: provider search and browsing.
- `src/pages/resident/BookingPage.jsx`: booking form.
- `src/pages/resident/ResidentBookingsPage.jsx`: booking history, completion, reviews, complaints.
- `src/pages/provider/ProviderRequestsPage.jsx`: provider booking requests.
- `src/pages/provider/ProviderProfileSettingsPage.jsx`: provider profile and availability.

## Key Features In Simple English

### Search Providers

The resident searches by typing a service or provider name. The app sends the search text to the backend. The backend returns approved providers that match.

### Booking

The resident chooses a provider and submits booking details. The backend saves the booking. The provider later accepts or declines it.

### Profile

Residents and providers can update personal details. Providers can update service details and verification files.

### Complaints

Residents can complain about a booking. The complaint is sent to the backend and becomes visible to admin.

### Notifications

The app loads notifications from the backend, such as booking updates, complaint updates, and messages.

## How To Run Locally

From the `web-app` folder:

```bash
npm install
npm run dev
```

Then open the local Vite address shown in the terminal, usually:

```text
http://localhost:5173
```

## Defense Explanation

You can say:

"The web app is the browser interface for residents and providers. It does not directly touch the database. When a user clicks a button, the web app sends an API request to the FastAPI backend. The backend checks the request, updates the database if needed, and returns a response that the web app displays."
