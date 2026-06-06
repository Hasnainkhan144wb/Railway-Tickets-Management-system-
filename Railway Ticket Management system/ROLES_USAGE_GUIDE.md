# Railway Ticket Management System - User Roles Guide

## Overview
The system supports **3 user roles**:
1. **passenger** (default) - Regular users booking tickets
2. **staff** - Railway staff members
3. **admin** - System administrators

---

## 1. User Model Structure

Located in: `backend/models/User.js`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ["admin", "staff", "passenger"], default: "passenger"),
  timestamps: true (createdAt, updatedAt)
}
```

---

## 2. How to Create Users with Different Roles

### Option A: Using REST API - POST /api/auth/register

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "passenger"
}
```

**Role Values:**
- `"passenger"` - Default regular user
- `"staff"` - Railway staff member
- `"admin"` - System administrator

**Example Requests:**

1. **Create Passenger User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "pass123",
    "role": "passenger"
  }'
```

2. **Create Staff User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "password": "pass123",
    "role": "staff"
  }'
```

3. **Create Admin User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie Admin",
    "email": "admin@example.com",
    "password": "pass123",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "passenger"
  }
}
```

---

## 3. How to Login and Retrieve User Role

### Endpoint: `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (includes user role in token and response):**
```json
{
  "success": true,
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "passenger"
  }
}
```

**JWT Token Payload Contains:**
```javascript
{
  "id": "507f1f77bcf86cd799439011",
  "role": "passenger",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 4. How to Access User Details in Code

### In Controllers/Routes

```javascript
// After authentication middleware (protect middleware)
// req.user contains: { id, role }

const protect = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // { id, role }
  next();
};

// In your route handler
const exampleRoute = async (req, res) => {
  console.log(req.user); // { id: '...', role: 'passenger' }
  console.log(req.user.role); // "passenger", "staff", or "admin"
  
  // Check user role
  if (req.user.role === 'admin') {
    // Admin only operations
  }
  if (req.user.role === 'staff') {
    // Staff operations
  }
  if (req.user.role === 'passenger') {
    // Passenger operations
  }
};
```

---

## 5. Getting All Users with Details

### Endpoint: `GET /api/users`

**Request:**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "passenger",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "role": "staff",
    "createdAt": "2024-01-15T10:31:00Z",
    "updatedAt": "2024-01-15T10:31:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Charlie Admin",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:32:00Z",
    "updatedAt": "2024-01-15T10:32:00Z"
  }
]
```

---

## 6. Role-Based Access Control Implementation

### Creating Protected Routes by Role

```javascript
// authMiddleware.js - Add role-based middleware
const protectAdmin = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          message: "Access Denied - Admin Only"
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
  }
};

const protectStaff = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (!['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({
          message: "Access Denied - Staff/Admin Only"
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
  }
};

module.exports = { protect, protectAdmin, protectStaff };
```

### Using Role-Based Middleware in Routes

```javascript
// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');

// Admin-only endpoints
router.get('/dashboard', protectAdmin, adminController.getDashboard);
router.delete('/users/:id', protectAdmin, adminController.deleteUser);

module.exports = router;
```

---

## 7. Writing User Details to Database

### Using Create Method

```javascript
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Hash password and create user
const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'passenger'
  });
  
  return user;
};
```

### Using Update Method

```javascript
// Update user role
const updateUserRole = async (userId, newRole) => {
  return await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true } // Return updated document
  );
};

// Example usage:
await updateUserRole('507f1f77bcf86cd799439011', 'staff');
```

---

## 8. User Details Endpoints

### Get Single User by ID
```bash
GET /api/users/:id
Authorization: Bearer TOKEN
```

### Update User (if implemented)
```bash
PUT /api/users/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "staff"
}
```

### Delete User
```bash
DELETE /api/users/:id
Authorization: Bearer TOKEN
```

---

## 9. Frontend Usage - Storing User Details

### React/Vue Component Example

```javascript
// After login, store user data and token
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Store in localStorage/sessionStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // Use role for conditional rendering
  const userRole = data.user.role; // 'passenger', 'staff', or 'admin'
  
  if (userRole === 'admin') {
    navigate('/admin-dashboard');
  } else if (userRole === 'staff') {
    navigate('/staff-dashboard');
  } else {
    navigate('/passenger-dashboard');
  }
};
```

---

## 10. Common Queries

### Get Users by Role
```javascript
const { role } = req.query; // 'passenger', 'staff', or 'admin'
const users = await User.find({ role });
```

### Count Users by Role
```javascript
const admins = await User.countDocuments({ role: 'admin' });
const staff = await User.countDocuments({ role: 'staff' });
const passengers = await User.countDocuments({ role: 'passenger' });
```

---

## Summary Table

| Action | Method | Endpoint | Role Required |
|--------|--------|----------|----------------|
| Register User | POST | `/api/auth/register` | None |
| Login User | POST | `/api/auth/login` | None |
| Get All Users | GET | `/api/users` | Any (with token) |
| Delete User | DELETE | `/api/users/:id` | Should be Admin |
| Get User Detail | From JWT | - | In Token |

---

## Important Notes

1. **Role Assignment**: Always specify the `role` during registration. Default is `"passenger"`.
2. **Token Contains Role**: JWT token includes both `id` and `role`, accessible via `req.user`.
3. **Role Values**: Only accept `["admin", "staff", "passenger"]`. Other values will be rejected by schema validation.
4. **Password Security**: Passwords are hashed with bcrypt (salt: 10) before storage.
5. **Token Expiration**: JWT tokens expire in 7 days.
6. **Authorization Header**: Always include `Authorization: Bearer TOKEN` for protected routes.
