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

#### Authentication & Authorization
- **User Registration**: Secure account creation with email verification
- **User Login**: Password-based authentication with JWT tokens
- **Password Reset**: Email-based password recovery with time-limited tokens
- **Token Refresh**: Automatic token renewal without re-login
- **Role-Based Access Control (RBAC)**: Differentiated access for patients and admins
- **JWT Token Management**: Secure access tokens (7 days) and refresh tokens (30 days)

#### Patient Features
- **Account Management**: View and manage personal profile information
- **Doctor Discovery**: Browse all available doctors with filters by specialization
- **Appointment Booking**: Book appointments with real-time slot availability
- **My Appointments**: View booked appointments with status tracking
- **Appointment Cancellation**: Cancel booked appointments before appointment date
- **Appointment History**: Track past and current appointments

#### Doctor Features (Admin)
- **Doctor Profile Management**: Add, edit, and manage doctor information
- **Specialization & Credentials**: Store medical qualifications and experience
- **Clinic Details**: Manage clinic name and location
- **Schedule Management**: Create daily schedules with customizable time slots
- **Slot Configuration**: Set slot duration (default: 30 minutes)
- **Availability Control**: Activate/deactivate doctor profiles
- **Appointment Management**: View and manage patient appointments

#### Admin Features
- **User Management**: Monitor and manage all patient accounts
- **Doctor Management**: Full CRUD operations on doctor profiles
- **Appointment Oversight**: View and update appointment statuses
- **Dashboard Analytics**: Track system statistics and metrics
- **Developer Registration**: Special registration for admin account creation

### Advanced Features
- **Real-time Notifications**: Socket.IO integration for live appointment updates
- **Email Notifications**: Automated emails for password resets and updates (Nodemailer)
- **Input Validation**: Comprehensive validation for all API inputs
- **Rate Limiting**: Protection against brute force attacks (5 attempts per 15 minutes on login)
- **CORS Configuration**: Multi-origin support for frontend applications
- **Error Handling**: Centralized error handling with meaningful messages
- **API Documentation**: Interactive Swagger UI for API exploration

### Security Features
- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication with secret keys
- **Rate Limiting**: Brute force attack protection on login endpoint
- **CORS Protection**: Whitelist-based cross-origin requests
- **Helmet Middleware**: Security HTTP headers (XSS, CSRF, etc.)
- **Input Validation**: Express-validator for input sanitization
- **MongoDB Injection Prevention**: Mongoose schema validation
- **Error Message Sanitization**: No sensitive data in error responses

## 📦 Dependencies & Technologies

### Core Dependencies
- **Express.js** (v5.2.1): Web application framework for Node.js
- **Mongoose** (v9.6.2): MongoDB object modeling and schema validation
- **MongoDB** (v7.2.0): Document-based NoSQL database driver

### Authentication & Security
- **jsonwebtoken** (v9.0.3): JWT token creation and verification
- **bcryptjs** (v3.0.3): Password hashing with salt rounds
- **helmet** (v8.1.0): Security middleware for HTTP headers
- **cors** (v2.8.6): Cross-Origin Resource Sharing configuration
- **express-rate-limit** (v8.5.2): Rate limiting middleware for brute force protection
- **express-validator** (v7.3.2): Input validation and sanitization

### Real-time Communication
- **socket.io** (v4.8.3): Real-time bidirectional event-based communication
- **http**: Native Node.js HTTP server module

### Email & Notifications
- **nodemailer** (v8.0.7): Email sending service integration
- **dotenv** (v17.4.2): Environment variables management

### API Documentation
- **swagger-jsdoc** (v6.2.8): Swagger/OpenAPI documentation from JSDoc comments
- **swagger-ui-express** (v5.0.1): Interactive API documentation UI

### Utilities
- **cookie-parser** (v1.4.7): Parse HTTP request cookies
- **morgan** (v1.10.1): HTTP request logging middleware
- **crypto**: Native Node.js cryptographic functions for token generation

### Development & Testing
- **jest** (v29.7.0): JavaScript testing framework
- **supertest** (v6.3.3): HTTP assertion library for testing APIs
- **mongodb-memory-server** (v9.1.6): In-memory MongoDB for testing
- **nodemon** (v3.1.14): Auto-reload development server on file changes

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

