# Doctor Booking API - Test Suite Guide

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📋 Test Files Overview

| File | Purpose | Tests |
|------|---------|-------|
| `auth.test.js` | Authentication routes | Register, Login, Logout, Get Profile, Refresh Token |
| `doctor.test.js` | Doctor management | CRUD operations, Role-based access control |
| `schedule.test.js` | Schedule management | Create schedules, Get doctor schedules |
| `appointment.test.js` | Appointment booking | Book, View, Update appointment status |
| `integration.test.js` | End-to-end workflows | Complete booking flow, Multiple users, Error handling |

## 🧪 What's Tested

### ✅ Authentication Routes
- User registration with validation
- User login with password verification
- JWT token generation
- Protected route access
- User profile retrieval

### ✅ Doctor Routes
- List all doctors
- Get doctor details
- Create doctor (admin only)
- Update doctor info (admin only)
- Delete doctor (admin only)

### ✅ Schedule Routes
- Create doctor schedule with time slots
- Get schedules for a specific doctor
- Slot availability management

### ✅ Appointment Routes
- Book appointment from available slots
- View patient's appointments
- Update appointment status (admin only)
- Status workflow validation

### ✅ Integration Tests
- Complete booking workflow (register → login → create → book)
- Multiple patients booking same doctor
- Authorization validation
- Error handling & edge cases

## 📊 Demo Data

### Test Users
```
Patient Account:
- Email: patient@example.com
- Password: PatientPass123!

Admin Account:
- Email: admin@example.com
- Password: AdminPass123!
```

### Test Doctors
- Dr. Ahmed Smith - Cardiology (₹500/consultation)
- Dr. Sarah Johnson - Dermatology (₹400/consultation)
- Dr. Ali Khan - Orthopedics (₹550/consultation)

### Test Schedules
- Created for various dates in May-June 2026
- Slots: 30-minute intervals (9:00 AM - 5:00 PM)
- Multiple slots per day for testing concurrent bookings

## 🔧 Technology Stack

- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory test database
- **Mongoose**: MongoDB ODM

## 📈 Test Output Example

```
 PASS  auth.test.js (2.5s)
  Auth Routes
    POST /api/auth/register
      ✓ should register a new user successfully (45ms)
      ✓ should return error for invalid email (12ms)
      ✓ should return error for duplicate email (18ms)
    POST /api/auth/login
      ✓ should login user successfully (32ms)
      ✓ should return error for wrong password (15ms)

 PASS  doctor.test.js (1.8s)
  Doctor Routes
    GET /api/doctors
      ✓ should get all doctors (22ms)
      ✓ should return empty array when no doctors (18ms)

 PASS  appointment.test.js (3.2s)
  Appointment Routes
    POST /api/appointments/book
      ✓ should book appointment as patient (35ms)
      ✓ should return error for invalid schedule ID (28ms)

Test Suites: 5 passed, 5 total
Tests:       45+ passed, 45+ total
Snapshots:   0 total
Time:        8.5 s
```

## 🎯 Key Test Scenarios

### Scenario 1: User Registration
- Valid registration creates user
- Duplicate email rejected
- Invalid email format rejected
- Missing fields rejected

### Scenario 2: Doctor Creation Workflow
- Only admin can create doctors
- Patient cannot create doctors
- Doctor details saved correctly
- Doctor appears in list

### Scenario 3: Appointment Booking
- Patient books available slot
- Slot marked as unavailable
- Multiple patients can book different slots
- Only patients can book
- Only admins can update status

### Scenario 4: Authorization
- Protected routes require token
- Invalid token rejected
- Expired token rejected
- Role validation enforced (admin vs patient)

## 🐛 Troubleshooting

### Tests not running?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Memory Server errors?
```bash
# Ensure proper installation
npm install --save-dev mongodb-memory-server@latest
```

### Port conflicts?
- Tests use in-memory database, no port conflicts expected
- If issues persist, check firewall settings

### Test timeout?
```bash
# Increase timeout in test file or Jest config
npm test -- --testTimeout=10000
```

## 📚 Documentation

See `TEST_DOCUMENTATION.md` for detailed test documentation including:
- Comprehensive test coverage details
- Demo data specifications
- Expected outputs
- CI/CD integration examples

## 🔐 Security Features Tested

✅ Password hashing verification
✅ JWT token validation
✅ Role-based access control
✅ Input validation
✅ Protected endpoints

## 📝 Notes

- Each test suite runs in isolation with a fresh in-memory database
- No external database required
- Tests are fast and suitable for CI/CD
- Comprehensive error scenarios covered

## 🚀 Next Steps

1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Integrate with CI/CD pipeline
4. Add more test cases as needed
5. Monitor test results in pipeline

---

Happy Testing! 🎉
