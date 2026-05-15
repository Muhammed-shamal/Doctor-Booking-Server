# Doctor Appointment Booking System

A comprehensive backend API for managing doctor appointments, allowing patients to book consultations and doctors to manage their schedules. Built with Node.js, Express, and MongoDB with real-time capabilities using Socket.IO.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Security Features](#security-features)
- [Development](#development)

## 📖 Overview

The Doctor Appointment Booking System is a REST API designed to streamline the process of booking medical appointments. It enables:

- **Patients** to register, login, browse doctors, view availability, and book appointments
- **Doctors** to manage their schedules and availability slots
- **Admins** to manage appointments and system operations
- **Real-time updates** using Socket.IO for live appointment notifications

## ✨ Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Patient and admin roles with role-specific endpoints
- **Doctor Management**: Complete doctor profiles with specialization, experience, and consultation fees
- **Schedule Management**: Doctors can create daily schedules with customizable time slots
- **Appointment Booking**: Patients can book appointments with real-time slot availability
- **Appointment Management**: Track appointment status (pending, confirmed, completed, cancelled)
- **Real-time Notifications**: Socket.IO integration for live updates

### Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks on login
- **CORS Protection**: Configured CORS for multiple client origins
- **Helmet Middleware**: HTTP header security
- **Input Validation**: Express-validator for input sanitization

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Real-time**: Socket.IO 4.8.3
- **Documentation**: Swagger/OpenAPI with swagger-ui-express
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Morgan
- **Validation**: express-validator

### Development & Testing
- **Development Server**: Nodemon (hot reload)
- **Testing Framework**: Jest
- **HTTP Testing**: Supertest
- **In-Memory DB**: MongoDB Memory Server

## 📦 Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher
- **MongoDB** (Cloud or Local)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd doctor-booking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=DoctorBooking
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRE=30d
```

## ⚙️ Configuration

### Database Connection
Update `config/db.js` to configure MongoDB connection:
```javascript
const mongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/DoctorBooking";
const dbName = process.env.DB_NAME || "DoctorBooking";
```

### CORS Configuration
Modify `config/common.js` to add allowed client origins:
```javascript
corsOptions: {
  normal: {
    origin: [
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    credentials: true
  }
}
```

### JWT Configuration
Set JWT secrets and expiration times in `.env`:
```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
```

## ▶️ Running the Application

### Development Mode (with hot reload)
```bash
npm start
```

### Watch Mode for Testing
```bash
npm run test:watch
```

### Generate Test Coverage
```bash
npm run test:coverage
```

### Windows Users
Run the batch file to set up and install dependencies:
```bash
install.bat
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:5000/api-docs
```

The Swagger documentation includes:
- Complete endpoint specifications
- Request/response schemas
- Authentication requirements
- Error codes and descriptions

## 📁 Project Structure

```
doctor-booking/
├── models/                 # Database schemas
│   ├── User.js            # User model (patient/admin)
│   ├── Doctor.js          # Doctor model
│   ├── Schedule.js        # Schedule & slots model
│   └── Appointment.js     # Appointment model
│
├── controllers/           # Route controllers
│   ├── auth.controller.js
│   ├── doctor.controller.js
│   ├── schedule.controller.js
│   └── appointment.controller.js
│
├── routes/               # API routes
│   ├── auth.routes.js
│   ├── doctor.routes.js
│   ├── schedule.routes.js
│   └── appointment.route.js
│
├── middlewares/          # Custom middlewares
│   ├── auth.middleware.js       # JWT verification
│   ├── role.middleware.js       # Role-based access control
│   ├── validate.middleware.js   # Input validation
│   ├── error.middleware.js      # Error handling
│   └── rateLimit.middleware.js  # Rate limiting
│
├── validators/           # Input validation rules
│   └── auth.js
│
├── utils/               # Utility functions
│
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   └── common.js       # Common configurations
│
├── docs/               # Swagger documentation schemas
│
├── sockets/            # Socket.IO event handlers
│
├── app.js              # Express app setup
├── server.js           # Server entry point
├── swagger.js          # Swagger configuration
├── package.json        # Dependencies
└── .env                # Environment variables (git-ignored)
```

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("patient" | "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Collection
```javascript
{
  _id: ObjectId,
  name: String,
  specialization: String,
  experience: Number,
  consultationFee: Number,
  about: String,
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Schedule Collection
```javascript
{
  _id: ObjectId,
  doctor: ObjectId (ref: Doctor),
  date: Date,
  slotDuration: Number (default: 30 minutes),
  slots: [
    {
      _id: ObjectId,
      startTime: String,
      endTime: String,
      isBooked: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Collection
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  schedule: ObjectId (ref: Schedule),
  slotId: ObjectId,
  slotStartTime: String,
  slotEndTime: String,
  appointmentDate: Date,
  status: String ("pending" | "confirmed" | "completed" | "cancelled"),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### JWT Flow
1. User registers with email and password
2. Password is hashed using bcryptjs
3. On login, server validates credentials and issues JWT token
4. Token is sent in Authorization header: `Bearer <token>`
5. Refresh token can be used to get new access token

### Token Storage
- **Access Token**: Short-lived (7 days by default)
- **Refresh Token**: Long-lived (30 days by default)
- Tokens are validated on protected routes using `auth.middleware.js`

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/refresh-token` | Refresh access token | No |

### Doctors
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/doctors` | Get all doctors | Yes |
| GET | `/api/doctors/:id` | Get doctor details | Yes |
| POST | `/api/doctors` | Create doctor (Admin) | Yes (Admin) |
| PUT | `/api/doctors/:id` | Update doctor (Admin) | Yes (Admin) |
| DELETE | `/api/doctors/:id` | Delete doctor (Admin) | Yes (Admin) |

### Schedules
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/schedules` | Get all schedules | Yes |
| GET | `/api/schedules/:id` | Get schedule by ID | Yes |
| POST | `/api/schedules` | Create schedule (Doctor) | Yes |
| PUT | `/api/schedules/:id` | Update schedule | Yes |
| DELETE | `/api/schedules/:id` | Delete schedule | Yes |

### Appointments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/appointments/book` | Book appointment (Patient) | Yes (Patient) |
| GET | `/api/appointments/my` | Get my appointments (Patient) | Yes (Patient) |
| PATCH | `/api/appointments/:id/status` | Update status (Admin) | Yes (Admin) |

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Suite
- **auth.test.js**: Authentication endpoints
- **doctor.test.js**: Doctor management
- **schedule.test.js**: Schedule management
- **appointment.test.js**: Appointment booking
- **integration.test.js**: End-to-end workflows

### Test Configuration
Tests use:
- In-memory MongoDB (mongodb-memory-server) to avoid database dependencies
- Jest test runner with supertest for HTTP testing
- Isolated test environment for each test suite

## 🔒 Security Features

### Password Security
- Passwords are hashed using bcryptjs with salt rounds: 10
- Never stored in plain text

### API Security
- **CORS**: Restrict requests to whitelisted origins
- **Helmet**: Set security HTTP headers
- **Rate Limiting**: Limit login attempts to prevent brute force
- **Input Validation**: Validate and sanitize all inputs
- **JWT**: Secure token-based authentication

### Rate Limiting
- Login endpoint: Limited to 5 attempts per 15 minutes
- Configurable via `middlewares/rateLimit.middleware.js`

## 👨‍💻 Development

### Adding New Endpoints
1. Create controller in `controllers/`
2. Create route in `routes/`
3. Add validation in `validators/`
4. Add Swagger documentation
5. Write tests in `.test.js`

### Database Migrations
Use MongoDB client tools or Mongoose schema updates directly in models.

### Code Style
- ESLint configuration (if available)
- Follow Node.js best practices
- Use async/await for asynchronous operations

### Error Handling
All errors are handled by `middlewares/error.middleware.js`:
- Returns appropriate HTTP status codes
- Sends standardized error responses
- Logs errors for debugging

## 📞 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description",
  "statusCode": 400
}
```

## 🔄 WebSocket Events (Socket.IO)

Real-time events are available through Socket.IO:
- Connection established on client connection
- Events can be emitted for appointment updates
- See `sockets/` directory for event handlers

## 📝 Environment Variables

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=DoctorBooking

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# CORS
CLIENT_URLS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check network access in MongoDB Atlas
- Ensure IP is whitelisted

### JWT Errors
- Clear tokens and re-login
- Check JWT_SECRET is set correctly
- Verify token expiration time

### CORS Errors
- Add client URL to `config/common.js`
- Verify credentials: true is set for cookies

### Rate Limit Exceeded
- Wait 15 minutes before retry
- Configure rate limit in `middlewares/rateLimit.middleware.js`

## 📄 License

ISC

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Last Updated**: 2026-05-15
**Version**: 1.0.0
