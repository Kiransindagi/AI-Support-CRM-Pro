# API Documentation

## Auth Endpoints
- `POST /api/v1/auth/login`: Accepts OAuth2 form data and returns a JWT access token.
- `POST /api/v1/auth/register`: Registers a new user.
- `GET /api/v1/auth/me`: Retrieves the currently authenticated user's profile.

## Ticket Endpoints
- `GET /api/v1/tickets/`: Retrieves a list of all tickets. Supports query parameters for `skip`, `limit`, `search`, `status`, and `assigned_to_me`.
- `POST /api/v1/tickets/`: Creates a new ticket. Invokes the AI service for categorization and sentiment analysis.
- `GET /api/v1/tickets/{id}`: Retrieves a specific ticket and its associated notes.
- `PUT /api/v1/tickets/{id}`: Updates a ticket (e.g., status, assigned_to_id).

## Analytics Endpoints
- `GET /api/v1/analytics/summary`: Retrieves aggregated statistics directly from the database for the frontend dashboard.
