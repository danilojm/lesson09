# Project README

## Project Description

This project is a web application that integrates user authentication (local, Google, GitHub, Firebase) and provides functionality for managing projects and courses. The app leverages MongoDB for data storage, Passport.js for authentication, and Handlebars for templating.

---

## Setup Instructions

### Prerequisites

- **Node.js**: Install the latest version from [Node.js](https://nodejs.org/).
- **MongoDB**: Set up a local or cloud-based MongoDB database.
- **Environment Variables**: Create a `.env` file with the following variables:
  ```plaintext
  CONNECTION_STRING_MONGODB=<your-mongodb-connection-string>
  GOOGLE_CLIENT_ID=<your-google-client-id>
  GOOGLE_CLIENT_SECRET=<your-google-client-secret>
  GOOGLE_CALLBACK_URL=<your-google-callback-url>
  GITHUB_CLIENT_ID=<your-github-client-id>
  GITHUB_CLIENT_SECRET=<your-github-client-secret>
  GITHUB_CALLBACK_URL=<your-github-callback-url>
  FIREBASE_API_KEY=<your-firebase-api-key>
  FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
  FIREBASE_PROJECT_ID=<your-firebase-project-id>
  FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
  FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
  FIREBASE_APP_ID=<your-firebase-app-id>
  FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
  CSP_SCRIPT_SRC=<your-content-security-policy-script-source>
  ```

### Steps to Run the Application

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the application**:

   ```bash
   npm start
   ```

4. **Access the application**:  
   Open your browser and navigate to `http://localhost:3000`.

---

## Routes Overview

### CRUD Routes

- **Home (`/`)**:  
  Displays the homepage with user information.

- **Projects (`/projects`)**:

  - **GET**: List all projects.
  - **POST**: Create a new project.
  - **PUT**: Update an existing project.
  - **DELETE**: Delete a project.

- **Courses (`/courses`)**:
  - **GET**: List all courses.
  - **POST**: Add a new course.
  - **PUT**: Update course details.
  - **DELETE**: Remove a course.

### Authentication Routes

- **Login (`/login`)**:

  - **GET**: Render login page.
  - **POST**: Authenticate user credentials using local strategy.

- **Register (`/register`)**:

  - **GET**: Render registration page.
  - **POST**: Create a new user account.

- **Logout (`/logout`)**:  
  Ends the user session and redirects to login.

- **Google Authentication (`/auth/google`)**:  
  Redirects users to Google for OAuth authentication.

- **GitHub Authentication (`/github`)**:  
  Redirects users to GitHub for OAuth authentication.

---

## Access Control

1. **Middleware for Authentication**:  
   The app uses `passport.authenticate()` to secure protected routes. Middleware ensures that only authenticated users can access specific routes like `/projects` and `/courses`.

2. **Role-Based Access (Optional)**:  
   If roles (e.g., admin, user) are implemented, middleware can check `req.user.role` to restrict access further.

3. **Session Management**:  
   Sessions are handled via `express-session`. Logged-in user data is stored in the session and validated against the database using Passport's serialization and deserialization functions.

4. **Content Security Policy (CSP)**:  
   A dynamic CSP is applied to prevent unauthorized script execution, adding an extra layer of security.

---
