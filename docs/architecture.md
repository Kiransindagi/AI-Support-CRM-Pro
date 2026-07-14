# Architecture Overview

## Backend
- **FastAPI**: Used for its high performance and native async support.
- **SQLAlchemy**: Chosen as the ORM to ensure safe, object-oriented database interactions.
- **PyJWT & Bcrypt**: Implemented for stateless authentication and secure password hashing.
- **SQLite**: Used for the MVP to allow rapid iteration without a separate database server.

## Frontend
- **React 18 + Vite**: Chosen for fast development server and modern component architecture.
- **Tailwind CSS v4**: Provides highly customizable utility classes for rapid UI development.
- **Recharts**: Selected for lightweight, accessible, and responsive data visualization in the dashboard.

## AI Integration
- The OpenAI API is queried asynchronously so as not to block the Uvicorn event loop.
- It includes a heuristic fallback mechanism to ensure the application remains stable even if the LLM provider rate limits or crashes.
