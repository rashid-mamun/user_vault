# User Vault
A Node.js application using Express and MySQL for user registration, login, profile management, and account deletion.

## Features
- **User Registration**: Register users with email, password, and profile details.
- **User Login**: Authenticate users and generate a JWT token.
- **Profile Management**: View, update, and delete user profiles.
- **Security**: Password encryption, JWT authentication, and ACID-compliant database transactions.
- **File Upload**: Store profile photos locally using Multer for profile updates.

## Prerequisites
- **Node.js** (>= 18.x)
- **MySQL** (>= 8.0)
- **Docker** and **Docker Compose** (for containerized setup)
- A code editor (e.g., VS Code)

## Setup

### Local Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rashid-mamun/user_vault.git
   cd user_vault
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your MySQL credentials and other settings:
     ```env
     PORT=3000
     JWT_SECRET=your_jwt_secret_here
     image_folder=./Uploads
     DATABASE_HOST=localhost
     DATABASE_PORT=3306
     DATABASE=your_database_name
     DATABASE_USERNAME=your_database_user
     DATABASE_PASSWORD=your_database_password
     ```

4. **Set Up MySQL**:
   - Create a database in MySQL:
     ```sql
     CREATE DATABASE your_database_name;
     ```
   - Ensure MySQL is running and accessible with the credentials provided in `.env`.

5. **Create Uploads Folder**:
   - The application creates the `Uploads` folder automatically, but you can ensure it exists:
     ```bash
     mkdir Uploads
     ```

### Docker Setup
1. **Clone the Repository** (if not already done):
   ```bash
   git clone https://github.com/rashid-mamun/user_vault.git
   cd user_vault
   ```

2. **Set Up Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required values in `.env`:
     ```env
     PORT=3000
     JWT_SECRET=your_jwt_secret_here
     image_folder=./Uploads
     DATABASE_HOST=user_vault_db
     DATABASE_PORT=3306
     DATABASE=your_database_name
     DATABASE_USERNAME=your_database_user
     DATABASE_PASSWORD=your_database_password
     MYSQL_ROOT_PASSWORD=your_mysql_root_password
     ```

3. **Create Uploads Folder**:
   - Optional, as the app creates it:
     ```bash
     mkdir Uploads
     ```

## Running the Application

### Local Run
1. Start the MySQL server locally.
2. Run the application:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run start-dev
   ```

3. The API will be available at `http://localhost:3000`.

### Docker Run
1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. The API will be available at `http://localhost:3000`.

3. To stop the containers:
   ```bash
   docker-compose down
   ```

4. To remove volumes (e.g., to reset the database):
   ```bash
   docker-compose down -v
   ```

## API Endpoints

### 🔐 Register
**POST** `/api/register`  
**Content-Type**: `application/json`

**Body**:
- `firstName` (string, required): User's first name (3-30 alphanumeric characters).
- `lastName` (string, required): User's last name (3-30 alphanumeric characters).
- `email` (string, email format, required): User's email (.com or .net domains).
- `password` (string, required): User's password (3-30 alphanumeric characters).
- `nid` (integer, required): National ID number.
- `age` (integer, required): User's age (≥18).
- `isMarried` (boolean, required): Marital status (true/false).
- `profilePhoto` (string, optional): Profile photo filename (e.g., `photo.jpg`).

**Example**:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "pass123",
    "nid": 123456,
    "age": 30,
    "isMarried": false,
    "profilePhoto": "photo.jpg"
  }'
```

**Response (201 Created)**:
```json
{
  "message": "Record created successfully!",
  "response": {
    "profile": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "nid": 123456,
      "profilePhoto": "photo.jpg",
      "isMarried": false,
      "age": 30
    },
    "auth": {
      "email": "john@example.com",
      "password": "<hashed_password>",
      "profileId": 1
    }
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Failed to create record",
  "error": "<specific error, e.g., Validation error>"
}
```

### 🔑 Login
**POST** `/api/login`  
**Content-Type**: `application/json`

**Body**:
- `email` (string, email format, required): User's email.
- `password` (string, required): User's password.

**Example**:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful!"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "error": "Authentication failed: User not found"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "error": "Authentication failed: Invalid password"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "error": "Internal server error: <specific error>"
}
```

