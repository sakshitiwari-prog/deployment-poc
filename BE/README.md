# BE

Backend API server built with Express and MongoDB (Mongoose).

## Tech Stack

- Node.js + Express 5
- MongoDB / Mongoose
- JWT auth (`jsonwebtoken`), `bcrypt` for password hashing
- `express-rate-limit` for rate limiting, `joi` for request validation
- Google Generative AI (`@google/genai`, `@google/generative-ai`) and `googleapis`
- `multer` for file uploads, `pdf-parse` for PDF parsing

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in this folder with:

```
BE_PORT=<port to run the server on>
MONGO_URI=<mongodb connection string>
JWT_SECRET=<jwt signing secret>
```

Run the server:

```bash
npm run dev    # nodemon, auto-restarts on change
npm start      # plain node
```

Run tests:

```bash
npm test
```

## Project Structure

```
Controller/   Request handlers (users/orders, conversations, school)
Routes/       Express routers, mounted under /orders, /products, /users, /convo, /api
Schema/       Mongoose models (User, School, Role, Permission, Order, Product, Conversation, ...)
Middleware/   Auth, validation, and rate limiting middleware
services/     Business logic / integrations
Stream/       Streaming utilities
tools/        Misc utility scripts
Test/         Jest tests
uploads/      Uploaded files (multer)
```

## Endpoints

- `GET /health` — health check
- `GET /api/server-info` — server/host info
- `POST /test` — connectivity check
- `/orders`, `/products`, `/users`, `/convo`, `/api` — see `Routes/` for details

## CORS

Allowed origins are configured in `index.js` (`allowedOrigins`); update this list when adding new frontend deployment URLs.