### Database Connection (`config/db.js`)
- MongoDB connection using Mongoose
- Connects to cloud MongoDB (MongoDB Atlas) or local MongoDB
- Automatic reconnection on connection failure
- Database selection via `DB_NAME` environment variable

### Common Configuration (`config/common.js`)
Contains global application settings:
```javascript
// MongoDB Configuration
mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/DoctorBooking"
mongoDBName: process.env.DB_NAME || "DoctorBooking"

// JWT Secrets
accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET

// CORS Configuration
corsOptions: {
  normal: {
    origin: ["http://localhost:5174", "http://localhost:3000", "http://localhost:5173"],
    credentials: true
  },
  socket: { /* Socket.IO specific CORS */ }
}

// Email Configuration
emailUser: process.env.EMAIL_USER
emailPassword: process.env.EMAIL_PASSWORD
clientUrl: process.env.CLIENT_URL || "http://localhost:3000"

// Developer Registration
code: process.env.DEVELOPER_CODE
```

### CORS Configuration
Modify `config/common.js` to add allowed client origins:
```javascript
corsOptions: {
  normal: {
    origin: [
      "http://localhost:5174",    // Vite dev server
      "http://localhost:3000",    // React dev server
      "http://localhost:5173",    // Alternative port
      "https://yourdomain.com"    // Production domain
    ],
    credentials: true,            // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
}
```

### JWT Configuration
Set in `.env`:
```env
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```

### Email Configuration (Nodemailer)
Set in `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_or_credentials
CLIENT_URL=http://localhost:3000
```

### Rate Limiting Configuration
Located in `middlewares/rateLimit.middleware.js`:
- **Login attempts**: 5 requests per 15 minutes
- **Window size**: 15 minutes (900 seconds)
- **Max requests**: 5

Modify for different requirements:
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests per window
  message: "Too many login attempts, please try again later"
});
```

## ▶️ Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```
- Uses Nodemon for automatic server restart on file changes
- Logs HTTP requests with Morgan middleware
- Connects to MongoDB

### Production Mode
```bash
npm start
```
- Runs the server directly with Node.js
- No automatic restart on file changes
- Set `NODE_ENV=production` environment variable

### Watch Mode for Testing
```bash
npm run test:watch
```
- Runs Jest in watch mode
- Re-runs tests on file changes
- Useful for TDD development

### Generate Test Coverage
```bash
npm run test:coverage
```
- Generates detailed code coverage report
- Shows which lines/functions are tested

### Windows Users
Run the batch file to set up and install dependencies:
```bash
install.bat
```
- Automatically installs Node.js dependencies
- Sets up environment if needed

### Server Startup
The server will start on `http://localhost:5000` (or configured PORT)