### 👤 View Profile
**GET** `/api/users/:id`  
**Content-Type**: `application/json`  
**Authorization**: Bearer `<token>`

**Parameters**:
- `id` (integer, required): Profile ID (must match authenticated user).

**Example**:
```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "nid": 123456,
  "profilePhoto": "photo.jpg",
  "isMarried": false,
  "age": 30,
  "auth": {
    "email": "john@example.com",
    "profileId": 1
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authorization header missing or invalid"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Unauthorized"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error>"
}
```

### ✏️ Update Profile
**PUT** `/api/users/:id`  
**Content-Type**: `application/json`  
**Authorization**: Bearer `<token>`

**Body**:
- `firstName` (string, optional): User's first name (3-30 alphanumeric characters).
- `lastName` (string, optional): User's last name (3-30 alphanumeric characters).
- `nid` (integer, optional): National ID number.
- `profilePhoto` (string, optional): Profile photo filename.
- `isMarried` (boolean, optional): Marital status.
- `age` (integer, optional): User's age (≥18).

**Parameters**:
- `id` (integer, required): Profile ID (must match authenticated user).

**Example**:
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"firstName":"John","lastName":"Smith","age":31}'
```

**Response (200 OK)**:
```json
[1]
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authorization header missing or invalid"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Unauthorized"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error>"
}
```

### 🗑️ Delete Profile
**DELETE** `/api/users/:id`  
**Content-Type**: `application/json`  
**Authorization**: Bearer `<token>`

**Parameters**:
- `id` (integer, required): Profile ID (must match authenticated user).

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK)**:
```json
1
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authorization header missing or invalid"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Unauthorized"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error>"
}
```

### 🔒 Update Password
**PUT** `/api/users/change-password/:id`  
**Content-Type**: `application/json`  
**Authorization**: Bearer `<token>`

**Body**:
- `email` (string, email format, required): User's email.
- `password` (string, required): New password (3-30 alphanumeric characters).

**Parameters**:
- `id` (integer, required): Profile ID (must match authenticated user).

**Example**:
```bash
curl -X PUT http://localhost:3000/api/users/change-password/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"email":"john@example.com","password":"newpass456"}'
```

**Response (200 OK)**:
```json
{
  "message": "Password updated successfully!"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authorization header missing or invalid"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Unauthorized"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error>"
}
```

### 🖼️ Upload Profile Photo
**POST** `/api/users/image/:id`  
**Content-Type**: `multipart/form-data`  
**Authorization**: Bearer `<token>`

**Body**:
- `avatar` (file, JPEG/PNG, required): Profile photo (max 1MB).

**Parameters**:
- `id` (integer, required): Profile ID (must match authenticated user).

**Example**:
```bash
curl -X POST http://localhost:3000/api/users/image/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "avatar=@/path/to/photo.jpg"
```

**Response (200 OK)**:
```json
[1]
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authorization header missing or invalid"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Unauthorized"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "User not found"
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error, e.g., Only .jpg, .png, or .jpeg format allowed!>"
}
```

### 👥 View All Profiles
**GET** `/api/users`  
**Content-Type**: `application/json`

**Example**:
```bash
curl -X GET http://localhost:3000/api/users
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "nid": 123456,
    "profilePhoto": "photo.jpg",
    "isMarried": false,
    "age": 30,
    "auth": {
      "email": "john@example.com",
      "profileId": 1
    }
  }
]
```

**Error Response (500 Internal Server Error)**:
```json
{
  "message": "Internal Server Error",
  "error": "<specific error>"
}
```

## Technologies Used
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MySQL**: Database
- **Sequelize**: ORM for MySQL
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **Multer**: File upload handling
- **Joi**: Input validation
- **Docker**: Containerization

## Notes
- The `Uploads` folder is created automatically but ensure it has write permissions for profile photo uploads.
- The database schema is managed by Sequelize’s `sync` method, which creates tables automatically. Use with caution in production to avoid unintended schema changes.
- The registration endpoint accepts `profilePhoto` as a string (e.g., a filename). Use `/api/users/image/:id` to upload actual image files.
- For production, secure the JWT secret and consider additional security measures like rate-limiting.
- Docker setups include health checks to ensure MySQL is ready before the app starts.
