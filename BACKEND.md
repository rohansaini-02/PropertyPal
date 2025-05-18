# PropertyPal Backend

Backend API for PropertyPal, a property listing platform for sellers and buyers.

## Features

- User authentication (signup/login) with role-based access (seller/buyer)
- Property listing management for sellers
- CRUD operations for property listings
- Input validation and error handling
- JWT-based authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd propertypal-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_RESET_SECRET=your_jwt_reset_secret_key
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user (buyer/seller)
- POST `/api/auth/login` - Login user
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Properties (Seller only)

- POST `/api/properties` - Create a new property listing
- GET `/api/properties/my-properties` - Get all properties for the authenticated seller
- GET `/api/properties/:id` - Get a specific property by ID
- PUT `/api/properties/:id` - Update a property
- DELETE `/api/properties/:id` - Delete a property

## Models

### User
- name (String, required)
- email (String, required, unique)
- phone (String, required, unique)
- password (String, required)
- role (String, enum: ['buyer', 'seller'])
- lastLogin (Date)

### Property
- title (String, required)
- propertyType (String, enum: ['apartment', 'house', 'villa', 'plot', 'commercial'])
- listingType (String, enum: ['sale', 'rent'])
- ownershipType (String, required)
- price (Number, required)
- location (Object)
  - address (String, required)
  - city (String, required)
  - state (String, required)
  - pincode (String, required)
  - coordinates (Object)
    - lat (Number)
    - lng (Number)
- details (Object)
  - area (Number, required)
  - areaUnit (String, enum: ['sqft', 'sqm', 'acres'])
  - bedrooms (Number)
  - bathrooms (Number)
  - floor (Number)
  - totalFloors (Number)
- amenities (Array of Strings)
- description (String, required)
- images (Array of PropertyImage references)
- seller (User reference, required)

## Error Handling

The API uses standard HTTP status codes and returns JSON responses in the following format:

```json
{
  "success": boolean,
  "message": "Error/success message",
  "data": {} // Optional data object
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Testing

Run tests:
```bash
npm test
``` 