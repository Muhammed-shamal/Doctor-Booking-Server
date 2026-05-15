# Doctor Booking API - Test Suite Documentation

## Overview
This test suite provides comprehensive testing for all routes in the Doctor Booking API using Jest and Supertest. The tests cover authentication, doctors CRUD operations, schedules, and appointment booking workflows.

## Technologies Used
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Express routes
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing

## Test Files

### 1. `auth.test.js` - Authentication Routes
Tests all authentication endpoints:
- ✅ User Registration
- ✅ User Login
- ✅ Get Current User Profile
- ✅ Logout
- ✅ Refresh Token

**Demo Data Used:**
- Patient: `john@example.com` / `Password123!`
- Admin: `admin@example.com` / `AdminPass123!`

### 2. `doctor.test.js` - Doctor Management Routes
Tests all doctor CRUD operations:
- ✅ Get All Doctors
- ✅ Get Doctor by ID
- ✅ Create Doctor (Admin only)
- ✅ Update Doctor (Admin only)
- ✅ Delete Doctor (Admin only)

**Demo Data Used:**
- Dr. Ahmed Smith - Cardiology (10 years, ₹500)
- Dr. Sarah Johnson - Dermatology (8 years, ₹400)
- Dr. Ali Khan - Orthopedics (12 years, ₹550)

### 3. `schedule.test.js` - Schedule Management Routes
Tests schedule creation and retrieval:
- ✅ Create Doctor Schedule (Admin only)
- ✅ Get Doctor Schedules
- ✅ Validate Slot Management

**Demo Schedule Data:**
- Date: 2026-05-25
- Slots: 5 slots of 30 minutes each
- Times: 9:00-9:30, 9:30-10:00, 10:00-10:30, 14:00-14:30, 14:30-15:00

### 4. `appointment.test.js` - Appointment Booking Routes
Tests appointment booking and management:
- ✅ Book Appointment (Patient only)
- ✅ Get Patient's Appointments
- ✅ Update Appointment Status (Admin only)
- ✅ Validate Appointment States

**Demo Appointment Data:**
- Patient can book available slots
- Status transitions: pending → confirmed → completed/cancelled

### 5. `integration.test.js` - End-to-End Workflows
Tests complete workflows across multiple endpoints:
- ✅ Complete Booking Workflow
- ✅ Multiple Patient Booking
- ✅ Authorization Checks
- ✅ Edge Cases & Error Handling

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Tests in Watch Mode
```bash
npm run test:watch
```

### 4. Generate Coverage Report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:
- ✅ All HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ✅ Authorization & Authentication
- ✅ Input Validation
- ✅ Error Scenarios
- ✅ Role-Based Access Control (RBAC)
- ✅ Data Persistence
- ✅ Edge Cases
- ✅ Complete Workflows

## Demo Data Summary

### Users
- **Patient**: john@example.com / Password123!
- **Admin**: admin@example.com / AdminPass123!
- **Multiple Test Patients**: patient@example.com, patient2@example.com, etc.

### Doctors
| Name | Specialization | Experience | Fee |
|------|----------------|------------|-----|
| Dr. Ahmed Smith | Cardiology | 10 years | ₹500 |
| Dr. Sarah Johnson | Dermatology | 8 years | ₹400 |
| Dr. Ali Khan | Orthopedics | 12 years | ₹550 |
| Dr. Emma Davis | Pediatrics | 7 years | ₹450 |

### Schedules
- Multiple daily schedules for each doctor
- Slot duration: 30 minutes
- Example slots: 9:00-9:30, 9:30-10:00, 10:00-10:30, 14:00-14:30, etc.

### Appointments
- Patients can book any available slot
- Status workflow: pending → confirmed → completed/cancelled
- Each appointment includes: doctor, schedule, time slot, patient details

## Key Features Tested

### 1. Authentication
- Registration with email validation
- Login with password verification
- JWT token generation
- Protected routes with bearer tokens

### 2. Authorization
- Role-based access control (patient vs admin)
- Only admins can create/update/delete doctors
- Only patients can book appointments
- Only admins can update appointment status

### 3. Data Validation
- Required field validation
- Email format validation
- Password strength validation
- Invalid ID handling

### 4. Business Logic
- Prevent duplicate user registration
- Slot availability checking
- Appointment status transitions
- Doctor availability management

## Running Specific Tests

### Run only auth tests:
```bash
npm test -- auth.test.js
```

### Run only doctor tests:
```bash
npm test -- doctor.test.js
```

### Run only appointment tests:
```bash
npm test -- appointment.test.js
```

### Run with verbose output:
```bash
npm test -- --verbose
```

## Expected Test Results

When all tests run successfully, you should see:
```
PASS  auth.test.js
  Auth Routes
    POST /api/auth/register
      ✓ should register a new user successfully
      ✓ should return error for invalid email
      ✓ should return error for duplicate email
      ...
    POST /api/auth/login
      ✓ should login user successfully
      ...

PASS  doctor.test.js
  Doctor Routes
    GET /api/doctors
      ✓ should get all doctors
      ...

PASS  schedule.test.js
  Schedule Routes
    POST /api/schedules
      ✓ should create schedule as admin
      ...

PASS  appointment.test.js
  Appointment Routes
    POST /api/appointments/book
      ✓ should book appointment as patient
      ...

PASS  integration.test.js
  Integration Tests - Complete Workflow
    Complete Doctor Booking Workflow
      ✓ should complete full booking workflow
      ...

Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
```

## Troubleshooting

### Tests hanging?
- Ensure MongoDB Memory Server is properly installed
- Check Node.js version compatibility (requires Node 12+)

### Port conflicts?
- Each test run uses in-memory database
- No port conflicts expected

### Authentication errors?
- Verify JWT_SECRET environment variable if needed
- Check token generation in login controller

## CI/CD Integration

This test suite can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test
```

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Maintain >80% code coverage
4. Update test documentation

## License
ISC