### Health Checks
- **API Status**: GET `http://localhost:5000/`
- **Database Status**: GET `http://localhost:5000/db/health`

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
├── models/                      # Database schemas (Mongoose)
│   ├── User.js                 # User model (patients, admins, credentials)
│   ├── Doctor.js               # Doctor profile with qualifications and clinic info
│   ├── Schedule.js             # Doctor's daily schedules with time slots
│   └── Appointment.js          # Appointment bookings and status tracking
│
├── controllers/                # Business logic for routes
│   ├── auth.controller.js      # Register, login, logout, password reset
│   ├── doctor.controller.js    # CRUD operations for doctors
│   ├── schedule.controller.js  # Schedule and slot management
│   ├── appointment.controller.js # Appointment booking and management
│   ├── patient.controller.js   # Patient-specific operations
│   └── dashboard.js            # Dashboard statistics and analytics
│
├── routes/                     # API endpoints definitions
│   ├── auth.routes.js          # Authentication endpoints
│   ├── doctor.routes.js        # Doctor management endpoints
│   ├── schedule.routes.js      # Schedule management endpoints
│   ├── appointment.route.js    # Appointment booking endpoints
│   ├── patient.route.js        # Patient endpoints
│   └── dashboard.js            # Dashboard endpoints
│
├── middlewares/                # Request processing middleware
│   ├── auth.middleware.js      # JWT token verification and validation
│   ├── role.middleware.js      # Role-based access control (RBAC)
│   ├── validate.middleware.js  # Input validation error handling
│   ├── error.middleware.js     # Centralized error handling
│   └── rateLimit.middleware.js # Rate limiting for brute force protection
│
├── validators/                 # Input validation schemas
│   └── auth.js                # Registration and login validation rules
│
├── services/                  # External services integration
│   └── mail.js                # Email sending with nodemailer
│
├── utils/                     # Reusable utility functions
│   ├── generateTokens.js      # JWT token generation
│   ├── apiResponse.js         # Standardized API response format
│   └── emailTemplate.js       # Email HTML templates
│
├── config/                    # Application configuration
│   ├── db.js                 # MongoDB connection and setup
│   └── common.js             # CORS, JWT, and global configs
│
├── docs/                     # Swagger/OpenAPI documentation schemas
│
├── sockets/                  # Socket.IO event handlers for real-time features
│
├── app.js                    # Express app initialization and middleware setup
├── server.js                 # HTTP server creation and Socket.IO integration
├── swagger.js                # Swagger/OpenAPI specification generator
├── package.json              # Project dependencies and scripts
└── .env                      # Environment variables (git-ignored)
```

## 💾 Database Schema

### User Collection
Stores patient and admin user information with authentication credentials.
```javascript
{
  _id: ObjectId,
  name: String,                              // User's full name
  email: String (unique, lowercase),         // Unique email address
  password: String (hashed with bcryptjs),   // Securely hashed password (10 salt rounds)
  phone: String,                             // Contact phone number
  address: String,                           // User's address
  role: String ("patient" | "admin"),        // User role for access control (default: "patient")
  resetPasswordToken: String (optional),     // Token for password reset functionality
  resetPasswordExpire: Date (optional),      // Expiry time for reset token (15 minutes)
  createdAt: Date,                           // Account creation timestamp
  updatedAt: Date                            // Last update timestamp
}
```

### Doctor Collection
Stores doctor profiles with qualifications, specialization, and clinic information.
```javascript
{
  _id: ObjectId,
  fname: String,                             // First name
  lname: String (optional),                  // Last name
  email: String (optional),                  // Doctor's email
  phone: String,                             // Contact number
  specialization: String,                    // Medical specialization (e.g., "Cardiology", "Pediatrics")
  experience: Number,                        // Years of medical experience
  consultationFee: Number,                   // Fee for one consultation
  bio: String (optional),                    // Professional biography
  qualifications: String,                    // Medical qualifications and certifications
  clinic_name: String,                       // Associated clinic name
  clinic_address: String,                    // Clinic location
  isActive: Boolean (default: true),         // Doctor availability status
  createdAt: Date,                           // Profile creation timestamp
  updatedAt: Date                            // Last update timestamp
}
```

### Schedule Collection
Stores doctor's daily schedules with available appointment slots. Unique index on (doctor, date).
```javascript
{
  _id: ObjectId,
  doctor: ObjectId (ref: Doctor),            // Reference to Doctor document
  date: Date,                                // Date of the schedule
  slotDuration: Number (default: 30),        // Duration of each slot in minutes
  slots: [
    {
      _id: ObjectId,                         // Unique slot identifier
      startTime: String,                     // Slot start time (e.g., "09:00 AM")
      endTime: String,                       // Slot end time (e.g., "09:30 AM")
      isBooked: Boolean (default: false)     // Booking status
    }
  ],
  createdAt: Date,                           // Schedule creation timestamp
  updatedAt: Date                            // Last update timestamp
}
```

### Appointment Collection
Stores appointment bookings with status tracking.
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: User),             // Reference to Patient/User
  doctor: ObjectId (ref: Doctor),            // Reference to Doctor
  schedule: ObjectId (ref: Schedule),        // Reference to Schedule document
  slotId: ObjectId,                          // Specific slot ID from Schedule
  slotStartTime: String,                     // Appointment start time
  slotEndTime: String,                       // Appointment end time
  appointmentDate: Date,                     // Appointment date
  status: String,                            // Appointment status
                                             // Values: "pending" | "confirmed" | "completed" | "cancelled"
                                             // (default: "pending")
  createdAt: Date,                           // Booking creation timestamp
  updatedAt: Date                            // Last update timestamp
}
```

