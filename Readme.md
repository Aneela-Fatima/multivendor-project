# GadgetMall — Multi-Vendor E-Commerce Platform

A full-stack MERN multi-vendor marketplace where independent sellers run their own shops, customers browse and buy across every shop from one storefront, and an admin oversees the whole platform. Built with **React** (frontend), **Node.js / Express** (backend API), **MongoDB** (database), and **Socket.IO** (real-time chat).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Redux Toolkit, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.IO (standalone service) |
| Auth | JWT, HTTP-only cookies |
| File uploads | Multer (local disk storage) |

## Project Structure

```
multivendor-project/
├── backend/          # Express API (port 8000)
│   ├── controller/    # Route handlers, grouped by resource
│   ├── model/         # Mongoose schemas
│   ├── middleware/     # Auth guards, error handling
│   └── utils/         # JWT, email, error helpers
├── frontend/          # React app (port 3000)
│   └── src/
│       ├── components/  # UI building blocks, grouped by area
│       ├── pages/       # Route-level page components
│       ├── redux/       # Store, actions, reducers
│       └── static/       # Static reference data (categories, nav links)
└── socket/            # Standalone Socket.IO server (port 4000)
```

## Getting Started

```bash
# 1. Install dependencies
npm install                 # backend (run from project root)
cd frontend && npm install  # frontend
cd ../socket && npm install # socket server

# 2. Configure environment
# Create backend/config/.env — see Environment Variables below

# 3. Run all three services (separate terminals)
npm run dev                 # backend  → http://localhost:8000
cd frontend && npm start    # frontend → http://localhost:3000
cd socket && npm start      # socket   → http://localhost:4000
```

### Environment Variables (`backend/config/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port (e.g. `8000`) |
| `DB_URL` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret used to sign JWTs |
| `JWT_EXPIRES` | Token lifetime (e.g. `7d`) |
| `ACTIVATION_SECRET` | Secret for email-activation tokens |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_MAIL` / `SMTP_PASSWORD` | Outgoing mail (account activation, notifications) |

The frontend reads its API base URL from `frontend/src/server.js` (currently hardcoded to `http://localhost:8000` for local development).

---

## API Routes

All backend routes are mounted under **`http://localhost:8000/api/v2`**, one router per resource. Routes marked 🔒 require a logged-in **customer** (`isAuthenticated`), 🏪 require a logged-in **seller** (`isSeller`), and 👑 require an **admin** account (`isAuthenticated` + `isAdmin("Admin")`).

### `/user` — Customer accounts

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-user` | Public | Register a new customer; sends an activation email |
| POST | `/activation` | Public | Activate an account from its emailed token |
| POST | `/login-user` | Public | Log in; sets the `token` auth cookie |
| GET | `/getuser` | 🔒 | Get the logged-in customer's own profile |
| GET | `/logout` | Public | Clear the auth cookie |
| PUT | `/update-user-info` | 🔒 | Update name, email, or phone number |
| PUT | `/update-avatar` | 🔒 | Upload/replace the profile picture |
| PUT | `/update-user-addresses` | 🔒 | Add or update a saved address |
| DELETE | `/delete-user-address/:id` | 🔒 | Remove a saved address |
| PUT | `/update-user-password` | 🔒 | Change password |
| GET | `/user-info/:id` | Public | Get another user's public info (e.g. for chat) |
| GET | `/admin-all-users` | 👑 | List every customer account |
| DELETE | `/delete-user/:id` | 👑 | Remove a customer account |

### `/shop` — Seller accounts & shops

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-shop` | Public | Register a new shop; sends an activation email |
| POST | `/activation` | Public | Activate a shop from its emailed token |
| POST | `/login-shop` | Public | Log in; sets the `seller-token` auth cookie |
| GET | `/getSeller` | 🏪 | Get the logged-in seller's own shop profile |
| GET | `/logout` | 🏪 | Clear the seller auth cookie |
| GET | `/get-shop-info/:id` | Public | Get a shop's public profile (name, address, rating, etc.) |
| PUT | `/update-shop-avatar` | 🏪 | Upload/replace the shop logo |
| PUT | `/update-seller-info` | 🏪 | Update shop description, address, or phone |
| PUT | `/update-payment-methods` | 🏪 | Add/update the seller's withdrawal (bank) details |
| DELETE | `/delete-withdraw-method` | 🏪 | Remove the saved withdrawal method |
| GET | `/admin-all-sellers` | 👑 | List every shop on the platform |
| DELETE | `/delete-seller/:id` | 👑 | Remove a shop and all of its products |

### `/product` — Product catalog

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-product` | 🏪 | Add a new product to the seller's shop |
| GET | `/get-all-products-shop/:id` | Public | List all products belonging to one shop |
| DELETE | `/delete-shop-product/:id` | 🏪 | Remove a product |
| GET | `/get-all-products` | Public | List every product across every shop |
| PUT | `/create-new-review` | 🔒 | Submit a rating/review for a purchased product |

### `/event` — Time-limited sales & promotions

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-event` | 🏪 | Create a new promotional event for a product |
| GET | `/get-all-events/:id` | Public | List a single shop's events |
| DELETE | `/delete-shop-event/:id` | 🏪 | Remove an event |
| GET | `/get-all-events` | Public | List every active event across all shops |

