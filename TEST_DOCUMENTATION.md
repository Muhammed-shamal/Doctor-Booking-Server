# Doctor Booking API - Test Suite Documentation

## Overview
This test suite provides comprehensive testing for all routes in the Doctor Booking API using Jest and Supertest. The tests cover authentication, doctors CRUD operations, schedules, and appointment booking workflows.

## Technologies Used
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Express routes
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing

## Test Coverage

### Authentication Routes
- User registration with validation
- User login
- Logout functionality
- Get current user profile
- Token refresh

### Doctor Routes
- Get all doctors
- Get doctor by ID
- Create doctor (admin only)
- Update doctor
- Delete doctor

### Schedule Routes
- Create schedules
- Get doctor schedules

### Appointment Routes
- Book appointments
- Get patient appointments
- Update appointment status

## Running Tests

```bash
npm install
npm test
npm run test:coverage
```