### Database Indexes
- **Schedule Collection**: Unique index on `(doctor, date)` to ensure one schedule per doctor per day
- All collections have timestamp indexes via `timestamps: true` in Mongoose schemas

## 🔐 Authentication

### JWT Flow
1. **Registration**: User registers with email, name, phone, address, and password
2. **Password Hashing**: Password is hashed using bcryptjs (10 salt rounds)
3. **Login**: User validates email and password
4. **Token Generation**: 
   - Access Token (JWT): 7 days expiration - sent in response
   - Refresh Token (JWT): 30 days expiration - stored as HTTP-only cookie
5. **Protected Requests**: Access token sent in Authorization header: `Bearer <accessToken>`
6. **Token Refresh**: Use refresh token to get new access token without re-login
7. **Logout**: Refresh token cookie is cleared

### Token Storage & Security
- **Access Token**: Short-lived (7 days), used for API requests
- **Refresh Token**: Long-lived (30 days), stored as HTTP-only cookie (immune to XSS)
- **Token Validation**: All protected routes use `auth.middleware.js` for validation
- **Token Verification**: Tokens verified against `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
- **Secrets Management**: Stored in `.env` file (never committed to git)

### Password Reset Flow
1. **Forgot Password**: User requests reset with email
2. **Reset Token**: Server generates 32-byte random token and hashes it with SHA256
3. **Email Notification**: Reset link sent to user email with token (valid 15 minutes)
4. **Token Verification**: User submits new password with token
5. **Password Update**: New password hashed and stored, reset token cleared

### Middleware Authentication
- **protect middleware**: Validates JWT token from Authorization header
- **role.middleware.js**: Checks user role (patient/admin) for RBAC
- **Error Handling**: Proper HTTP status codes (401 for auth errors, 403 for permission errors)

### Rate Limiting
- **Login Endpoint**: Limited to 5 attempts per 15-minute window
- **Configuration**: Adjustable in `middlewares/rateLimit.middleware.js`
- **Protection**: Prevents brute force password guessing attacks

## 🔌 API Endpoints

### Authentication Endpoints
All authentication endpoints are public (no authentication required except where noted).

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/auth/register` | Register new patient account | No | - |
| POST | `/api/auth/developer/register/:code` | Register new admin account (requires code) | No | - |
| POST | `/api/auth/login` | Login and get JWT token | No | - |
| POST | `/api/auth/refresh-token` | Get new access token | No | - |
| GET | `/api/auth/me` | Get current logged-in user profile | Yes | Any |
| POST | `/api/auth/logout` | Logout user (clear tokens) | No | Any |
| POST | `/api/auth/forgot-password` | Request password reset link | No | - |
| POST | `/api/auth/reset-password/:token` | Reset password with token | No | - |

### Doctor Management Endpoints
All endpoints require authentication. Admin endpoints are marked.

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/doctors` | Get all doctors with filters | Yes | Any |
| GET | `/api/doctors/:id` | Get specific doctor details | Yes | Any |
| POST | `/api/doctors` | Create new doctor profile | Yes | Admin |
| PUT | `/api/doctors/:id` | Update doctor information | Yes | Admin |
| DELETE | `/api/doctors/:id` | Delete doctor profile | Yes | Admin |
| PATCH | `/api/doctors/:id/status` | Toggle doctor active/inactive status | Yes | Admin |

### Schedule Management Endpoints
All endpoints require authentication.

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/schedules` | Get all schedules (with filters) | Yes | Any |
| GET | `/api/schedules/:id` | Get schedule by ID with slots | Yes | Any |
| POST | `/api/schedules` | Create new schedule for doctor | Yes | Doctor/Admin |
| PUT | `/api/schedules/:id` | Update existing schedule | Yes | Doctor/Admin |
| DELETE | `/api/schedules/:id` | Delete schedule | Yes | Doctor/Admin |
| PATCH | `/api/schedules/:id/add-slots` | Add slots to existing schedule | Yes | Doctor/Admin |

### Appointment Management Endpoints
All endpoints require authentication.