### `/coupon` — Discount codes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-coupon-code` | 🏪 | Create a discount code for the seller's shop |
| GET | `/get-coupon/:id` | 🏪 | List all coupon codes for a shop |
| GET | `/get-coupon-value/:name` | Public | Look up a coupon by its code (used at checkout) |
| DELETE | `/delete-coupon/:id` | 🏪 | Remove a coupon code |

### `/order` — Orders, refunds, and payouts

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-order` | Public | Place an order; splits a multi-shop cart into one order per shop |
| GET | `/get-all-orders/:userId` | Public | List a customer's order history |
| GET | `/get-seller-all-orders/:shopId` | Public | List all orders placed with one shop |
| PUT | `/update-order-status/:id` | 🏪 | Advance an order's status (e.g. Processing → Shipped → Delivered) |
| PUT | `/order-refund/:id` | 🔒 | Customer requests a refund on an order |
| PUT | `/order-refund-success/:id` | 🏪 | Seller approves a refund request |
| GET | `/admin-all-orders` | 👑 | List every order on the platform |

### `/withdraw` — Seller payouts

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/create-withdraw-request` | 🏪 | Request a payout of the shop's available balance |
| GET | `/get-all-withdraw-request` | 👑 | List every pending withdrawal request |
| PUT | `/update-withdraw-request/:id` | 👑 | Approve/process a withdrawal |

### `/conversation` & `/message` — Buyer ↔ seller chat

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/conversation/create-new-conversation` | Public | Start a chat thread between a customer and a shop |
| GET | `/conversation/get-all-conversation-seller/:id` | 🏪 | List a shop's conversations |
| GET | `/conversation/get-all-conversation-user/:id` | 🔒 | List a customer's conversations |
| PUT | `/conversation/update-last-message/:id` | 🔒/🏪 | Update a thread's last-message preview |
| POST | `/message/create-new-message` | 🔒/🏪 | Send a chat message |
| GET | `/message/get-all-messages/:id` | 🔒/🏪 | Fetch a conversation's full message history |

Live delivery of new messages (so chat updates without a page refresh) is handled separately by the **Socket.IO service** on port 4000, which the frontend connects to directly.

---

## Frontend Routes

### Public / customer-facing

| Path | Page |
|---|---|
| `/` | Home |
| `/login`, `/sign-up` | Customer login / registration |
| `/activation/:activation_token` | Customer email activation |
| `/products` | All products (filterable by category) |
| `/product/:id` | Product details |
| `/best-selling` | Best-selling products |
| `/events` | Active promotional events |
| `/faq` | FAQ |
| `/checkout` | Checkout (address + coupon) |
| `/payment` | Payment method selection |
| `/order/success` | Order confirmation |
| `/shop/:id` | Public shop storefront |
| `/shop/preview/:id` | Shop profile (products, events, reviews) |

### Customer account (requires login)

| Path | Page |
|---|---|
| `/profile` | Profile, orders, refunds, inbox, addresses, password |
| `/inbox`, `/inbox/:conversationId` | Chat with a shop |
| `/user/order/:id` | Order details |
| `/user/track/order/:id` | Order tracking |

### Seller dashboard (requires seller login)

| Path | Page |
|---|---|
| `/shop-create`, `/shop-login` | Seller registration / login |
| `/seller/activation/:activation_token` | Seller email activation |
| `/dashboard` | Seller overview (earnings, orders, products) |
| `/dashboard-create-product`, `/dashboard-products` | Product management |
| `/dashboard-create-event`, `/dashboard-events` | Event management |
| `/dashboard-orders`, `/order/:id` | Order management |
| `/dashboard-refunds` | Refund requests |
| `/dashboard-withdraw-money` | Request a payout |
| `/dashboard-coupouns` | Discount codes |
| `/dashboard-messages` | Shop inbox (chat with customers) |
| `/settings` | Shop profile settings |

### Admin dashboard (requires an account with `role: "Admin"`)

| Path | Page |
|---|---|
| `/admin/dashboard` | Platform overview (total earnings, sellers, orders) |
| `/admin-orders` | All orders across every shop |
| `/admin-sellers` | All shops (with delete) |
| `/admin-users` | All customers (with delete) |
| `/admin-products` | All products across every shop |
| `/admin-events` | All events across every shop |
| `/admin-withdraw-request` | Approve seller payout requests |

---

## Notes on Roles

An account becomes an **admin** by manually setting `role: "Admin"` on its User document in MongoDB — there is no sign-up flow for admins. Customers and sellers are entirely separate collections (`User` and `Shop`), each with their own auth cookie (`token` and `seller-token` respectively), so the same email can independently hold a customer account and a shop.