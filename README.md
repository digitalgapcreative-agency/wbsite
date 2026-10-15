# Digital Gap — Full-Stack App

## Project Structure

```
dgap/
├── frontend/           # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navigation, Footer
│   │   │   ├── sections/       # Hero, HomeSection, ServicesSection, EducationSection, ContactSection, ConsultationModal
│   │   │   └── ui/             # Shared primitives (Badge, PillButton, InputField, SectionContainer)
│   │   ├── hooks/              # useServices, useForm
│   │   ├── services/           # api.js (Axios client)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
│
└── backend/            # Node.js + Express
    └── src/
        ├── middlewares/
        │   ├── cors.middleware.js
        │   ├── security.middleware.js
        │   ├── logger.middleware.js
        │   ├── rateLimiter.middleware.js
        │   ├── errorHandler.middleware.js
        │   └── notFound.middleware.js
        ├── routes/
        │   ├── contact.routes.js
        │   ├── services.routes.js
        │   └── consultation.routes.js
        ├── controllers/
        │   ├── contact.controller.js
        │   ├── services.controller.js
        │   └── consultation.controller.js
        └── server.js
```

## Running the App

### Backend (port 5000)
```bash
cd backend
npm run dev
```

### Frontend (port 5173)
```bash
cd frontend
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`.

## API Endpoints

| Method | Path                | Description                          |
|--------|---------------------|--------------------------------------|
| GET    | /api/health         | Health check                         |
| GET    | /api/services       | List all services                    |
| GET    | /api/services/:id   | Get a service by ID                  |
| POST   | /api/contact        | Submit a contact message             |
| GET    | /api/contact        | List all contacts (admin)            |
| POST   | /api/consultation   | Request a consultation               |