| Method | Endpoint | Description | Auth | Role | Notes |
|--------|----------|-------------|------|------|-------|
| POST | `/api/appointments/book` | Book new appointment | Yes | Patient | Creates pending appointment |
| GET | `/api/appointments/my` | Get my appointments | Yes | Patient | Patient's appointments |
| GET | `/api/appointments` | Get all appointments | Yes | Admin | Admin view only |
| GET | `/api/appointments/:id` | Get appointment details | Yes | Any | Patient can view own, Admin all |
| PATCH | `/api/appointments/:id/status` | Update appointment status | Yes | Admin | Status: pending→confirmed→completed/cancelled |
| DELETE | `/api/appointments/:id/cancel` | Cancel appointment | Yes | Patient | Only before appointment date |

### Patient Management Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/patients` | Get all patients (paginated) | Yes | Admin |
| GET | `/api/patients/:id` | Get patient details | Yes | Admin |

### Dashboard Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/dashboard/stats` | Get system statistics | Yes | Admin |
| GET | `/api/dashboard/appointments-summary` | Get appointment summary | Yes | Admin |

### Health Check Endpoint
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | API status check | No |
| GET | `/db/health` | Database connection status | No |

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (development)
```bash
npm run test:watch
```

### Generate Test Coverage Report
```bash
npm run test:coverage
```

### Test Suite Files
- **auth.test.js**: Authentication endpoints (register, login, refresh, password reset)
- **doctor.test.js**: Doctor management (CRUD operations, filtering, status updates)
- **schedule.test.js**: Schedule and slot management (create, update, delete schedules)
- **appointment.test.js**: Appointment booking and management
- **integration.test.js**: End-to-end workflows (booking flow, complete journey)

### Test Environment & Configuration
- **Framework**: Jest (configured in package.json)
- **HTTP Testing**: Supertest for API endpoint testing
- **Database**: In-memory MongoDB (mongodb-memory-server) - no external DB dependency
- **Test Isolation**: Each test suite runs in isolated environment
- **Options**: Detects hanging handles, forces exit after tests complete
- **Coverage**: Can generate detailed coverage reports

### Test Structure
Tests use:
- Arrange-Act-Assert pattern
- Mock data and fixtures
- Isolated test cases for each endpoint
- Supertest for HTTP assertions
- Jest lifecycle hooks (beforeAll, afterAll, beforeEach, afterEach)

### Writing New Tests
1. Create `.test.js` file in root directory
2. Import required modules (supertest, jest, models)
3. Set up test environment in `beforeAll()`
4. Write test cases with descriptive names
5. Clean up in `afterAll()`
6. Use `describe()` and `test()` or `it()` for organization

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

## 📚 Key Modules & Functionality

### Authentication Controller (`controllers/auth.controller.js`)
- **register()**: User registration with email validation and duplicate check
- **devRegister()**: Admin registration with secret code verification
- **login()**: User login with password verification (bcrypt)
- **logout()**: User logout and refresh token cookie clearing
- **refresh()**: Token refresh using HTTP-only refresh token
- **me()**: Get current authenticated user profile
- **forgotPassword()**: Send password reset email with 15-minute token
- **resetPassword()**: Reset password with token validation

### Doctor Controller (`controllers/doctor.controller.js`)
- Doctor profile CRUD operations
- Search and filter doctors by specialization, experience, consultation fees
- Manage doctor active/inactive status
- Retrieve doctor details with related schedules and appointments

### Schedule Controller (`controllers/schedule.controller.js`)
- Create daily schedules for doctors with specific dates
- Generate time slots automatically based on slot duration
- Update existing schedules and modify slots
- Delete schedules and related slots
- Filter schedules by doctor ID and date range
- Prevent duplicate schedules for same doctor/date (unique index)

### Appointment Controller (`controllers/appointment.controller.js`)
- **bookAppointment()**: Book appointment with slot validation and availability check
- **getAppointments()**: Retrieve appointments (filtered by patient/admin role)
- **getAppointmentById()**: Get specific appointment with full details
- **updateAppointmentStatus()**: Update appointment status (admin only)
- **cancelAppointmentByPatient()**: Allow patients to cancel their own appointments

### Patient Controller (`controllers/patient.controller.js`)
- List all patients with pagination (admin only)
- Get individual patient profile and appointment history
- View patient statistics

### Dashboard Controller (`controllers/dashboard.js`)
- System statistics (total users, doctors, appointments)
- Appointment summaries (pending, confirmed, completed, cancelled counts)
- Doctor performance metrics and occupancy rates

### Middleware Functions
- **auth.middleware.js**: Validates JWT token, extracts user from token, handles token expiration
- **role.middleware.js**: Role-based access control (RBAC) for patient/admin routes
- **validate.middleware.js**: Centralized validation error handling and response formatting
- **error.middleware.js**: Global error handler for consistent error responses
- **rateLimit.middleware.js**: Rate limiting configuration (5 attempts per 15 minutes on login)

### Utility Functions
- **generateTokens()**: Creates JWT access tokens (7 days) and refresh tokens (30 days)
- **apiResponse()**: Standardized API response format with status code, message, data
- **emailTemplate()**: HTML email template generation for password reset
- **sendEmail()**: Email delivery integration via Nodemailer

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

Socket.IO provides real-time bidirectional communication between server and clients for live updates.

### Server Events
```javascript
// Connection
io.on("connection", (socket) => {
  // Handle new client connection
  // Client ID: socket.id
});

// Disconnection
socket.on("disconnect", () => {
  // Handle client disconnection
});
```

### Real-time Features (Available)
- Live appointment status updates
- Real-time slot availability changes
- Doctor schedule modifications
- Notification broadcasting
- Presence tracking

### CORS Configuration for WebSocket
- Configured in `config/common.js`
- Supports multiple client origins
- Credentials enabled for cookie transmission

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=DoctorBooking

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_super_secret_access_key_here_min_32_chars
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_here_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail or other SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_PORT=587
EMAIL_HOST=smtp.gmail.com

# Frontend URL
CLIENT_URL=http://localhost:3000

# CORS Origins (comma-separated for multiple)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Developer Registration Code
DEVELOPER_CODE=your_secret_admin_registration_code_here
```

### Variable Descriptions
| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port number | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGO_URI` | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/ |
| `DB_NAME` | Database name | DoctorBooking |
| `ACCESS_TOKEN_SECRET` | JWT access token secret key | Random 32+ character string |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret key | Random 32+ character string |
| `JWT_EXPIRE` | Access token expiration time | 7d (7 days) |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration time | 30d (30 days) |
| `EMAIL_USER` | Email account for sending messages | your-email@gmail.com |
| `EMAIL_PASSWORD` | Email account password or app password | Gmail app password |
| `CLIENT_URL` | Frontend application URL | http://localhost:3000 |
| `DEVELOPER_CODE` | Code for admin registration | secret_admin_code |

### Generating Strong Secrets
```bash
# Generate a strong random secret in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Gmail Configuration (for Email)
1. Enable 2-Factor Authentication on Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use generated 16-character password in `EMAIL_PASSWORD`

## 🚨 Troubleshooting

### MongoDB Connection Issues
**Problem**: "MongoDB Connection Error" on startup
- **Verify MONGO_URI**: Check format is `mongodb+srv://username:password@cluster.mongodb.net/`
- **Check credentials**: Ensure username and password are correct
- **Network access**: Whitelist your IP in MongoDB Atlas (Network Access)
- **Database permissions**: User must have role with proper permissions
- **Connection timeout**: Try increasing timeout in connection string

**Local MongoDB**:
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
```

### JWT Token Issues
**Problem**: "Invalid token" or "Token expired" errors
- **Clear tokens**: Delete stored tokens and re-login
- **Check JWT_SECRET**: Must match between token generation and verification
- **Token expiration**: Verify token hasn't exceeded expiration time
- **Token format**: Must be sent as `Authorization: Bearer <token>`
- **Verify secrets in .env**: Ensure `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
- **Add client URL**: Add frontend URL to `corsOptions.normal.origin` in `config/common.js`
- **Enable credentials**: Ensure `credentials: true` is set for cookie support
- **Verify origin**: Check exact protocol, domain, and port match
- **Preflight requests**: Ensure OPTIONS requests are handled (Express handles automatically)

**Example CORS error solution**:
```javascript
// In config/common.js
origin: ["http://localhost:3000", "http://localhost:5173"],
credentials: true,
allowedHeaders: ["Content-Type", "Authorization"]
```

### Rate Limit Exceeded
**Problem**: "Too many login attempts" after 5 failed logins
- **Wait 15 minutes**: Rate limiter resets after 15-minute window
- **Use refresh token**: Avoid repeated login with valid refresh token
- **Modify rate limit**: Adjust in `middlewares/rateLimit.middleware.js`

### Email/Password Reset Not Working
**Problem**: "Failed to send email" or password reset link not received
- **Verify EMAIL_USER and EMAIL_PASSWORD**: Check credentials in `.env`
- **Gmail App Password**: If using Gmail, must use 16-character app password, not account password
- **SMTP settings**: Verify email host and port in `config/common.js`
- **Enable "Less Secure Apps"**: If not using app password
- **Check CLIENT_URL**: Password reset link must have correct frontend URL

### Server Not Starting
**Problem**: Port already in use or other startup errors
- **Change PORT**: Use different port in `.env` (e.g., `PORT=5001`)
- **Kill process**: `npx kill-port 5000` to free the port
- **Check logs**: Read console output for specific error messages
- **Dependencies**: Run `npm install` to ensure all packages installed

### Database Doesn't Exist
**Problem**: Collections not created automatically
- **Mongoose auto-creates**: Collections created on first document insert
- **Manual creation**: Use MongoDB CLI: `use DoctorBooking`
- **Check connection**: Verify connected to correct database via `db/health` endpoint

### Test Failures
**Problem**: Tests failing or timing out
- **Clear Jest cache**: `npx jest --clearCache`
- **Update dependencies**: Run `npm install` to get latest packages
- **Check in-memory MongoDB**: mongodb-memory-server may need disk space
- **Debug mode**: Run specific test with `npm test -- auth.test.js`

### 500 Internal Server Error
**Problem**: Generic server error response
- **Check logs**: Look at console output for detailed error
- **Middleware order**: Ensure error middleware is last in `app.js`
- **Async errors**: Use try-catch in async functions
- **Database errors**: Check MongoDB connection

### Socket.IO Connection Issues
**Problem**: Real-time features not working
- **CORS for WebSocket**: Check `corsOptions.socket` in `config/common.js`
- **Port availability**: Ensure server port is accessible
- **Client configuration**: Verify Socket.IO client connects to correct server URL

### Import/Module Errors
**Problem**: "Cannot find module" errors
- **npm install**: Ensure dependencies installed: `npm install`
- **Path errors**: Check correct relative paths in require statements
- **File exists**: Verify file location matches import path

### Performance Issues
**Problem**: API responses slow or server unresponsive
- **Database query optimization**: Check for N+1 queries
- **Mongoose lean()**: Use `.lean()` for read-only operations
- **Indexing**: Ensure database indexes created (unique index on doctor schedules)
- **Connection pooling**: MongoDB connection pool size configurable
- **Memory leaks**: Monitor process memory with `node --inspect`

### Need More Help?
1. Check existing test files for usage examples
2. Review error messages in console output
3. Verify all environment variables are set
4. Check MongoDB Atlas network/IP whitelist settings
5. Enable Node.js debug mode: `node --inspect server.js`

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

## 📊 Project Summary

**Doctor Appointment Booking System** is a production-ready backend API built with modern Node.js technologies. It provides:

✅ **Complete booking workflow** from patient registration to appointment confirmation  
✅ **Secure authentication** with JWT tokens and password reset functionality  
✅ **Role-based access control** for patients, doctors, and administrators  
✅ **Real-time capabilities** using Socket.IO for live notifications  
✅ **Comprehensive testing** with Jest and supertest  
✅ **API documentation** with interactive Swagger UI  
✅ **Email notifications** for password resets and updates  
✅ **Enterprise-grade security** with rate limiting, CORS, and Helmet  

**Perfect for**:
- Medical clinic management
- Hospital appointment systems
- Telemedicine platforms
- Healthcare SaaS applications

**Last Updated**: 2026-05-18  
**Version**: 1.0.0  
**Status**: Production Ready
